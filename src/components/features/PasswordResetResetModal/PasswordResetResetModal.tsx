import React, { useState } from 'react';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import { authService } from '../../../api/auth';
import './PasswordResetResetModal.scss';

interface PasswordResetResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  code: string;
  onSuccess: () => void;
}

export const PasswordResetResetModal: React.FC<PasswordResetResetModalProps> = ({ isOpen, onClose, email, code, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!password || !password2) return 'Both fields are required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== password2) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await authService.passwordResetReset({ email, code, password, password2 });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Set New Password</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>
        <form className="modal__form" onSubmit={handleSubmit}>
          <Input
            type="password"
            label="New Password"
            value={password}
            onChange={setPassword}
            error={error}
            placeholder="Enter new password"
          />
          <Input
            type="password"
            label="Confirm Password"
            value={password2}
            onChange={setPassword2}
            error={error}
            placeholder="Confirm new password"
          />
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}; 