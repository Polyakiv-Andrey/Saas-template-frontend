import React, { useEffect, useState } from 'react';
import { supportApi, SupportTicketResponse } from '../../api/support';
import { Pagination } from '../../components/features/Pagination';
import './Support.scss';

const TICKET_STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const TABS = [
  { value: 'all', label: 'All' },
  ...TICKET_STATUSES,
];

export const Support: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicketResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<{ [id: number]: boolean }>({});
  const [openedImageUrl, setOpenedImageUrl] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [activeTab, setActiveTab] = useState<string>('all');

  const fetchTickets = async (customOffset = offset, status = activeTab) => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { limit, offset: customOffset };
      if (status !== 'all') params.status = status;
      const data = await supportApi.getTickets(params);
      setTickets(data.results || []);
      setCount(data.count || 0);
      setNext(data.next || null);
      setPrevious(data.previous || null);
      setOffset(customOffset);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(0, activeTab);
    // eslint-disable-next-line
  }, [activeTab]);

  const getFirstLine = (text: string) => {
    const idx = text.indexOf('\n');
    return idx === -1 ? text : text.slice(0, idx);
  };

  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    setStatusLoading(true);
    try {
      await supportApi.updateTicketStatus(ticketId, { status: newStatus });
      await fetchTickets();
    } catch (err) {
    } finally {
      setStatusLoading(false);
    }
  };

  const handlePageChange = (newOffset: number) => {
    fetchTickets(newOffset, activeTab);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    fetchTickets(0, tab);
  };

  return (
    <div className="support-page">
      <h1 className="support-page__title">Support Tickets</h1>
      <div className="support-page__header">
      <p className="support-page__subtitle">Here you can view and manage customer support tickets.</p>

        <div className="support-page__tabs">
          {TABS.map(tab => (
            <button
              key={tab.value}
              className={`support-page__tab${activeTab === tab.value ? ' support-page__tab--active' : ''}`}
              onClick={() => handleTabChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {loading && <div className="support-page__loading">Loading...</div>}
      {error && <div className="support-page__error">{error}</div>}
      {!loading && !error && (
        <>
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
                            <img
                              className="support-page__image"
                              src={ticket.image_url}
                              alt="ticket attachment"
                              onClick={() => setOpenedImageUrl(openedImageUrl === ticket.image_url ? null : ticket.image_url || null)}
                              style={{ cursor: 'pointer' }}
                            />
                          ) : (
                            <span className="support-page__no-image">—</span>
                          )}
                        </td>
                        <td className="support-page__td">
                          <div className={`support-page__status-select-wrapper status--${ticket.status}`}>
                            <select
                              className="support-page__status-select"
                              value={ticket.status}
                              onChange={e => handleStatusChange(ticket.id, e.target.value)}
                              disabled={statusLoading}
                            >
                              {TICKET_STATUSES.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="support-page__td">{new Date(ticket.created_at).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <Pagination
            count={count}
            next={next}
            previous={previous}
            limit={limit}
            offset={offset}
            onPageChange={handlePageChange}
          />
        </>
      )}
      {openedImageUrl && (
        <div className="support-page__image-modal" onClick={() => setOpenedImageUrl(null)}>
          <img src={openedImageUrl} alt="Full size" className="support-page__image-modal-img" />
        </div>
      )}
    </div>
  );
}; 