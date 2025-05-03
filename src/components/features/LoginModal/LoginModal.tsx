import React, { useState } from 'react';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import { authService } from '../../../api/auth';
import './LoginModal.scss';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
  onForgotPassword: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose,
  onAuthenticated,
  onForgotPassword
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await authService.login({
        email,
        password,
      });
      onAuthenticated();
      onClose();
    } catch (error: any) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ submit: 'An error occurred during login' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Login</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>
        <form className="modal__form" onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            placeholder="Enter your email"
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            placeholder="Enter your password"
          />
          {errors.submit && <div className="modal__error">{errors.submit}</div>}
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button
              type="button"
              className="modal__link"
              onClick={onForgotPassword}
              style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline', fontSize: 14 }}
            >
              Forgot password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 