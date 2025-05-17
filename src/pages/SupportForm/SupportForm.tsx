import React from 'react';
import { SupportForm } from '../../components/features/SupportForm';
import './SupportForm.scss';
import supportImg from '../../assets/support.png';

const SupportFormPage: React.FC = () => {
  return (
    <div className="support-form-page">
      <div className="support-form-page__left">
        <img src={supportImg} alt="Support" className="support-form-page__image" />
        <div className="support-form-page__info">
          <h2 className="support-form-page__title">Found a bug or have a question?</h2>
          <p className="support-form-page__desc">
            Use this form to let us know about any issues or questions you have. We'll help you resolve your problem or fix the bug. Thank you for helping us make the service better!
          </p>
        </div>
      </div>
      <div className="support-form-page__right">
        <SupportForm />
      </div>
    </div>
  );
};

export default SupportFormPage; 