import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Membership from './pages/Membership';
import Connections from './pages/Connections';
import Requests from './pages/Requests';
import { useProfile } from './hooks/useAuth';
import { useMembership } from './hooks/usePayment';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { isLoading } = useProfile();
  useMembership(); // keep membership state fresh on every protected page

  if (isLoading) return <p style={{ color: '#aaa', textAlign: 'center', marginTop: '60px' }}>Loading...</p>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { isLoading } = useProfile();

  if (isLoading) return <p style={{ color: '#aaa', textAlign: 'center', marginTop: '60px' }}>Loading...</p>;
  return isAuthenticated ? <Navigate to="/feed" /> : children;
};

const App = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/feed" />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/membership" element={<ProtectedRoute><Membership /></ProtectedRoute>} />
        <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;
