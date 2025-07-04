import React, { useContext, useEffect, useState } from 'react';
import LocationContext from '../context/locationContext';
import axios from 'axios';
import Buttons from '../components/buttons';

const backendUrl = import.meta.env.VITE_API_BASE_URL;

function ProfilePage() {
  const { profileInfo, infoGetter, fetchUserPOIs, userPOIs } = useContext(LocationContext);
  const [editInfo, setEditInfo] = useState({ name: '', email: '', pnum: '' });
  const [poiForm, setPoiForm] = useState({ name: '', category: '', location: '' });

  useEffect(() => { fetchUserPOIs(); }, []);

  const handleClick = () => {
    setEditInfo({
      name: profileInfo?.name || '',
      email: profileInfo?.email || '',
      pnum: profileInfo?.pnum || ''
    });
    document.getElementById('my_modal_1').showModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth-token');
      await axios.put(`${backendUrl}/api/user/updateuser`, editInfo, {
        headers: { 'auth-token': token }
      });
      await infoGetter();
      document.getElementById('my_modal_1').close();
    } catch (error) {
      console.error('Some Error Occurred!!', error);
    }
  };

  const handleDelete = async (poiId) => {
    try {
      const token = localStorage.getItem('auth-token');
      await axios.delete(`${backendUrl}/api/poi/delete-poi/${poiId}`, {
        headers: { 'auth-token': token }
      });
      fetchUserPOIs();
    } catch (error) {
      console.error('Error deleting POI:', error);
    }
  };

  // --- New POI Logic ---
  const handlePOIChange = (e) => {
    const { name, value } = e.target;
    setPoiForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePOISubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: poiForm.location,
          countrycodes:'in',
          format: 'json',
          limit: 1
        }
      });

      if (!data.length) {
        alert("Couldn't find location coordinates. Try a more specific name.");
        return;
      }

      const { lat, lon } = data[0];
      const locationStr = `${lat},${lon}`;
      const token = localStorage.getItem('auth-token');

      await axios.post(`${backendUrl}/api/poi/upload-poi`, {
        name: poiForm.name,
        category: poiForm.category,
        location: locationStr
      }, {
        headers: { 'auth-token': token }
      });

      fetchUserPOIs();
      setPoiForm({ name: '', category: '', location: '' });
      document.getElementById('poi_modal').close();
    } catch (err) {
      console.error("Error adding POI:", err);
      alert("Failed to add POI. Try again.");
    }
  };

  return (
    <div className="flex h-screen bg-base-200 text-white overflow-hidden">
      <aside className="w-64 bg-[#0f0f0f]/35 p-6 hidden lg:flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center">
            <img
              src="https://masterpiecer-images.s3.yandex.net/42f8251e747a11ee9c29b646b2a0ffc1:upscaled"
              className="w-20 h-20 rounded-full border-2 border-green-500"
              alt="profile"
            />
            <h2 className="mt-4 font-semibold">{profileInfo?.name || 'Loading.....'}</h2>
          </div>
          <nav className="mt-10 space-y-4">
            <Buttons />
          </nav>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-6 pt-6 max-w-5xl mx-auto">
          <div className="w-full relative">
            <img
              src="https://thumbs.dreamstime.com/b/abstract-food-background-top-view-dark-rustic-kitchen-table-wooden-cutting-board-cooking-spoon-frame-banner-137304354.jpg"
              alt="Banner"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
              <img
                src="https://masterpiecer-images.s3.yandex.net/42f8251e747a11ee9c29b646b2a0ffc1:upscaled"
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-black shadow-lg"
              />
            </div>
          </div>

          <div className="mt-20 w-full px-4">
            <h1 className="text-3xl font-bold text-center text-white">
              {profileInfo?.name || 'Loading...'}
            </h1>

            <div className="mt-10 w-full max-w-3xl mx-auto flex justify-between items-center">
              <h2 className="text-white text-lg font-semibold">Remaining Info:</h2>
              <button
                onClick={handleClick}
                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
                </svg>
                Edit
              </button>

              {/* Edit Modal */}
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box bg-base-100 text-white">
                  <h3 className="font-bold text-lg text-green-400 mb-4">Edit Profile Info</h3>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input type="text" name="name" value={editInfo.name} onChange={handleChange}
                      placeholder="Username" required className="input input-bordered w-full" />
                    <input type="email" name="email" value={editInfo.email} onChange={handleChange}
                      placeholder="Email" required className="input input-bordered w-full" />
                    <input type="tel" name="pnum" value={editInfo.pnum} onChange={handleChange}
                      placeholder="Phone" required className="input input-bordered w-full" />
                    <div className="modal-action justify-between">
                      <button type="submit" className="btn btn-success">Save</button>
                      <button type="button" className="btn" onClick={() => document.getElementById('my_modal_1').close()}>Cancel</button>
                    </div>
                  </form>
                </div>
              </dialog>
            </div>

            <div className="mt-2 collapse bg-base-100 border border-base-300 rounded">
              <input type="checkbox" />
              <div className="collapse-title font-semibold text-white">Click to view more info</div>
              <div className="collapse-content text-white space-y-4">
                <p><strong>Email:</strong> {profileInfo?.email}</p>
                <p><strong>Phone Number:</strong> {profileInfo?.pnum}</p>
                <p><strong>Role:</strong> {profileInfo?.role}</p>
              </div>
            </div>
          </div>

          {profileInfo?.role === 'admin' && (
            <div className="mt-12 w-full max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Your Uploaded Points of Interest</h2>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => document.getElementById('poi_modal').showModal()}
                >
                  Add POI
                </button>
              </div>

              {/* Add POI Modal */}
              <dialog id="poi_modal" className="modal">
                <div className="modal-box bg-base-100 text-white">
                  <h3 className="font-bold text-lg text-green-400 mb-4">Add New POI</h3>
                  <form onSubmit={handlePOISubmit} className="flex flex-col gap-4">
                    <input type="text" name="name" value={poiForm.name} onChange={handlePOIChange}
                      placeholder="POI Name" required className="input input-bordered w-full" />
                    <input type="text" name="category" value={poiForm.category} onChange={handlePOIChange}
                      placeholder="Category" required className="input input-bordered w-full" />
                    <input type="text" name="location" value={poiForm.location} onChange={handlePOIChange}
                      placeholder="Location name (e.g., Taj Mahal, Agra)" required className="input input-bordered w-full" />
                    <div className="modal-action justify-between">
                      <button type="submit" className="btn btn-success">Submit</button>
                      <button type="button" className="btn" onClick={() => document.getElementById('poi_modal').close()}>Cancel</button>
                    </div>
                  </form>
                </div>
              </dialog>

              {userPOIs.length === 0 ? (
                <p className="text-gray-400">You haven’t uploaded any POIs yet.</p>
              ) : (
                <ul className="space-y-4 my-6">
                  {userPOIs.map(poi => (
                    <li key={poi.id} className="bg-base-100 p-4 rounded-lg shadow border border-green-500">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-bold text-green-400">{poi.name}</h3>
                          <p className="text-gray-300"><strong>Location:</strong> {poi.location}</p>
                          <p className="text-gray-300"><strong>Category:</strong> {poi.category}</p>
                        </div>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleDelete(poi.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
