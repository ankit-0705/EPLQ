import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import RegisterPage from './routes/registerPage';
import LoginPage from './routes/loginPage';
import ProfilePage from './routes/profilePage';
import AboutPage from './routes/aboutPage';
import HomePage from './routes/homePage';
import LocationState from './context/locationState';

function App(){
  return(
    <>
      <LocationState>
        <Router>
          <Routes>
            <Route exact path='/' element={<RegisterPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/home' element={<HomePage/>}/>
            <Route path ='/profile' element={<ProfilePage/>}/>
            <Route path='/about' element={<AboutPage/>}/>
          </Routes>
        </Router>
      </LocationState>
    </>
  )
}

export default App