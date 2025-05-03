import React, { useState } from 'react';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import { authService } from '../../../api/auth';
import './PasswordResetRequestModal.scss';

interface PasswordResetRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const PasswordResetRequestModal: React.FC<PasswordResetRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authService.passwordResetRequest(email);
      onSuccess(email);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error sending reset code');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Reset Password</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>
        <form className="modal__form" onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={setEmail}
            error={error}
            placeholder="Enter your email"
          />
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Code'}
          </Button>
        </form>
      </div>
    </div>
  );
}; 