import React, { useState } from 'react';
import { Button } from '../../ui/Button/Button';
import { RegisterModal } from '../../features/RegisterModal/RegisterModal';
import { LoginModal } from '../../features/LoginModal/LoginModal';
import { PasswordResetRequestModal } from '../../features/PasswordResetRequestModal/PasswordResetRequestModal';
import { PasswordResetVerifyModal } from '../../features/PasswordResetVerifyModal/PasswordResetVerifyModal';
import { PasswordResetResetModal } from '../../features/PasswordResetResetModal/PasswordResetResetModal';
import { authService } from '../../../api/auth';
import { toast } from 'react-toastify';
import './Header.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { logout, login } from '../../../store/authSlice';

export const Header: React.FC = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const [resetStep, setResetStep] = useState<0 | 1 | 2 | null>(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');

  const handleLogin = () => {
    setResetStep(null);
    setResetEmail('');
    setResetCode('');
    setIsLoginModalOpen(true);
  };

  const handleRegister = () => {
    setIsRegisterModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleForgotPassword = () => {
    setIsLoginModalOpen(false);
    setResetStep(0);
  };

  const closeReset = () => {
    setResetStep(null);
    setResetEmail('');
    setResetCode('');
  };

  return (
    <header className="header">
      <div className="header__logo">Your Logo</div>
      <div className="header__actions">
        {isAuthenticated ? (
          <Button className="header__button" onClick={handleLogout}>Logout</Button>
        ) : (
          <>
            <Button className="header__button" onClick={handleLogin}>Login</Button>
            <Button className="header__button header__button--primary" onClick={handleRegister}>Register</Button>
          </>
        )}
      </div>
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onAuthenticated={() => dispatch(login())}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onAuthenticated={() => dispatch(login())}
        onForgotPassword={handleForgotPassword}
      />
      <PasswordResetRequestModal
        isOpen={resetStep === 0}
        onClose={closeReset}
        onSuccess={(email) => {
          setResetEmail(email);
          setResetStep(1);
        }}
      />
      <PasswordResetVerifyModal
        isOpen={resetStep === 1}
        onClose={closeReset}
        email={resetEmail}
        onSuccess={(code) => {
          setResetCode(code);
          setResetStep(2);
        }}
      />
      <PasswordResetResetModal
        isOpen={resetStep === 2}
        onClose={closeReset}
        email={resetEmail}
        code={resetCode}
        onSuccess={() => {
          closeReset();
          setIsLoginModalOpen(true);
          toast.success('Password changed successfully!');
        }}
      />
    </header>
  );
}; 