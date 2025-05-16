import React from 'react';
import { Header } from '../../components/layout/Header/Header';
import { SubscriptionPlans } from '../../components/features/SubscriptionPlans/SubscriptionPlans';
import { CurrentSubscriptionDashboard } from '../../components/features/CurrentSubscriptionDashboard/CurrentSubscriptionDashboard';
import { SupportForm } from '../../components/features/SupportForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './Home.scss';
import BillingPortalButton from '../../components/features/BillingPortalButton/BillingPortalButton';

export const Home: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const currentSubscription = useSelector((state: RootState) => state.subscription.currentSubscription)

  return (
    <div className="home">
      <Header />
      <main className="home__main">
        <SubscriptionPlans />
        {isAuthenticated && currentSubscription && currentSubscription.cancel_at_period_end === false && <CurrentSubscriptionDashboard />}
        {isAuthenticated && currentSubscription && <BillingPortalButton/>}
        <SupportForm />
      </main>
    </div>
  );
}; 