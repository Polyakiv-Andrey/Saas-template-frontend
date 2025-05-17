import React from 'react';
import { SubscriptionPlans } from '../../components/features/SubscriptionPlans/SubscriptionPlans';
import './Home.scss';

export const Home: React.FC = () => {
  return (
    <div className="home">
      <main className="home__main">
        <SubscriptionPlans />
      </main>
    </div>
  );
}; 