import React from 'react'

const UberFooter = () => {
  return (
    <footer className="bg-black text-white pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row">

          {/* Column 1: Company */}
          <div className="col-sm-6 col-md-3 mb-4">
            <h6 className="fw-bold mb-3">Company</h6>
            <ul className="list-unstyled small">
              <li>About us</li>
              <li>Our offerings</li>
              <li>Newsroom</li>
              <li>Investors</li>
              <li>Blog</li>
              <li>Careers</li>
            </ul>
          </div>

          {/* Column 2: Products */}
          <div className="col-sm-6 col-md-3 mb-4">
            <h6 className="fw-bold mb-3">Products</h6>
            <ul className="list-unstyled  small">
              <li>Ride</li>
              <li>Drive</li>
              <li>Eat</li>
              <li>Uber for Business</li>
              <li>Uber Freight</li>
              <li>Gift cards</li>
              <li>Uber Health</li>
            </ul>
          </div>

          {/* Column 3: Global Citizenship */}
          <div className="col-sm-6 col-md-3 mb-4">
            <h6 className="fw-bold mb-3">Global citizenship</h6>
            <ul className="list-unstyled  small">
              <li>Safety</li>
              <li>Sustainability</li>
            </ul>
            <h6 className="fw-bold mt-4 mb-3">Travel</h6>
            <ul className="list-unstyled  small">
              <li>Reserve</li>
              <li>Airports</li>
              <li>Cities</li>
            </ul>
          </div>

          {/* Column 4: Contact + Social */}
          <div className="col-sm-6 col-md-3 mb-4">
            <h6 className="fw-bold mb-3">Connect</h6>
            <p className=" small mb-1">Uber Clone Inc.</p>
            <p className="small mb-2">Hyderabad, India</p>

            {/* Social icons */}
            <div className="d-flex gap-3">
              <a href="#" className="text-white"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-white"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
        </div>

        <hr className="border-secondary mt-4" />

        <div className="text-center small">
          © {new Date().getFullYear()} Uber. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default UberFooter
