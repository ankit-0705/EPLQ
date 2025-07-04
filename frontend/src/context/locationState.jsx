import { useState, useEffect } from 'react';
import LocationContext from './locationContext';
import axios from 'axios';
const backendUrl = import.meta.env.VITE_API_BASE_URL;

const LocationState = (props) => {
  const [profileInfo, setProfileInfo] = useState(null);
  const [userPOIs, setUserPOIs] = useState([]);

  // Fetch User Info
  const infoGetter = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        console.error("No token found!!!");
      }
      const response = await axios.post(
        `${backendUrl}/api/user/getuser`,
        {},
        { headers: { 'auth-token': token } }
      );
      setProfileInfo(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error.response?.data || error.message);
      setProfileInfo(null);
    }
  };

  const fetchUserPOIs = async ()=>{
    try {
      const token = localStorage.getItem('auth-token');
      const res = await axios.get(`${backendUrl}/api/poi/all-pois`,{
        headers:{'auth-token':token}
      });
      setUserPOIs(res.data);
    } catch (error) {
      console.error('Failed to fetch POIs:',error);
    }
  }


  // Fetch profile on mount
  useEffect(() => {
    infoGetter();
    fetchUserPOIs();
  }, []);

  return (
    <LocationContext.Provider value={{ profileInfo, infoGetter, fetchUserPOIs, userPOIs }}>
      {props.children}
    </LocationContext.Provider>
  );
};

export default LocationState;
