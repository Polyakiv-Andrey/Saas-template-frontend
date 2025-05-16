import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NotFound.scss';

export const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(from, { replace: true });
    }, 4000);
    return () => clearTimeout(timer);
  }, [from, navigate]);

  return (
    <div className="notfound">
      <div className="notfound__icon">🚫</div>
      <h1 className="notfound__title">404 — Page Not Found</h1>
      <p className="notfound__subtitle">Sorry, the page you are looking for does not exist or you don't have access.</p>
      <button className="notfound__btn" onClick={() => navigate(from, { replace: true })}>
        Go Back
      </button>
      <div className="notfound__autoredirect">You will be redirected automatically...</div>
    </div>
  );
}; 