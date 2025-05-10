import React, { useEffect } from 'react';
import { Button } from '../../ui/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { fetchCurrentSubscription, cancelSubscription } from '../../../store/slices/subscriptionSlice';
import './CurrentSubscriptionDashboard.scss';


export const CurrentSubscriptionDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentSubscription, loading, error } = useSelector(
    (state: RootState) => state.subscription
  );

  useEffect(() => {
    dispatch(fetchCurrentSubscription());
  }, [dispatch]);

  const handleCancelSubscription = async () => {
    if (currentSubscription) {
      await dispatch(cancelSubscription(currentSubscription.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status--active';
      case 'canceled':
        return 'status--canceled';
      case 'past_due':
        return 'status--past-due';
      default:
        return 'status--default';
    }
  };

  if (loading) {
    return <div className="current-subscription">Loading...</div>;
  }

  if (error) {
    return <div className="current-subscription">Error: {error}</div>;
  }

  if (!currentSubscription) {
    return null;
  }

  return (
    <div className="current-subscription">
      <div className="current-subscription__header">
        <h2 className="current-subscription__title">Current Subscription</h2>
        <span className={`current-subscription__status ${getStatusColor(currentSubscription?.status)}`}>
          {currentSubscription?.status}
        </span>
      </div>

      <div className="current-subscription__plan">
        <h3 className="current-subscription__plan-name">{currentSubscription.plan.name}</h3>
        <div className="current-subscription__plan-price">
          {currentSubscription.plan.price} {currentSubscription.plan.currency}/{currentSubscription.plan.interval}
        </div>
      </div>

      <div className="current-subscription__details">
        <div className="current-subscription__detail">
          <span className="current-subscription__label">Start Date:</span>
          <span className="current-subscription__value">{formatDate(currentSubscription.current_period_start)}</span>
        </div>
        <div className="current-subscription__detail">
          <span className="current-subscription__label">End Date:</span>
          <span className="current-subscription__value">{formatDate(currentSubscription.current_period_end)}</span>
        </div>
      </div>

      <div className="current-subscription__features">
        <h4 className="current-subscription__features-title">Plan Features:</h4>
        <ul className="current-subscription__features-list">
          {Object.entries(currentSubscription.plan.features).map(([key, feature], index) => (
            <li key={index} className="current-subscription__feature">
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="current-subscription__actions">
        <Button
          className="current-subscription__button current-subscription__button--cancel"
          onClick={handleCancelSubscription}
        >
          {currentSubscription.cancel_at_period_end ? 'Resume Subscription' : 'Cancel Subscription'}
        </Button>
      </div>
    </div>
  );
}; 