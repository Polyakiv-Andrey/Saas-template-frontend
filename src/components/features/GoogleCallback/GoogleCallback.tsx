import './GoogleCallback.scss'
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../../store/slices/authSlice';

export const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get('access');
    const refresh = params.get('refresh');

    if (access && refresh) {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      dispatch(login());
      navigate('/'); 
    } else {
      if (window.opener) {
        setTimeout(() => window.close(), 100);
      } else {
        navigate('/'); 
      }
    }
  }, [navigate, dispatch]);

  return (
    <div className='googleAuthComplete' >
      <h2>Completing Google authentication...</h2>
      <p>Please wait while we process your login.</p>
    </div>
  );
}; 