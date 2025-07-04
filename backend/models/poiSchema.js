const mongoose = require('mongoose');
const poiSchema = new mongoose.Schema({
  nameEncrypted: { type: String, required: true },
  locationEncrypted: { type: String, required: true },
  category: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'userInfo' },
}, { timestamps: true });

module.exports = mongoose.model('poiInfo', poiSchema);
