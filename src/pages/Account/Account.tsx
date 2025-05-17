import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { CurrentSubscriptionDashboard } from '../../components/features/CurrentSubscriptionDashboard/CurrentSubscriptionDashboard';
import BillingPortalButton from '../../components/features/BillingPortalButton/BillingPortalButton';
import './Account.scss';
import { SubscriptionPlans } from '../../components/features/SubscriptionPlans';
import { Input } from '../../components/ui/Input/Input';
import { authService } from '../../api/auth';
import { toast } from 'react-toastify';

export const Account: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const currentSubscription = useSelector((state: RootState) => state.subscription.currentSubscription);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState('');

  const validateNewPassword = (password: string) => {
    if (!/\d/.test(password)) {
      setNewPasswordError('Password must contain at least one number');
      return false;
    }
    setNewPasswordError('');
    return true;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateNewPassword(newPassword)) {
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await authService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        new_password2: confirmPassword
      });
      
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setNewPasswordError('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="account">
      <div className="account__header">
        <h1 className="account__title">Account Settings</h1>
        <div className="account__status">
          <span className={`account__status-badge ${user?.is_active ? 'account__status-badge--active' : ''}`}>
            {user?.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="account__grid">
        <div className="account__card">
          <h2 className="account__card-title">Profile Information</h2>
          <div className="account__info">
            <div className="account__info-item">
              <span className="account__label">Email</span>
              <span className="account__value">{user?.email}</span>
            </div>
          </div>
        </div>

        {currentSubscription && (
          <div className="account__card">
            <h2 className="account__card-title">Billing Management</h2>
            <div className="account__billing">
              <BillingPortalButton />
            </div>
          </div>
        )}
        <div className="account__card">
          <h2 className="account__card-title">Security Settings</h2>
          <form onSubmit={handlePasswordChange} className="account__form">
            <Input
              type="password"
              label="Current Password"
              value={oldPassword}
              onChange={setOldPassword}
              placeholder="Enter your current password"
              className="account__input"
            />
            <Input
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(value) => {
                setNewPassword(value);
                validateNewPassword(value);
              }}
              placeholder="Enter new password"
              className="account__input"
              error={newPasswordError}
            />
            <Input
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm new password"
              className="account__input"
            />
            <button 
              type="submit" 
              className="account__btn account__btn--primary"
              disabled={isLoading || !!newPasswordError}
            >
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>

        {currentSubscription && currentSubscription.cancel_at_period_end === false && (
          <div className="account__card account__card--subscription">
            <h2 className="account__card-title">Current Subscription</h2>
            <CurrentSubscriptionDashboard />
          </div>
        )}
         <div className="account__card account__card--subscription">
          <SubscriptionPlans />
        </div>
      </div>
    </div>
  );
}; 