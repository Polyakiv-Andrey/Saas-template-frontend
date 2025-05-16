import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { GoogleCallback } from './components/features/GoogleCallback/GoogleCallback';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { useEffect } from 'react';
import { fetchCurrentSubscription } from './store/slices/subscriptionSlice';
import { Support } from './pages/Support';
import { Layout } from './components/layout/Layout';
import { NotFound } from './pages/NotFound';
import { fetchCurrentUser } from './store/slices/authSlice';
import { PrivateRoute } from './components/routes/PrivateRoute';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCurrentUser());
      dispatch(fetchCurrentSubscription());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route 
            path="/support" 
            element={
              <PrivateRoute requireAdmin>
                <Support />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
