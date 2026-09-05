import React, { useState } from 'react';
import { FileCheck, Search, ShieldCheck, UserCheck } from 'lucide-react';

interface AuditLogViewerProps {
  logs: any[];
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleRow = (idx: number) => {
    setExpandedRows(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const str = `${log.timestamp || ''} ${log.action || ''} ${log.plan_name || ''} ${log.approved_by || ''} ${log.role || ''} ${log.reason || ''}`.toLowerCase();
    return str.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="cr-panel p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <FileCheck className="w-5 h-5 text-[var(--cr-primary-interactive)]" />
              <h2 className="text-base sm:text-lg font-bold text-[var(--cr-text-primary)]">Official Ledger & Approval Audit Trail</h2>
              <span className="cr-badge-neutral text-xs">
                CRIS Statutory Compliance
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--cr-text-secondary)] max-w-3xl leading-relaxed">
              Every candidate plan approval, override, and emergency re-dispatch action is immutably logged with authorized user credentials, role, timestamp, and justification reason.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[var(--cr-surface-subtle)] px-3.5 py-2 rounded-lg border border-[var(--cr-border)]">
            <ShieldCheck className="w-4 h-4 text-[var(--cr-status-green)]" />
            <span className="text-xs text-[var(--cr-text-secondary)]">
              <strong className="text-[var(--cr-text-primary)] font-bold">{logs.length}</strong> Immutable Records
            </span>
          </div>
        </div>
      </div>

      {/* Table Panel */}
      <div className="cr-panel p-5">
        {/* Search bar */}
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-[var(--cr-border)] gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="w-3.5 h-3.5 text-[var(--cr-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit records by controller, plan, or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--cr-bg)] border border-[var(--cr-border)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[var(--cr-text-primary)] placeholder-[var(--cr-text-muted)] focus:outline-none focus:border-[var(--cr-primary-interactive)]"
            />
          </div>

          <span className="text-xs text-[var(--cr-text-secondary)] tabular-nums">
            Showing {filteredLogs.length} of {logs.length}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[var(--cr-text-primary)]">
            <thead className="bg-[var(--cr-surface-subtle)] text-[var(--cr-text-secondary)] uppercase text-xs font-bold border-b border-[var(--cr-border)]">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Context / Plan</th>
                <th className="py-2.5 px-3">Authorized By</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Justification Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cr-border)]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[var(--cr-text-muted)] italic">
                    {logs.length === 0
                      ? 'No approval records recorded in this session yet. Authorize a candidate plan to create an entry.'
                      : 'No records match search criteria.'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, i) => {
                  const isExpanded = !!expandedRows[i];
                  const reasonText = log.reason || log.resolution || 'Automated CP-SAT dynamic schedule repair trace.';
                  const isLongReason = reasonText.length > 55;

                  return (
                    <tr key={i} className="hover:bg-[var(--cr-surface-subtle)] transition-colors">
                      <td className="py-3 px-3 tabular-nums text-[var(--cr-text-secondary)] whitespace-nowrap font-medium">
                        {log.timestamp?.slice(0, 19).replace('T', ' ')}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={log.action === 'APPROVED' ? 'cr-badge-green' : 'cr-badge-blue'}>
                          {log.action || 'EVENT'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[var(--cr-text-primary)] font-semibold whitespace-nowrap">
                        {log.plan_name || log.incident || 'System Event'}
                      </td>
                      <td className="py-3 px-3 text-[var(--cr-primary-interactive)] font-semibold whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-[var(--cr-primary-interactive)]" />
                          <span>{log.approved_by || 'Control Office Engine'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[var(--cr-text-secondary)] whitespace-nowrap font-medium">
                        {log.role || 'System'}
                      </td>
                      <td className="py-3 px-3 text-[var(--cr-text-primary)]">
                        <div>
                          <span>
                            {isLongReason && !isExpanded ? `${reasonText.slice(0, 55)}...` : reasonText}
                          </span>
                          {isLongReason && (
                            <button
                              onClick={() => toggleRow(i)}
                              className="ml-2 text-[var(--cr-primary-interactive)] hover:underline text-xs inline-flex items-center cursor-pointer font-bold"
                            >
                              {isExpanded ? 'Less' : 'More'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
