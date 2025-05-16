import React from 'react';
import { SubscriptionPlans } from '../../components/features/SubscriptionPlans/SubscriptionPlans';
import { SupportForm } from '../../components/features/SupportForm';
import './Home.scss';

export const Home: React.FC = () => {
  return (
    <div className="home">
      <main className="home__main">
        <SubscriptionPlans />
        <SupportForm />
      </main>
    </div>
  );
}; 