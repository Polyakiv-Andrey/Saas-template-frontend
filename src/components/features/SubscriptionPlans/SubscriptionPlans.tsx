import React, { useEffect, useState } from 'react';
import { Button } from '../../ui/Button/Button';
import { subscriptionService } from '../../../api/subscription';
import { LoginModal } from '../LoginModal/LoginModal';
import { PaymentMethodModal } from '../PaymentMethodModal/PaymentMethodModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import './SubscriptionPlans.scss';

interface Plan {
  id: number;
  name: string;
  price: string;
  currency: string;
  interval: string;
  features: { [key: string]: string };
  is_active: boolean;
}
interface CurrentSubscription {
  cancel_at_period_end: boolean;
  created_at: string; 
  current_period_end: string; 
  current_period_start: string; 
  id: number;
  plan: Plan;
  status: string; 
  stripe_subscription_id: string;
}

export const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<null | CurrentSubscription>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await subscriptionService.getPlans();
        setPlans(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const getCurrentSubscription = async () => {
      try {
        const data = await subscriptionService.getCurrentSubscription()
        setCurrentSubscription(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred') 
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated) {
      getCurrentSubscription()
    }
  }, [isAuthenticated, isPaymentModalOpen])


  const handleSubscribe = (plan: Plan) => {
    setSelectedPlan(plan);
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  if (loading) {
    return <div className="subscription-plans">Loading...</div>;
  }

  if (error) {
    return <div className="subscription-plans">Error: {error}</div>;
  }

  return (
    <section className="subscription-plans">
      <h2 className="subscription-plans__title">Subscription Plans</h2>
      <div className="subscription-plans__list">
        {plans.map((plan) => (
          <div className="subscription-plans__card" key={plan.id}>
            <h3 className="subscription-plans__card-title">{plan.name}</h3>
            <div className="subscription-plans__card-price">
              {plan.price} {plan.currency}/{plan.interval}
            </div>
            <ul className="subscription-plans__features">
            {Object.entries(plan.features).map(([key, feature], index) => (
              <li key={index}>
                {feature}
              </li>
            ))}
            </ul>
            {currentSubscription && currentSubscription.plan ? (
              currentSubscription.plan.id !== plan.id ? (
                <Button className="subscription-plans__button" onClick={() => handleSubscribe(plan)}>
                  Subscribe
                </Button>
              ) : (
                <div className="subscription-plans__subscribed">Subscribed</div>
              )
            ) : (
              <Button className="subscription-plans__button" onClick={() => handleSubscribe(plan)}>
                Subscribe
              </Button>
            )}
          </div>
        ))}
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onAuthenticated={() => setIsLoginModalOpen(false)}
        onForgotPassword={() => {}}
      />
      <PaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        planId={selectedPlan?.id ?? 0}
        planName={selectedPlan?.name ?? ''}
        planPrice={Number(selectedPlan?.price ?? 0)}
      />
    </section>
  );
}; 