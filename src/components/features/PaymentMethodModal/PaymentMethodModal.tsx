import React from 'react';
import './PaymentMethodModal.scss';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { subscriptionService } from '../../../api/subscription';
import { AxiosError } from 'axios';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe(stripeKey)

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
  planId: number;
  planName: string;
  planPrice: number;
}

const StripeForm: React.FC<{ 
  onClose: () => void; 
  onPaymentSuccess?: () => void;
  planId: number;
  planName: string;
  planPrice: number;
}> = ({ onClose, onPaymentSuccess, planId, planName, planPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!stripe || !elements) {
      setError('Stripe is not initialized');
      return;
    }

    setLoading(true);

    try {
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }


      const response = await subscriptionService.createSubscription(planId, paymentMethod.id);

      if (response.status === 'active') {
        onPaymentSuccess?.();
        onClose();
      } else {
        setError('Payment failed');
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || 'An error occurred during payment');
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="payment-method-modal__stripe-form" onSubmit={handleSubmit}>
      <div className="payment-method-modal__plan-info">
        <h3>{planName}</h3>
        <p>${(planPrice ).toFixed(2)}/month</p>
      </div>
      <CardElement 
        className="payment-method-modal__card-element"
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      {error && <div className="payment-method-modal__error">{error}</div>}
      <button 
        className="payment-method-modal__pay-btn" 
        type="submit" 
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : `Subscribe for $${(planPrice).toFixed(2)}/month`}
      </button>
    </form>
  );
};

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ 
  isOpen, 
  onClose, 
  onPaymentSuccess,
  planId,
  planName,
  planPrice,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal payment-method-modal">
        <div className="modal__header">
          <h2 className="modal__title">Subscribe to {planName}</h2>
          <button className="modal__close" onClick={onClose}>&times;</button>
        </div>
        <Elements stripe={stripePromise}>
          <StripeForm 
            onClose={onClose} 
            onPaymentSuccess={onPaymentSuccess} 
            planId={planId}
            planName={planName}
            planPrice={planPrice}
          />
        </Elements>
      </div>
    </div>
  );
}; 