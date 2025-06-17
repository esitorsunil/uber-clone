import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setStatusFilter, setUserFilter, resetFilters } from '../utils/redux/filterSlice';
import { users } from '../utils/user';

const RideFilterControls = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.rideFilter.status);
  const selectedUsers = useSelector((state) => state.rideFilter.users);

  const handleStatusChange = (e) => {
    dispatch(setStatusFilter(e.target.value));
  };

  const handleUserChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (opt) => opt.value);
    dispatch(setUserFilter(options));
  };

  return (
    <div className="d-flex justify-content-end align-items-center gap-3 mb-3">
      <div>
        <label className="form-label text-white mb-0">Status</label>
        <select
          className="form-select form-select-sm"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="form-label text-white mb-0">Users</label>
        <select
          className="form-select form-select-sm"
          multiple
          value={selectedUsers}
          onChange={handleUserChange}
        >
          {users
            .filter((u) => u.role === 'employee')
            .map((user) => (
              <option key={user.username} value={user.username}>
                {user.username}
              </option>
            ))}
        </select>
      </div>

      <button
        className="btn btn-sm btn-outline-light mt-4"
        onClick={() => dispatch(resetFilters())}
      >
        <i className="bi bi-arrow-clockwise"></i> Reset
      </button>
    </div>
  );
};

export default RideFilterControls;
