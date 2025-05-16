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
    return <div className="current-subscription current-subscription--loading">Loading...</div>;
  }

  if (error) {
    return <div className="current-subscription current-subscription--error">Error: {error}</div>;
  }

  if (!currentSubscription) {
    return null;
  }

  return (
    <div className="current-subscription current-subscription--card">
      <div className="current-subscription__header">
          <h2 className="current-subscription__title">Your Subscription</h2>
          <span className={`current-subscription__status-badge ${getStatusColor(currentSubscription?.status)}`}>{currentSubscription?.status}</span>
      </div>

      <div className="current-subscription__plan-block">
        <div className="current-subscription__plan-info">
          <h3 className="current-subscription__plan-name">{currentSubscription.plan.name}</h3>
          <div className="current-subscription__plan-price">
            <span className="current-subscription__plan-price-value">{currentSubscription.plan.price} {currentSubscription.plan.currency}</span>
            <span className="current-subscription__plan-interval">/{currentSubscription.plan.interval}</span>
          </div>
        </div>
        <div className="current-subscription__dates">
          <div className="current-subscription__date">
            <span className="current-subscription__label">Start:</span>
            <span className="current-subscription__value">{formatDate(currentSubscription.current_period_start)}</span>
          </div>
          <div className="current-subscription__date">
            <span className="current-subscription__label">End:</span>
            <span className="current-subscription__value">{formatDate(currentSubscription.current_period_end)}</span>
          </div>
        </div>
      </div>

      <div className="current-subscription__features-block">
        <h4 className="current-subscription__features-title">Features</h4>
        <ul className="current-subscription__features-list">
          {Object.entries(currentSubscription.plan.features).map(([key, feature], index) => (
            <li key={index} className="current-subscription__feature">
              {feature}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}; 