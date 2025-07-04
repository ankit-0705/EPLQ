import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function Buttons() {
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    setUserLocation(location.pathname);
  },[location]);

  return (
    <>
        <button onClick={()=>{navigate('/home')}} className={`w-full ${userLocation==='/home'?"bg-green-500":"border border-white"} py-2 rounded-md`}>Home</button>
        <button onClick={()=>{navigate('/profile')}} className={`w-full ${userLocation==='/profile'?"bg-green-500":"border border-white"} py-2 rounded-md`}>Profile</button>
        <button onClick={()=>{navigate('/about')}} className={`w-full ${userLocation==='/about'?"bg-green-500":"border border-white"} py-2 rounded-md`}>About Us</button>
    </>
  )
}

export default Buttons
