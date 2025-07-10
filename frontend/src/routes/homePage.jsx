import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Buttons from '../components/buttons';
import LocationContext from '../context/locationContext';

const backendUrl = import.meta.env.VITE_API_BASE_URL;

function HomePage() {
  const { profileInfo } = useContext(LocationContext);
  const [coords, setCoords] = useState(null);
  const [radius, setRadius] = useState(5);
  const [nearbyPOIs, setNearbyPOIs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showNoResultToast, setShowNoResultToast] = useState(false);

  // Get user location once
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => console.error('Location error:', err)
    );
  }, []);

  // Fetch nearby POIs on coords or radius change
  useEffect(() => {
    if (!coords) return;
    (async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const res = await axios.get(`${backendUrl}/api/poi/nearby`, {
          headers: { 'auth-token': token },
          params: { lat: coords.lat, lng: coords.lng, radius }
        });

        setNearbyPOIs(res.data);
      } catch (err) {
        console.error('Nearby POIs fetch failed:', err);
      }
    })();
  }, [coords, radius]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(stored);
  }, []);

  // Search handler
  const handleSearch = async () => {
  if (!searchTerm.trim()) return;
  try {
    const token = localStorage.getItem('auth-token');
    const params = { keyword: searchTerm };
    if (coords) {
      params.lat = coords.lat;
      params.lng = coords.lng;
    }

    const res = await axios.get(`${backendUrl}/api/poi/search-poi`, {
      headers: { 'auth-token': token },
      params
    });

    if(res.data.length===0){
      setShowNoResultToast(true);
      setTimeout(()=>setShowNoResultToast(false),3000);
    }

    setSearchResults(res.data);

    const updated = [searchTerm, ...recentSearches.filter(r => r !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  } catch (err) {
    console.error('Search failed:', err);
  }
};


  // Remove recent search item
  const removeRecentSearch = (item) => {
    const filtered = recentSearches.filter(r => r !== item);
    setRecentSearches(filtered);
    localStorage.setItem('recentSearches', JSON.stringify(filtered));
  };

  // Clear search results and input
  const clearSearchResults = () => {
    setSearchResults([]);
    setSearchTerm('');
  };

  // Open Google Maps at user location
  const openGoogleMaps = () => {
    if (!coords) return alert('Location not available');
    const { lat, lng } = coords;
    // Google Maps URL centered on user's location with zoom 14
    const url = `https://www.google.com/maps/@${lat},${lng},14z`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex min-h-screen bg-base-200 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f0f0f]/60 p-6 hidden lg:flex flex-col">
        <div>
          <div className="flex flex-col items-center">
            <img src="https://masterpiecer-images.s3.yandex.net/42f8251e747a11ee9c29b646b2a0ffc1:upscaled" className="w-20 h-20 rounded-full border-2 border-green-500" alt="profile" />
            <h2 className="mt-4 font-semibold">{profileInfo?.name}</h2>
          </div>
          <nav className="mt-10 space-y-4">
            <Buttons />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-8 overflow-y-auto">
        <h1 className="text-3xl font-bold">Welcome, {profileInfo?.name}</h1>

        {/* Search Bar + Recent Searches */}
        <section className="space-y-4 sticky top-0 bg-base-300 z-10 p-4 rounded-xl shadow-md">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              name="text"
              autoComplete="name"
              className="input input-bordered w-full bg-base-300"
              placeholder="Search POIs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-success" onClick={handleSearch}>Search</button>
            {searchResults.length > 0 && (
              <button className="btn btn-error" onClick={clearSearchResults}>
                Clear Results
              </button>
            )}
          </div>
          {recentSearches.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Recent Searches:</h3>
              <div className="flex gap-2 flex-wrap">
                {recentSearches.map((r, i) => (
                  <div key={i} className="badge badge-outline flex items-center gap-1 cursor-default select-none">
                    <button
                      className="pr-2"
                      onClick={() => {
                        setSearchTerm(r);
                        handleSearch();
                      }}
                    >
                      {r}
                    </button>
                    <button
                      className="text-red-500 font-bold"
                      onClick={() => removeRecentSearch(r)}
                      aria-label={`Remove recent search ${r}`}
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Nearby POIs Header + Google Maps Link */}
        <section className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Nearby POIs</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span>Radius: {radius} km</span>
              <input
                type="range"
                min="1"
                max="1000"
                value={radius}
                onChange={e => setRadius(Number(e.target.value))}
                className="range range-xs"
              />
            </div>
            <button
              className="btn btn-outline btn-accent"
              onClick={openGoogleMaps}
              disabled={!coords}
              title="Open your location in Google Maps"
            >
              Open in Google Maps
            </button>
          </div>
        </section>

        {/* Nearby POIs List */}
        <section>
          {nearbyPOIs.length === 0 ? (
            <p className="text-gray-400">No POIs found nearby.</p>
          ) : (
            <ul className="grid sm:grid-cols-1 gap-4">
              {nearbyPOIs.map(poi => {
                return (<li
                  key={poi.id}
                  className="bg-base-100 p-4 rounded shadow flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">{poi.name}</h3>
                    <p className="text-sm text-gray-400">{poi.location}</p>
                    <p className="text-sm text-green-400 capitalize">{poi.category}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm">Distance: {poi.distance} km</span>
                    <button
                      className="btn btn-xs btn-outline btn-accent mt-1"
                      onClick={() => {
                        const [lat, lng] = poi.location.split(',').map(Number);
                        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                        window.open(url, '_blank');
                      }}
                    >
                      Open in Google Maps
                    </button>
                  </div>
                </li>)
              })}
            </ul>
          )}
        </section>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Search Results</h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {searchResults.map(poi => {
              const [lat, lng] = poi.location.split(',').map(Number);
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
              return (
                <li key={poi.id} className="bg-base-100 p-4 rounded shadow flex justify-between items-center">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">{poi.name}</h3>
                    <span className="text-sm text-gray-400">
                      Distance: {poi.distance ? `${poi.distance} km` : 'N/A'}
                    </span>
                  </div>
                  <button
                    className="btn btn-xs btn-outline btn-accent"
                    onClick={() => window.open(mapsUrl, '_blank')}
                  >
                    Open in Google Maps
                  </button>
                </li>
              );
            })}
            </ul>
          </section>
        )}
      </main>
      {showNoResultToast && (
        <div className='toast toast-center z-50'>
          <div className='alert bg-gray-800 text-white border border-gray-700 shadow-lg'>
            <span>No POI found for '{searchTerm}'.</span>
          </div>
        </div>
      )};
    </div>
  );
}

export default HomePage;
