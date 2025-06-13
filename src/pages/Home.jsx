import React from 'react'
import UberFooter from '../components/UberFooter';
import { Link, useNavigate } from 'react-router-dom';

const serviceData = [
  {
    title: 'Ride',
    description: 'Get a ride in minutes with a tap.',
    img: 'https://mobile-content.uber.com/launch-experience/ride.png',
  },
  {
    title: 'Reserve',
    description: 'Book your ride in advance with Uber Reserve.',
    img: 'https://mobile-content.uber.com/uber_reserve/reserve_clock.png',
  },
  {
    title: 'Intercity',
    description: 'Travel between cities with comfort and ease.',
    img: 'https://mobile-content.uber.com/launch-experience/intercity.png',
  },
  {
    title: 'Shuttle',
    description: 'Affordable rides for daily commutes.',
    img: 'https://mobile-content.uber.com/launch-experience/hcv_shuttle.png',
  },
  {
    title: 'Deliver with Uber',
    description: 'Earn by delivering food or packages.',
    img: 'https://cn-geo1.uber.com/static/mobile-content/Courier.png',
  },
  {
    title: 'Hourly',
    description: 'Reserve a car and driver by the hour.',
    img: 'https://mobile-content.uber.com/launch-experience/Hourly2021.png',
  },
];

const Home = () => {
   const navigate = useNavigate(); 

  const handleBookRide = () => {
    navigate('/ride'); 
  };
  return (
    <>
    <section className="py-5 px-4">
      <div className="container">
        <div className="row align-items-center">

          <div className="col-md-6 mb-4 mb-md-0">
            <h2 className="fw-bold mb-3">Your ride, on demand</h2>
            <p className="mb-4">
              Tap a button, get a ride. Choose the ride option that fits your needs and budget.
              Enjoy your trip with real-time tracking, flexible options, and upfront pricing.
            </p>
            <button className="btn btn-dark" onClick={handleBookRide}>
                Book a Ride
              </button>
          </div>

          <div className="col-md-6 text-center">
            <img
              src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1712926828/assets/a3/cf8564-e2a6-418c-b9b0-65dd285c100b/original/3-2-ridesharing-new.jpg"
              alt="Uber Ride"
              className="img-fluid rounded"
            />
          </div>

        </div>
      </div>
    </section>

   <section className="py-5 px-4 bg-white">
  <div className="container">
  <h2 className="fw-bold mb-4">Suggested</h2> 
  <div className="row g-4">
    {serviceData.map((service, index) => (
      <div key={index} className="col-sm-12 col-md-6 col-lg-4">
        <div
          className="card h-100 border-0 shadow-sm p-3 d-flex flex-row align-items-center"
          style={{ backgroundColor: '#f3f3f3' }}
        >
          <div className="flex-grow-1 pe-3">
            <h5 className="card-title mb-2">{service.title}</h5>
            <p className="card-text small text-muted">{service.description}</p>
          </div>

          <div style={{ flexShrink: 0 }}>
            <img
              src={service.img}
              alt={service.title}
              className="rounded"
              style={{ width: '120px', height: '90px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
</section>

 <section className="py-5">
      <div className="container">
        <div className="row align-items-center">

          <div className="col-md-6 mb-4 mb-md-0">
            <h3 className="fw-bold">Log in to see your recent activity</h3>
            <p className="text-muted">
              View past trips, tailored suggestions, support resources, and more.
            </p>
            <Link to="/login" className="btn btn-dark mt-3">
              Log In to your account
            </Link>
          </div>

          <div className="col-md-6 text-center">
            <img
              src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1730197725/assets/0f/48c7ba-da13-4fdc-b54c-42878042f513/original/Airport-Fall.png"
              alt="Recent Activity"
              className="img-fluid rounded"
              style={{ maxHeight: '350px', objectFit: 'cover' }}
            />
          </div>

        </div>
      </div>
    </section>

    <section className="py-5 bg-white">
  <div className="container">
    <div className="row align-items-center">

      <div className="col-md-6 mb-4 mb-md-0">
        <video
          src="https://s3-ap-southeast-1.amazonaws.com/ola-prod-website/for-riders.mp4"
          className="rounded w-90"
          autoPlay
          muted
          loop
          playsInline
          style={{ maxHeight: '550px', objectFit: 'fit' }}
        />
      </div>

      <div className="col-md-6">
        <h1 className="mb-4 fw-bold">Making innovations since 2011</h1>

        <div className="mb-4">
          <h4 className="fw-semibold mb-2">For Riders</h4>
          <p className="text-secondary" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
            We constantly experiment to come up with industry-first features for our riders that eventually become a norm.
          </p>
        </div>

        <div>
          <h4 className="fw-semibold mb-2">For Drivers</h4>
          <p className="text-secondary" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
            Our drivers get real-time stats to help optimize their rides better and earn more, straight from the app.
          </p>
        </div>
      </div>

    </div>
  </div>
</section>
  <UberFooter />
    </>
  )
}

export default Home
