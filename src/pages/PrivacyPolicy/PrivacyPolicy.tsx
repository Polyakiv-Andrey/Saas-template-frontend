import React, { useEffect, useState } from 'react';
import { legalApi, PrivacyPolicyResponse, PrivacyPolicySection } from '../../api/legal';
import './PrivacyPolicy.scss';

const renderSection = (section: PrivacyPolicySection, idx: number) => (
  <section className="privacy-policy__section" key={idx}>
    <h2 className="privacy-policy__heading">{section.heading}</h2>
    {section.text && <p className="privacy-policy__text">{section.text}</p>}
    {section.items && (
      <ul className="privacy-policy__list">
        {section.items.map((item, i) => (
          <li className="privacy-policy__item" key={i}>{item}</li>
        ))}
      </ul>
    )}
    {section.subsections && section.subsections.map((sub, j) => (
      <div className="privacy-policy__subsection" key={j}>
        <h3 className="privacy-policy__subheading">{sub.subheading}</h3>
        <ul className="privacy-policy__list">
          {sub.items.map((item, k) => (
            <li className="privacy-policy__item" key={k}>{item}</li>
          ))}
        </ul>
      </div>
    ))}
  </section>
);

export const PrivacyPolicy: React.FC = () => {
  const [policy, setPolicy] = useState<PrivacyPolicyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    legalApi.getPrivacyPolicy()
      .then(setPolicy)
      .catch(() => setError('Failed to load privacy policy.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="privacy-policy__loading">Loading...</div>;
  if (error) return <div className="privacy-policy__error">{error}</div>;
  if (!policy) return null;

  return (
    <div className="privacy-policy">
      <h1 className="privacy-policy__title">{policy.title}</h1>
      <div className="privacy-policy__updated">Last updated: {policy.last_updated}</div>
      <div className="privacy-policy__content">
        {policy.content.map(renderSection)}
      </div>
    </div>
  );
}; 