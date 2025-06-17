import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UberNavbar from './components/UberNavbar';
import Login from './components/Login';
import AdminView from './components/AdminView';
import ProtectedRoute from './Route/ProtectedRoute';
import UserView from './components/UserView';

const App = () => {
  return (
    <Router>
      <UberNavbar />

      <Routes>
        <Route path="/login" element={<Login />} />
       
       <Route
  path="/user"
  element={
    <ProtectedRoute allowedRoles={['employee']}>
      <UserView />
    </ProtectedRoute>
  }
/>        
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
