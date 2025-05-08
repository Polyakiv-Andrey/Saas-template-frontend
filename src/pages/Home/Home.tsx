import React from 'react';
import { Header } from '../../components/layout/Header/Header';
import { SubscriptionPlans } from '../../components/features/SubscriptionPlans/SubscriptionPlans';
import './Home.scss';

export const Home: React.FC = () => {
  return (
    <div className="home">
      <Header />
      <SubscriptionPlans />
    </div>
  );
}; 