import React from 'react';
import { Header } from '../../components/layout/Header/Header';
import { SubscriptionPlans } from '../../components/features/SubscriptionPlans/SubscriptionPlans';
import { CurrentSubscriptionDashboard } from '../../components/features/CurrentSubscriptionDashboard/CurrentSubscriptionDashboard';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './Home.scss';

export const Home: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const currentSubscription = useSelector((state: RootState) => state.subscription.currentSubscription)

  return (
    <div className="home">
      <Header />
      <main className="home__main">
        <SubscriptionPlans />
        {isAuthenticated && currentSubscription && <CurrentSubscriptionDashboard />}
      </main>
    </div>
  );
}; 