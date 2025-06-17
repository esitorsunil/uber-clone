import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { users } from '../utils/user';
import RideDialog from '../components/RideDialogBox';
import RideMapView from '../components/RideMapView';
import { addRide, updateRide, deleteRide } from '../utils/redux/rideSlice';
import RideTable from '../components/RideTable';

const AdminView = ({ isUserView = false }) => {
  const rides = useSelector((state) => state.ride.rides);
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [editingRide, setEditingRide] = useState(null);
  const [viewRide, setViewRide] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user'));

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
            <i className="bi bi-kanban-fill me-2"></i> Admin Ride Dashboard
          </h3>
          <button className="btn btn-success" onClick={handleCreateRide}>
            <i className="bi bi-plus-circle me-1"></i> Create New Ride
          </button>
        </div>
      )}

      {rides.length === 0 ? (
        <div className="alert alert-warning text-center">
          <i className="bi bi-exclamation-triangle me-2"></i> No rides found. Click "Create New Ride" to get started.
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

      {/* Ride Dialog Box */}
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

      {/* Ride Map Modal */}
      {viewRide && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
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
