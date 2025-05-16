import React, { useEffect, useState } from 'react';
import { supportApi, SupportTicketResponse } from '../../api/support';
import './Support.scss';

export const Support: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicketResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<{ [id: number]: boolean }>({});

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await supportApi.getTickets();
        setTickets(data || []);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const getFirstLine = (text: string) => {
    const idx = text.indexOf('\n');
    return idx === -1 ? text : text.slice(0, idx);
  };

  return (
    <div className="support-page">
      <h1 className="support-page__title">Support Tickets</h1>
      <p className="support-page__subtitle">Here you can view and manage customer support tickets.</p>
      {loading && <div className="support-page__loading">Loading...</div>}
      {error && <div className="support-page__error">{error}</div>}
      {!loading && !error && (
        <div className="support-page__tickets-list">
          {tickets.length === 0 ? (
            <em className="support-page__empty">No tickets found.</em>
          ) : (
            <table className="support-page__table">
              <thead>
                <tr>
                  <th className="support-page__th">Reporter</th>
                  <th className="support-page__th">Title</th>
                  <th className="support-page__th">Description</th>
                  <th className="support-page__th">Image</th>
                  <th className="support-page__th">Status</th>
                  <th className="support-page__th">Created</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => {
                  const isLong = ticket.description.includes('\n') || ticket.description.length > 120;
                  const isExpanded = expanded[ticket.id];
                  return (
                    <tr className="support-page__tr" key={ticket.id}>
                      <td className="support-page__td">{ticket.reported_by_email}</td>
                      <td className="support-page__td">{ticket.title}</td>
                      <td className="support-page__td support-page__td--description">
                        {isExpanded ? (
                          <>
                            {ticket.description}
                            {isLong && (
                              <span
                                className="support-page__desc-toggle"
                                onClick={() => setExpanded(e => ({ ...e, [ticket.id]: false }))}
                                title="Collapse"
                              >
                                ▲
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            {getFirstLine(ticket.description)}
                            {isLong && (
                              <span
                                className="support-page__desc-toggle"
                                onClick={() => setExpanded(e => ({ ...e, [ticket.id]: true }))}
                                title="Expand"
                              >
                                ▼
                              </span>
                            )}
                          </>
                        )}
                      </td>
                      <td className="support-page__td">
                        {ticket.image_url ? (
                          <img className="support-page__image" src={ticket.image_url} alt="ticket attachment" />
                        ) : (
                          <span className="support-page__no-image">—</span>
                        )}
                      </td>
                      <td className={`support-page__td support-page__status support-page__status--${ticket.status}`}>{ticket.status}</td>
                      <td className="support-page__td">{new Date(ticket.created_at).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}; 