import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UberNavbar from './components/UberNavbar';
import Home from './pages/Home';
import DriverAccept from './components/DriverAccept';
import Tracking from './components/Tracking';
import PastTravels from './components/pastTravels';
import Ride from './components/Ride';

const App = () => {
  return (
    <Router>
      <UberNavbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ride" element={<Ride/>} />
        <Route path="/drive" element={<div className="p-5">🛣️ Activity</div>} />
        <Route path="/driver-accept" element={<DriverAccept/>}/>
        <Route path="/tracking" element={<Tracking/>}/>
        <Route path="/past-travels" element={<PastTravels/>}/>
      </Routes>
    
    </Router>
  );
};

export default App;
