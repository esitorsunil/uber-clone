import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { users } from '../utils/user';
import RideDialog from './RideDialogBox';
import RideMapView from './RideMapView'; // NEW
import { addRide, updateRide, deleteRide } from '../utils/redux/rideSlice';
import RideTable from './RideTable';

const AdminView = ({ isUserView = false }) => {
  const rides = useSelector((state) => state.ride.rides);
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [editingRide, setEditingRide] = useState(null);
  const [viewRide, setViewRide] = useState(null); // NEW

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
    dispatch(deleteRide(id));
  };

  return (
    <div className="container py-4">
      {!isUserView && (
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <h3 className="text-primary fw-bold mb-0">
            <i className="bi bi-kanban-fill me-2"></i> Admin Ride Management
          </h3>
          <button className="btn btn-success" onClick={handleCreateRide}>
            <i className="bi bi-plus-circle me-1"></i> Create New Task
          </button>
        </div>
      )}

      {rides.length === 0 ? (
        <div className="alert alert-warning text-center">
          <i className="bi bi-info-circle me-2"></i> No rides created yet.
        </div>
      ) : (
        <RideTable
          rides={rides}
          currentUser={currentUser}
          isUserView={isUserView}
          onEdit={handleEditRide}
          onDelete={handleDelete}
          onView={(ride) => setViewRide(ride)} // NEW
        />
      )}

      {/* Dialog for Assign/Edit */}
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

      {/* View Ride Modal */}
      {viewRide && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-geo-alt-fill me-2"></i> Ride Map View
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewRide(null)}
                ></button>
              </div>
              <div className="modal-body">
                <RideMapView ride={viewRide} />
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
