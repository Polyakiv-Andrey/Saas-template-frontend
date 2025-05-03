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

export const Header: React.FC = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  // Password reset state
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
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Forgot password flow
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
      <div className="header__button-group">
        {isAuthenticated ? (
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={handleLogin}>
              Login
            </Button>
            <Button variant="primary" onClick={handleRegister}>
              Register
            </Button>
          </>
        )}
      </div>
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onAuthenticated={() => setIsAuthenticated(true)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onAuthenticated={() => setIsAuthenticated(true)}
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