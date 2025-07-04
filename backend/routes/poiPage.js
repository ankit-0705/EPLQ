const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwtLogic');
const checkAdmin = require('../middleware/checkAdmin'); 
const POI = require('../models/poiSchema');
const CryptoJS = require('crypto-js');
require('dotenv').config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Utility: Encrypt & Decrypt functions
const encrypt = (text) => CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
const decrypt = (cipher) => CryptoJS.AES.decrypt(cipher, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

const haversineDistance = (c1, c2) => {
  const toRad = x => x * Math.PI / 180;
  const R = 6371;

  const dLat = toRad(c2.lat - c1.lat);
  const dLon = toRad(c2.lng - c1.lng);
  const a = Math.sin(dLat/2)**2 +
            Math.sin(dLon/2)**2 *
            Math.cos(toRad(c1.lat)) *
            Math.cos(toRad(c2.lat));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Route 1: Upload POI (Admins only)
router.post('/upload-poi', jwtMiddleware, checkAdmin, async (req, res) => {
  const { name, location, category } = req.body;

  if (!name || !location || !category) {
    return res.status(400).json({ error: "All fields (name, location, category) are required." });
  }

  // Validate location format: must be "lat,lng" with valid numbers
  const [latStr, lngStr] = location.split(',');
  if (!latStr || !lngStr || isNaN(parseFloat(latStr)) || isNaN(parseFloat(lngStr))) {
    return res.status(400).json({ error: "Invalid location format. Must be 'lat,lng' with valid numbers." });
  }

  try {
    const poi = await POI.create({
      nameEncrypted: encrypt(name),
      locationEncrypted: encrypt(location),
      category,
      uploadedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'POI uploaded successfully.',
      poiId: poi._id
    });
  } catch (err) {
    console.error("Upload POI Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});


// Route 2: Search POI with Distance if user location provided
router.get('/search-poi', jwtMiddleware, async (req, res) => {
  const { keyword, lat, lng } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "Search keyword is required." });
  }

  try {
    const pois = await POI.find({});
    const lowerKeyword = keyword.toLowerCase();

    const matched = pois.filter(poi => {
      const decryptedName = decrypt(poi.nameEncrypted);
      return decryptedName.toLowerCase().includes(lowerKeyword);
    });

    const results = matched.map(poi => {
      const locationStr = decrypt(poi.locationEncrypted);
      const [pll, pln] = locationStr.split(',').map(Number);
      let distance = null;

      if (lat && lng) {
        const dist = haversineDistance(
          { lat: parseFloat(lat), lng: parseFloat(lng) },
          { lat: pll, lng: pln }
        );
        distance = dist.toFixed(2); // in km
      }

      return {
        name: decrypt(poi.nameEncrypted),
        location: locationStr,
        category: poi.category,
        uploadedBy: poi.uploadedBy,
        createdAt: poi.createdAt,
        id: poi._id,
        distance
      };
    });

    res.json(results);
  } catch (err) {
    console.error("Search POI Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});



// Route 3: Get all POIs uploaded by the current user
router.get('/all-pois', jwtMiddleware, async (req, res) => {
  try {
    const pois = await POI.find({ uploadedBy: req.user.id });

    const result = pois.map(poi => ({
      name: decrypt(poi.nameEncrypted),
      location: decrypt(poi.locationEncrypted),
      category: poi.category,
      id: poi._id
    }));

    res.json(result);
  } catch (err) {
    console.error("Get All POIs Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});


// Route 4: Delete POI by ID (Owner or Admin)
router.delete('/delete-poi/:id', jwtMiddleware, async (req, res) => {
  try {
    const poi = await POI.findById(req.params.id);
    if (!poi) return res.status(404).json({ error: "POI not found." });

    // Allow if admin or owner
    if (req.user.role !== 'admin' && req.user.id !== poi.uploadedBy.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this POI." });
    }

    await POI.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "POI deleted successfully." });

  } catch (err) {
    console.error("Delete POI Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Ruote 5: Get nearby poi's
router.get('/nearby', jwtMiddleware, async (req, res) => {
  const { lat, lng, radius } = req.query;

  if (!lat || !lng || !radius) {
    return res.status(400).json({ error: 'lat, lng, and radius are required.' });
  }

  try {
    const pois = await POI.find({});
    const center = { lat: parseFloat(lat), lng: parseFloat(lng) };
    const parsedRadius = parseFloat(radius);
    const nearby = pois
      .map(poi => {
        try {
          const decryptedLocation = decrypt(poi.locationEncrypted);
          const [pll, pln] = decryptedLocation.split(',').map(Number);

          if (isNaN(pll) || isNaN(pln)) {
            console.warn(`Skipping POI ${poi._id}: invalid coordinates ->`, decryptedLocation);
            return null;
          }

          const dist = haversineDistance(center, { lat: pll, lng: pln });
          return { poi, dist };
        } catch (err) {
          console.error(`Error processing POI ${poi._id}:`, err.message);
          return null;
        }
      })
      .filter(item => item && item.dist <= parsedRadius);

    const results = nearby.map(({ poi, dist }) => ({
      id: poi._id,
      name: decrypt(poi.nameEncrypted),
      location: decrypt(poi.locationEncrypted),
      category: poi.category,
      distance: dist.toFixed(2), // in KM
    }));

    res.json(results);
  } catch (err) {
    console.error("Nearby POIs Error:", err);
    res.status(500).json({ error: "Server Error." });
  }
});


module.exports = router;
