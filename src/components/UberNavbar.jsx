import React from 'react';
import { Link } from 'react-router-dom';

const UberNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black shadow-sm p-2 px-5">
      <div className="nav w-100 d-flex justify-content-between align-items-center">

        <div className="d-flex align-items-center gap-4">
          <Link className="navbar-brand mb-0" to="/">
            <h4 className="text-white mb-0">Uber</h4>
          </Link>
          <ul className="navbar-nav flex-row gap-3">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/ride">Ride</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/drive">Drive</Link>
            </li>
          </ul>
        </div>

        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/past-travels">Booking</Link>
          </li>
        </ul>

      </div>
    </nav>
  );
};

export default UberNavbar;
