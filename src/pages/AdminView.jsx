import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { users } from '../utils/user';
import RideDialog from '../components/RideDialogBox';
import RideMapView from '../components/RideMapView';
import { addRide, updateRide, deleteRide } from '../utils/redux/rideSlice';
import RideTable from '../components/RideTable';
import DownloadReports from '../utils/DownloadReports';

const AdminView = ({ isUserView = false }) => {
  const rides = useSelector((state) => state.ride.rides);
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [editingRide, setEditingRide] = useState(null);
  const [viewRide, setViewRide] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user'));
   const pdfrides = JSON.parse(localStorage.getItem('adminRides') || '[]');

  const handleCreateRide = () => {
    setEditingRide(null);
    setShowDialog(true);
  };

  const handleEditRide = (ride) => {
    setEditingRide(ride);
    setShowDialog(true);
  };

  const handleSaveRide = (rideData) => {
    if (editingRide) {
      dispatch(updateRide({ ...editingRide, ...rideData }));
    } else {
      const newRide = {
        ...rideData,
        id: Date.now(),
        status: 'pending',
      };
      dispatch(addRide(newRide));
    }
    setShowDialog(false);
    setEditingRide(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this ride?')) {
      dispatch(deleteRide(id));
    }
  };

  return (
    <div className="container py-4">
      {!isUserView && (
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <h3 className="text-primary fw-bold mb-0">
            <i className="bi bi-kanban-fill me-2"></i> Admin Dashboard
          </h3>
          <button
            className="btn btn-success"
            onClick={handleCreateRide}
            title="Create a new ride and assign to an employee"
          >
            <i className="bi bi-plus-circle me-1"></i> New Ride
          </button>

           <DownloadReports rides={pdfrides} />
          
        </div>
      )}

      {rides.length === 0 ? (
        <div className="text-center my-5">
          <i className="bi bi-geo-alt-fill text-warning fs-1 mb-3"></i>
          <h5>No rides available</h5>
          <p className="text-muted">Start by creating a new ride task and assigning it to an employee.</p>
          {!isUserView && (
            <button className="btn btn-outline-primary mt-2" onClick={handleCreateRide}>
              <i className="bi bi-plus-circle me-1"></i> Create Ride
            </button>
          )}
        </div>
      ) : (
        <RideTable
          rides={rides}
          currentUser={currentUser}
          isUserView={isUserView}
          onEdit={handleEditRide}
          onDelete={handleDelete}
          onView={(ride) => setViewRide(ride)}
        />
      )}

      {!isUserView && showDialog && (
        <RideDialog
          onClose={() => {
            setShowDialog(false);
            setEditingRide(null);
          }}
          onSave={handleSaveRide}
          employees={users.filter((u) => u.role === 'employee')}
          initialData={editingRide}
        />
      )}

      {viewRide && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-map-fill me-2 text-primary"></i> Ride Map View
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewRide(null)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <RideMapView ride={viewRide} />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default AdminView;
