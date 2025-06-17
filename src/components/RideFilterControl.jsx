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

  return (
    <div className="d-flex justify-content-end align-items-end gap-3 mb-4 flex-wrap">
  
      <div style={{ minWidth: '180px' }}>
        <label className="form-label text-white mb-1">Status</label>
        <Select
          options={statusOptions}
          value={statusOptions.find((opt) => opt.value === status)}
          onChange={handleStatusChange}
          classNamePrefix="react-select"
          isClearable
          isSearchable
          placeholder="Filter by status"
        />
      </div>

      <div style={{ minWidth: '240px' }}>
        <label className="form-label text-white mb-1">Users ({selectedUsers.length})</label>
        <Select
          isMulti
          options={userOptions}
          value={userOptions.filter((opt) => selectedUsers.includes(opt.value))}
          onChange={handleUserChange}
          classNamePrefix="react-select"
          isClearable
          isSearchable
          placeholder="Filter by users"
        />
      </div>

      <div>
        <button
          className="btn btn-sm btn-outline-light mt-4"
          onClick={() => dispatch(resetFilters())}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Reset
        </button>
      </div>
    </div>
  );
};

export default RideFilterControls;
