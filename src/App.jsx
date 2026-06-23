import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from './components/layout/MainLayout/MainLayout';
import Loader from './components/common/Loader/Loader';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import { useProfile } from './hooks/useAuth';
import { useMembership } from './hooks/usePayment';

/* ── Lazy-loaded pages (code splitting) ── */
const Feed        = lazy(() => import('./pages/Feed/Feed'));
const Login       = lazy(() => import('./pages/Login/Login'));
const Signup      = lazy(() => import('./pages/Signup/Signup'));
const Profile     = lazy(() => import('./pages/Profile/Profile'));
const EditProfile = lazy(() => import('./pages/EditProfile/EditProfile'));
const Membership  = lazy(() => import('./pages/Membership/Membership'));
const Connections = lazy(() => import('./pages/Connections/Connections'));
const Requests    = lazy(() => import('./pages/Requests/Requests'));
const NotFound    = lazy(() => import('./pages/NotFound/NotFound'));

const PageLoader = () => <Loader size="lg" fullscreen />;

/* ── Route guards ── */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { isLoading } = useProfile();
  useMembership();

  if (isLoading) return <PageLoader />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { isLoading } = useProfile();

  if (isLoading) return <PageLoader />;
  return isAuthenticated ? <Navigate to="/feed" replace /> : children;
};

const App = () => (
  <BrowserRouter>
    <MainLayout>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"           element={<Navigate to="/feed" replace />} />
            <Route path="/login"      element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup"     element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/feed"       element={<ProtectedRoute><Feed /></ProtectedRoute>} />
            <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/edit"       element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/membership" element={<ProtectedRoute><Membership /></ProtectedRoute>} />
            <Route path="/connections"element={<ProtectedRoute><Connections /></ProtectedRoute>} />
            <Route path="/requests"   element={<ProtectedRoute><Requests /></ProtectedRoute>} />
            <Route path="*"           element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </MainLayout>
  </BrowserRouter>
);

export default App;
