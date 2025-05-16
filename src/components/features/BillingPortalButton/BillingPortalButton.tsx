import React from 'react';
import { subscriptionService } from '../../../api/subscription'; 
import { Button } from '../../ui/Button/Button';



export const BillingPortalButton: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const handleOpenPortal = async () => {

    setLoading(true);
    try {
      const { url } = await subscriptionService.createBillingPortalSession();
      window.location.href = url;  
    } catch (err) {
      console.error(err);
      alert('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleOpenPortal} disabled={loading}>
      {loading ? 'Loading…' : 'Manage Subscription'}
    </Button>
  );
};

export default BillingPortalButton