import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { CurrentSubscriptionDashboard } from '../../components/features/CurrentSubscriptionDashboard/CurrentSubscriptionDashboard';
import BillingPortalButton from '../../components/features/BillingPortalButton/BillingPortalButton';
import './Account.scss';
import { SubscriptionPlans } from '../../components/features/SubscriptionPlans';

export const Account: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const currentSubscription = useSelector((state: RootState) => state.subscription.currentSubscription);

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
          <div className="account__actions">
            <button className="account__btn account__btn--primary">
              Change Password
            </button>
          </div>
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