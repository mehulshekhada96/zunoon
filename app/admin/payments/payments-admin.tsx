'use client';

import { useEffect, useState, useTransition } from 'react';
import { inr, type PaymentRecord } from '@/lib/payments';
import { useConfirmDialog } from '@/components/theme-dialog';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
  XCircle,
  Check,
  AlertCircle,
  Phone,
  Mail
} from 'lucide-react';
import './payments.css';

async function api(path: string, options?: RequestInit) {
  const r = await fetch(path, { ...options, cache: 'no-store' });
  const data = await r.json();
  if (!r.ok) throw Error(data.error || 'Request failed');
  return data;
}

const date = (s?: string) =>
  s ? new Date(s).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) : '—';

export default function PaymentsAdmin({ embedded = false }: { embedded?: boolean } = {}) {
  const { confirm, DialogComponent } = useConfirmDialog();

  const [fee, setFee] = useState('2100');
  const [enabled, setEnabled] = useState(true);
  const [mode, setMode] = useState('');
  const [configured, setConfigured] = useState(false);

  const [rows, setRows] = useState<PaymentRecord[]>([]);
  const [summary, setSummary] = useState<{ _id: string; count: number; amount: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  const [status, setStatus] = useState('ALL');
  const [paymentMode, setPaymentMode] = useState('');
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [dateField, setDateField] = useState('createdAt');

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const query = new URLSearchParams({
    status,
    mode: paymentMode,
    q,
    from,
    to,
    dateField,
    page: String(page)
  }).toString();

  const isFiltered = !!(q || status !== 'ALL' || from || to);

  useEffect(() => {
    api('/api/admin/payments/settings/')
      .then(c => {
        setFee(String(c.feePaise / 100));
        setEnabled(c.enabled);
        setMode(c.mode);
        setConfigured(c.configured);
      })
      .catch(e => setError(e.message));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const timer = setTimeout(() => {
      api('/api/admin/payments/?' + query)
        .then(d => {
          if (active) {
            setRows(d.rows);
            setSummary(d.summary);
            setTotal(d.total);
            setPages(d.pages);
            setError('');
          }
        })
        .catch(e => {
          if (active) setError(e.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, refresh]);

  const reset = () => {
    setPage(1);
    setSelectedIds([]);
  };

  const handleClearFilters = () => {
    setQ('');
    setStatus('ALL');
    setPaymentMode('');
    setFrom('');
    setTo('');
    reset();
  };

  const deleteMembers = async (idsToDelete: string[], label: string) => {
    const isMultiple = idsToDelete.length > 1;
    const ok = await confirm({
      title: isMultiple ? `Delete ${idsToDelete.length} Members` : 'Delete Member Registration',
      message: `Are you sure you want to delete ${label}?\nThis action cannot be undone.`,
      confirmLabel: isMultiple ? `Delete ${idsToDelete.length} Members` : 'Delete Member',
      cancelLabel: 'Cancel',
      type: 'danger'
    });
    if (!ok) return;

    setBusy(true);
    try {
      const res = await api('/api/admin/payments/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete })
      });
      setSelectedIds(prev => prev.filter(id => !idsToDelete.includes(id)));
      setRefresh(v => v + 1);
      setNotice(`Successfully deleted ${res.deletedCount ?? idsToDelete.length} member(s).`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const deleteAllFiltered = async () => {
    const filterMsg = isFiltered ? `matching current filter (${total} members)` : `in the database (${total} members)`;
    const ok = await confirm({
      title: '⚠️ Delete All Registrations',
      message: `Are you sure you want to permanently delete ALL member registrations ${filterMsg}?\nThis action cannot be undone.`,
      requirePrompt: 'DELETE ALL',
      promptLabel: 'To confirm, please type "DELETE ALL" below:',
      confirmLabel: `Permanently Delete All (${total})`,
      cancelLabel: 'Cancel',
      type: 'danger'
    });
    if (!ok) return;

    setBusy(true);
    try {
      const res = await api('/api/admin/payments/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true, queryParams: { status, mode: paymentMode, q, from, to, dateField } })
      });
      setSelectedIds([]);
      setRefresh(v => v + 1);
      setNotice(`All ${res.deletedCount ?? total} member(s) deleted successfully.`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const allOnPageSelected = rows.length > 0 && rows.every(r => selectedIds.includes(r._id));
  const toggleSelectAllOnPage = () => {
    if (allOnPageSelected) {
      const pageIdSet = new Set(rows.map(r => r._id));
      setSelectedIds(prev => prev.filter(id => !pageIdSet.has(id)));
    } else {
      const pageIds = rows.map(r => r._id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleSaveFee = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      const paise = Math.round(Number(fee) * 100);
      await api('/api/admin/payments/settings/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feePaise: paise, enabled })
      });
      setNotice('✓ Membership fee settings saved. Existing orders keep their original amount.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const successItem = summary.find(x => x._id === 'SUCCESS');
  const pendingItem = summary.find(x => x._id === 'PENDING');
  const failedItem = summary.find(x => x._id === 'FAILED');

  return (
    <div className={`payments-admin-wrapper ${embedded ? 'embedded' : ''}`}>
      <main className="payments-admin">
        {/* Top Navigation Bar */}
        {!embedded && (
          <nav className="pay-topbar" aria-label="Breadcrumb">
            <div className="pay-topbar-left">
              <a href="/admin/" className="pay-topbar-back">
                <ArrowLeft size={15} />
                <span>Content & Media Admin</span>
              </a>
              <span className="pay-topbar-divider">/</span>
              <span className="pay-topbar-crumb">Membership Payments</span>
            </div>
            <div className="pay-topbar-right">
              <a href="/join/" target="_blank" rel="noreferrer" className="pay-topbar-link">
                <span>Registration Form</span>
                <ExternalLink size={13} />
              </a>
              <a href="/" target="_blank" rel="noreferrer" className="pay-topbar-link">
                <span>Live Website</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </nav>
        )}

      {/* Hero Header */}
      <header className="pay-hero">
        <div className="pay-hero-text">
          <h1>Membership & Registrations</h1>
          <p>Monitor membership payments, manage member records, and verify transactions with Razorpay.</p>
        </div>
        <div className="pay-hero-badge">
          <span className="pay-live-dot" />
          <span>India Standard Time (IST)</span>
        </div>
      </header>

      {/* Alerts */}
      {error && (
        <div className="pay-alert pay-alert-error" role="alert">
          <div className="pay-alert-content">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} className="pay-alert-close" aria-label="Dismiss error">
            <X size={16} />
          </button>
        </div>
      )}

      {notice && (
        <div className="pay-alert pay-alert-success" role="status">
          <div className="pay-alert-content">
            <CheckCircle2 size={18} />
            <span>{notice}</span>
          </div>
          <button type="button" onClick={() => setNotice('')} className="pay-alert-close" aria-label="Dismiss notice">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Settings Card */}
      <section className="pay-card pay-settings-card">
        <div className="pay-card-header">
          <div className="pay-card-header-title">
            <CreditCard size={20} className="pay-icon-accent" />
            <div>
              <h2>Membership Fee & Gateway Configuration</h2>
              <p>Configure the annual fee charged during new registration</p>
            </div>
          </div>
          <div className="pay-gateway-status">
            <span className={`pay-gateway-pill ${configured ? 'active' : 'inactive'}`}>
              <span className="pay-pill-indicator" />
              {configured ? (mode === 'live' ? 'Razorpay Live' : 'Razorpay Connected') : 'Razorpay Incomplete'}
            </span>
          </div>
        </div>

        <div className="pay-card-body">
          <form className="pay-settings-form" onSubmit={handleSaveFee}>
            <div className="pay-settings-fields">
              <div className="pay-field-group">
                <label htmlFor="annual-fee-input">Annual Membership Fee</label>
                <div className="pay-input-prefix-wrap">
                  <span className="pay-input-prefix">₹</span>
                  <input
                    id="annual-fee-input"
                    type="number"
                    min="1"
                    max="100000"
                    step="1"
                    required
                    value={fee}
                    onChange={e => setFee(e.target.value)}
                    className="pay-fee-input"
                    aria-label="Annual membership fee in Rupees"
                  />
                </div>
              </div>

              <div className="pay-field-group">
                <label htmlFor="accept-payments-toggle">Online Registration Status</label>
                <label className="pay-checkbox-card" htmlFor="accept-payments-toggle">
                  <input
                    id="accept-payments-toggle"
                    type="checkbox"
                    checked={enabled}
                    onChange={e => setEnabled(e.target.checked)}
                    className="pay-checkbox"
                  />
                  <div className="pay-checkbox-text">
                    <strong>Accept Online Payments</strong>
                    <small>{enabled ? 'Registration & checkout active on website' : 'Checkout currently paused'}</small>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" disabled={busy} className="pay-btn-primary">
              <Check size={16} />
              <span>Save Fee Settings</span>
            </button>
          </form>
        </div>
      </section>

      {/* KPI Metric Cards */}
      <section className="pay-kpi-grid" aria-label="Registration Statistics">
        <div className="pay-kpi-card type-success">
          <div className="pay-kpi-top">
            <span className="pay-kpi-label">SUCCESSFUL PAYMENTS</span>
            <div className="pay-kpi-icon-wrap success">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="pay-kpi-number">{successItem?.count || 0}</div>
          <div className="pay-kpi-meta">
            <strong>{inr(successItem?.amount || 0)}</strong>
            <span>total collected</span>
          </div>
        </div>

        <div className="pay-kpi-card type-pending">
          <div className="pay-kpi-top">
            <span className="pay-kpi-label">PENDING CHECKOUTS</span>
            <div className="pay-kpi-icon-wrap pending">
              <Clock size={18} />
            </div>
          </div>
          <div className="pay-kpi-number">{pendingItem?.count || 0}</div>
          <div className="pay-kpi-meta">
            <strong>{inr(pendingItem?.amount || 0)}</strong>
            <span>awaiting completion</span>
          </div>
        </div>

        <div className="pay-kpi-card type-failed">
          <div className="pay-kpi-top">
            <span className="pay-kpi-label">FAILED / CANCELLED</span>
            <div className="pay-kpi-icon-wrap failed">
              <XCircle size={18} />
            </div>
          </div>
          <div className="pay-kpi-number">{failedItem?.count || 0}</div>
          <div className="pay-kpi-meta">
            <strong>{inr(failedItem?.amount || 0)}</strong>
            <span>failed order value</span>
          </div>
        </div>
      </section>

      {/* Registrations Table Card */}
      <section className="pay-card pay-table-card">
        {/* Filters Bar */}
        <div className="pay-filter-bar">
          <div className="pay-filter-row-top">
            <div className="pay-search-box">
              <Search size={16} className="pay-search-icon" />
              <input
                type="search"
                placeholder="Search by member name, phone, email, order ID, or payment ID..."
                value={q}
                onChange={e => {
                  setQ(e.target.value);
                  reset();
                }}
                className="pay-search-input"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => {
                    setQ('');
                    reset();
                  }}
                  className="pay-search-clear"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="pay-filter-row-controls">
            <div className="pay-control-item">
              <label htmlFor="filter-status">Payment Status</label>
              <select
                id="filter-status"
                value={status}
                onChange={e => {
                  setStatus(e.target.value);
                  reset();
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="SUCCESS">Success Only</option>
                <option value="PENDING">Pending Only</option>
                <option value="FAILED">Failed Only</option>
              </select>
            </div>

            <div className="pay-control-item">
              <label htmlFor="filter-date-field">Date Field</label>
              <select
                id="filter-date-field"
                value={dateField}
                onChange={e => {
                  setDateField(e.target.value);
                  reset();
                }}
              >
                <option value="createdAt">Registration Date</option>
                <option value="paidAt">Payment Date</option>
              </select>
            </div>

            <div className="pay-control-item">
              <label htmlFor="filter-from-date">From</label>
              <input
                id="filter-from-date"
                type="date"
                value={from}
                onChange={e => {
                  setFrom(e.target.value);
                  reset();
                }}
              />
            </div>

            <div className="pay-control-item">
              <label htmlFor="filter-to-date">To</label>
              <input
                id="filter-to-date"
                type="date"
                value={to}
                onChange={e => {
                  setTo(e.target.value);
                  reset();
                }}
              />
            </div>

            <div className="pay-filter-buttons">
              <button
                type="button"
                onClick={() => setRefresh(v => v + 1)}
                className="pay-btn-refresh"
                title="Refresh registrations list"
                disabled={loading}
              >
                <RefreshCw size={14} className={loading ? 'spinning' : ''} />
                <span>Refresh</span>
              </button>

              {isFiltered && (
                <button type="button" onClick={handleClearFilters} className="pay-btn-clear">
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="pay-table-toolbar">
          <div className="pay-count-badge">
            <Users size={16} />
            <span>
              {loading ? 'Searching registrations…' : `${total} registration${total === 1 ? '' : 's'}`}
            </span>
            {isFiltered && <span className="pay-filtered-tag">Filtered</span>}
          </div>

          <div className="pay-toolbar-actions">
            <a
              href={`/api/admin/payments/?${query}&export=excel`}
              className="pay-btn-export"
              title="Download filtered data as Microsoft Excel (.xlsx)"
            >
              <FileSpreadsheet size={16} />
              <span>Export to Excel (.xlsx)</span>
            </a>

            <button
              type="button"
              className="pay-btn-delete-all"
              disabled={busy || total === 0}
              onClick={deleteAllFiltered}
              title="Permanently delete all matching registrations"
            >
              <Trash2 size={15} />
              <span>Delete All ({total})</span>
            </button>
          </div>
        </div>

        {/* Bulk Selection Bar */}
        {selectedIds.length > 0 && (
          <div className="pay-bulk-bar">
            <div className="pay-bulk-left">
              <span className="pay-bulk-badge">{selectedIds.length}</span>
              <span>
                <strong>{selectedIds.length}</strong> member{selectedIds.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="pay-bulk-buttons">
              <button
                type="button"
                className="pay-btn-delete-bulk"
                disabled={busy}
                onClick={() => deleteMembers(selectedIds, `${selectedIds.length} selected member(s)`)}
              >
                <Trash2 size={14} />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
              <button
                type="button"
                className="pay-btn-clear-selection"
                onClick={() => setSelectedIds([])}
              >
                Deselect All
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="pay-table-wrap">
          <table className="pay-table">
            <thead>
              <tr>
                <th style={{ width: '44px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    className="pay-checkbox"
                    aria-label="Select all rows on this page"
                    checked={allOnPageSelected}
                    onChange={toggleSelectAllOnPage}
                  />
                </th>
                <th>Member Details</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Dates (IST)</th>
                <th>Gateway Details</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const isSelected = selectedIds.includes(r._id);
                return (
                  <tr key={r._id} className={isSelected ? 'selected' : ''}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        className="pay-checkbox"
                        aria-label={`Select ${r.name}`}
                        checked={isSelected}
                        onChange={e => {
                          if (e.target.checked) setSelectedIds(prev => [...prev, r._id]);
                          else setSelectedIds(prev => prev.filter(id => id !== r._id));
                        }}
                      />
                    </td>
                    <td>
                      <div className="pay-member-cell">
                        <span className="pay-member-name">{r.name}</span>
                        <div className="pay-member-contact">
                          <span>
                            <Phone size={12} /> {r.phone}
                          </span>
                          {r.email && (
                            <span>
                              <Mail size={12} /> {r.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="pay-amount-badge">{inr(r.amount)}</span>
                    </td>
                    <td>
                      <span className={`pay-status-pill ${r.status}`}>{r.status}</span>
                      {r.checkoutClosedAt && <div className="pay-status-notes">Checkout closed by user</div>}
                      {r.failureReason && <div className="pay-status-notes">{r.failureReason}</div>}
                      {!!r.refundAmount && (
                        <div className="pay-status-notes" style={{ color: '#684000' }}>
                          Refunded: {inr(r.refundAmount)}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="pay-date-cell">
                        <span>Created: {date(r.createdAt)}</span>
                        {r.paidAt && <small>Paid: {date(r.paidAt)}</small>}
                      </div>
                    </td>
                    <td>
                      <div className="pay-gateway-cell">
                        <span>
                          Order: <strong>{r.orderId || 'Not created'}</strong>
                        </span>
                        <span>Payment: {r.paymentId || '—'}</span>
                        <span>Method: {r.method || '—'}</span>
                        <span>Ref: {r._id}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="pay-actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn-reconcile"
                          disabled={busy || !r.orderId}
                          onClick={async () => {
                            setBusy(true);
                            try {
                              await api('/api/admin/payments/reconcile/', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ reference: r._id })
                              });
                              setRefresh(v => v + 1);
                              setNotice('✓ Status successfully verified with Razorpay.');
                            } catch (e) {
                              setError((e as Error).message);
                            } finally {
                              setBusy(false);
                            }
                          }}
                          title="Query Razorpay API to check latest payment status"
                        >
                          <RefreshCw size={13} />
                          <span>Verify Razorpay</span>
                        </button>
                        <button
                          type="button"
                          className="btn-delete"
                          disabled={busy}
                          onClick={() => deleteMembers([r._id], `member "${r.name}" (${r.phone})`)}
                          title="Delete this registration"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!loading && rows.length === 0 && (
          <div className="pay-empty-state">
            <div className="pay-empty-icon-wrap">
              <Users size={30} />
            </div>
            <h3>No registrations found</h3>
            <p>
              {isFiltered
                ? 'No member records match your active search filters. Try adjusting your query or resetting filters.'
                : 'New payments made through the registration form will automatically appear here in real time.'}
            </p>
            {isFiltered && (
              <button type="button" className="pay-btn-primary pay-btn-reset-empty" onClick={handleClearFilters}>
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination Bar */}
        <div className="pay-pagination-bar">
          <div className="pay-pagination-info">
            Showing page <strong>{page}</strong> of <strong>{Math.max(1, pages)}</strong> (
            <strong>{total}</strong> total registration{total === 1 ? '' : 's'})
          </div>
          <div className="pay-pagination-controls">
            <button
              type="button"
              className="pay-btn-page"
              disabled={page <= 1 || loading}
              onClick={() => setPage(v => Math.max(1, v - 1))}
            >
              ← Previous
            </button>
            <span className="pay-page-count">
              {page} / {Math.max(1, pages)}
            </span>
            <button
              type="button"
              className="pay-btn-page"
              disabled={page >= pages || loading}
              onClick={() => setPage(v => v + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </section>

      {/* Themed Confirmation & Alert Dialog */}
      <DialogComponent />
    </main>
  </div>
  );
}
