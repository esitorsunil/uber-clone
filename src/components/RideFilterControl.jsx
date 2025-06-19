import { useState } from 'react';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import {
  setStatusFilter,
  setUserFilter,
  resetFilters,
} from '../utils/redux/filterSlice';
import { users } from '../utils/user';

const RideFilterControls = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const status = useSelector((state) => state.rideFilter.status);
  const selectedUsers = useSelector((state) => state.rideFilter.users);

  const statusOptions = [
    { value: 'all', label: 'None' },
    { value: 'pending', label: 'Pending' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
  ];

  const userOptions = users
    .filter((u) => u.role === 'employee')
    .map((user) => ({
      value: user.username,
      label: user.username,
    }));

  const handleStatusChange = (selected) => {
    dispatch(setStatusFilter(selected?.value || 'all'));
  };

  const handleUserChange = (selectedOptions) => {
    const selectedValues = selectedOptions?.map((opt) => opt.value) || [];
    dispatch(setUserFilter(selectedValues));
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setIsOpen(false);
  };

  return (
    <div className="container-fluid px-0">
      <div className="row gx-2 gy-2 align-items-center">
        <div className="col-auto ms-auto ">
          <button
            className="btn btn-sm btn-light border"
            onClick={() => setIsOpen(!isOpen)}
            title="Filters"
          >
            <i className="bi bi-filter fs-5"></i>
          </button>
        </div>

        {isOpen && (
          <div
            className="position-absolute bg-light text-dark p-3 rounded shadow border"
            style={{
              top: '3rem',
              right: '1rem',
              width: '280px',
              zIndex: 1000,
            }}
          >
            <div className="mb-3">
              <label className="form-label mb-1">Status</label>
              <Select
                options={statusOptions}
                value={statusOptions.find((opt) => opt.value === status)}
                onChange={handleStatusChange}
                classNamePrefix="react-select"
                isClearable
                isSearchable
                placeholder="Status"
              />
            </div>

            <div className="mb-3">
              <label className="form-label mb-1">Users ({selectedUsers.length})</label>
              <Select
                isMulti
                options={userOptions}
                value={userOptions.filter((opt) =>
                  selectedUsers.includes(opt.value)
                )}
                onChange={handleUserChange}
                classNamePrefix="react-select"
                isClearable
                isSearchable
                placeholder="Users"
              />
            </div>

            <div className="d-flex justify-content-between">
              <button className="btn btn-sm btn-outline-secondary" onClick={handleReset}>
                <i className="bi bi-arrow-clockwise"></i> Reset
              </button>
              <button className="btn btn-sm btn-outline-dark" onClick={() => setIsOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideFilterControls;
