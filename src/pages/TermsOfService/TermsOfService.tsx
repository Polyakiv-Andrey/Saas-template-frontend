import React, { useEffect, useState } from 'react';
import { legalApi, TermsOfServiceResponse, TermsOfServiceSection } from '../../api/legal';
import './TermsOfService.scss';

const renderSection = (section: TermsOfServiceSection, idx: number) => (
  <section className="terms__section" key={idx}>
    <h2 className="terms__heading">{section.heading}</h2>
    {section.text && <p className="terms__text">{section.text}</p>}
    {section.items && (
      <ul className="terms__list">
        {section.items.map((item, i) => (
          <li className="terms__item" key={i}>{item}</li>
        ))}
      </ul>
    )}
  </section>
);

export const TermsOfService: React.FC = () => {
  const [terms, setTerms] = useState<TermsOfServiceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    legalApi.getTermsOfService()
      .then(setTerms)
      .catch(() => setError('Failed to load terms of service.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="terms__loading">Loading...</div>;
  if (error) return <div className="terms__error">{error}</div>;
  if (!terms) return null;

  return (
    <div className="terms">
      <h1 className="terms__title">{terms.title}</h1>
      <div className="terms__date">Effective date: {terms.effective_date}</div>
      <div className="terms__content">
        {terms.content.map(renderSection)}
      </div>
    </div>
  );
}; 