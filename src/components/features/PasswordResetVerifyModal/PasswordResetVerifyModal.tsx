import React, { useState } from 'react';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import { authService } from '../../../api/auth';
import './PasswordResetVerifyModal.scss';

interface PasswordResetVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSuccess: (code: string) => void;
}

export const PasswordResetVerifyModal: React.FC<PasswordResetVerifyModalProps> = ({ isOpen, onClose, email, onSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authService.passwordResetVerify(email, code);
      onSuccess(code);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid code');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Enter Code</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>
        <form className="modal__form" onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Code"
            value={code}
            onChange={setCode}
            error={error}
            placeholder="Enter code from email"
          />
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </form>
      </div>
    </div>
  );
}; 