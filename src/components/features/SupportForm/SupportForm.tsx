import React, { useState } from 'react';
import { supportApi } from '../../../api/support';
import { Button } from '../../ui/Button/Button';
import './SupportForm.scss';

export const SupportForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!title.trim() || !description.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    try {
      await supportApi.createTicket({ title, description });
      setSuccess(true);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="support-form" onSubmit={handleSubmit}>
      <h2 className="support-form__title">Contact Support</h2>
      {success && <div className="support-form__success">Your ticket has been submitted!</div>}
      {error && <div className="support-form__error">{error}</div>}
      <div className="support-form__group">
        <label htmlFor="subject" className="support-form__label">Subject</label>
        <input
          id="subject"
          className="support-form__input"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
          maxLength={100}
          required
        />
      </div>
      <div className="support-form__group">
        <label htmlFor="message" className="support-form__label">Message</label>
        <textarea
          id="message"
          className="support-form__textarea"
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={loading}
          rows={6}
          maxLength={1000}
          required
        />
      </div>
      <div className="support-form__actions">
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Submit Ticket'}
        </Button>
      </div>
    </form>
  );
}; 