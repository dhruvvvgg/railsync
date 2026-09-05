import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Database, RefreshCw, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import type { DataQualityReport } from '../types';

interface DataQualityCenterProps {
  report: DataQualityReport | null;
  onRefresh: () => void;
}

export const DataQualityCenter: React.FC<DataQualityCenterProps> = ({ report, onRefresh }) => {
  const [selectedSystem, setSelectedSystem] = useState<string>('ALL');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  if (!report) {
    return (
      <div className="cr-panel p-8 text-center text-[var(--cr-text-secondary)] text-sm">
        Loading Data-Quality Validation Report...
      </div>
    );
  }

  const { summary } = report;

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpandAll = () => {
    const allExpanded = filteredIssues.every((_, idx) => expandedIds[`issue-${idx}`]);
    const newState: Record<string, boolean> = {};
    if (!allExpanded) {
      filteredIssues.forEach((_, idx) => {
        newState[`issue-${idx}`] = true;
      });
    }
    setExpandedIds(newState);
  };

  const filteredIssues = selectedSystem === 'ALL'
    ? summary.issues
    : summary.issues.filter(issue => issue.source_system.toUpperCase() === selectedSystem.toUpperCase());

  return (
    <div className="space-y-6">
      {/* Header Banner & Telemetry */}
      <div className="cr-panel p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <ShieldAlert className="w-5 h-5 text-[var(--cr-status-amber)]" />
              <h2 className="text-base sm:text-lg font-extrabold text-[var(--cr-text-primary)]">Data-Quality & Canonical Ingestion Gateway</h2>
              <span className="cr-badge-amber text-xs">
                Red-Team Quarantine Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--cr-text-secondary)] max-w-2xl leading-relaxed">
              Real railway feeds contain missing fields, duplicates, and stale inputs. RAILSYNC never silently drops or modifies dirty records. It flags them with actionable diagnostic reasons for Section Controllers.
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="cr-btn-secondary"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[var(--cr-primary-interactive)]" />
            <span>Re-Scan Feeds</span>
          </button>
        </div>

        {/* 4 Telemetry Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <div className="cr-card p-3.5">
            <span className="text-xs uppercase tracking-wider text-[var(--cr-text-secondary)] font-bold block mb-1">Screened</span>
            <span className="text-2xl font-extrabold text-[var(--cr-text-primary)]">{summary.total_records_screened}</span>
          </div>
          <div className="cr-card p-3.5 border-l-2 border-l-[var(--cr-status-green)]">
            <span className="text-xs uppercase tracking-wider text-[var(--cr-status-green)] font-bold block mb-1">Canonical & Valid</span>
            <span className="text-2xl font-extrabold text-[var(--cr-status-green)]">{summary.valid_records}</span>
          </div>
          <div className="cr-card p-3.5 border-l-2 border-l-[var(--cr-status-amber)]">
            <span className="text-xs uppercase tracking-wider text-[var(--cr-status-amber)] font-bold block mb-1">Flagged Anomalies</span>
            <span className="text-2xl font-extrabold text-[var(--cr-status-amber)]">{summary.anomalies_detected}</span>
          </div>
          <div className="cr-card p-3.5 border-l-2 border-l-[var(--cr-status-blue)]">
            <span className="text-xs uppercase tracking-wider text-[var(--cr-status-blue)] font-bold block mb-1">Gateway SLA</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[var(--cr-status-blue)]"></span>
              <span className="text-base font-bold text-[var(--cr-status-blue)]">PROTECTED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Source System Feed Health */}
      <div className="cr-panel p-5">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-[var(--cr-text-primary)] flex items-center gap-2">
            <Database className="w-4 h-4 text-[var(--cr-primary-interactive)]" />
            <span>Source System Ingestion Health</span>
          </h3>
          <span className="text-xs font-semibold text-[var(--cr-text-secondary)]">
            {Object.keys(summary.source_system_health).length} Integrated Feeds
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Object.entries(summary.source_system_health).map(([sys, counts]) => (
            <button
              key={sys}
              onClick={() => setSelectedSystem(selectedSystem === sys ? 'ALL' : sys)}
              className={`cr-card p-3 text-left transition-all cursor-pointer ${
                selectedSystem === sys
                  ? 'border-[var(--cr-primary-interactive)] bg-[var(--cr-surface-subtle)] shadow-xs'
                  : 'hover:border-[var(--cr-border-active)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--cr-text-primary)]">{sys}</span>
                {selectedSystem === sys && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--cr-primary-interactive)]"></span>
                )}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-[var(--cr-text-secondary)] text-xs font-medium">Tot: {counts.total}</span>
                {counts.issues > 0 ? (
                  <span className="cr-badge-amber text-xs py-0 px-1">
                    {counts.issues} flags
                  </span>
                ) : (
                  <span className="cr-badge-green text-xs py-0 px-1">
                    Clean
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Flagged Anomalies: Hierarchical & Expandable */}
      <div className="cr-panel p-5">
        <div className="flex flex-wrap items-center justify-between pb-3.5 mb-3 border-b border-[var(--cr-border-subtle)] gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[var(--cr-status-amber)]" />
            <h3 className="text-sm font-bold text-[var(--cr-text-primary)]">
              Active Flagged Anomalies ({filteredIssues.length})
            </h3>
            {selectedSystem !== 'ALL' && (
              <span className="cr-badge-blue text-xs">
                Filtered: {selectedSystem}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedSystem !== 'ALL' && (
              <button
                onClick={() => setSelectedSystem('ALL')}
                className="text-xs text-[var(--cr-text-secondary)] hover:underline cursor-pointer font-medium"
              >
                Clear Filter
              </button>
            )}
            <span className="text-xs text-[var(--cr-text-muted)]">
              Click an entry to inspect diagnostic reasons
            </span>
            <button
              onClick={toggleExpandAll}
              className="cr-btn-secondary text-xs"
            >
              {filteredIssues.every((issue) => expandedIds[`${issue.record_id}-${issue.source_system}`]) ? 'Collapse All' : 'Expand All Details'}
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredIssues.map((issue) => {
            const key = `${issue.record_id}-${issue.source_system}`;
            const isExpanded = !!expandedIds[key];

            return (
              <div
                key={key}
                className={`cr-card transition-colors ${
                  isExpanded ? 'border-[var(--cr-status-amber-border)] bg-[var(--cr-surface-subtle)]' : 'hover:border-[var(--cr-border-active)]'
                }`}
              >
                {/* Compact Primary Row */}
                <div
                  onClick={() => toggleExpand(key)}
                  className="p-3.5 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                    <span className="text-xs font-extrabold text-[var(--cr-primary-interactive)]">
                      {issue.record_id}
                    </span>
                    <span className="cr-badge-neutral text-xs py-0 px-1.5">
                      {issue.source_system}
                    </span>
                    <span className="text-xs text-[var(--cr-text-primary)] font-semibold">
                      {issue.entity_type}
                    </span>
                    <span className="cr-badge-amber text-xs py-0 px-1.5">
                      {issue.status}
                    </span>
                    <span className="text-xs text-[var(--cr-text-secondary)] truncate max-w-xs md:max-w-md hidden sm:inline-block">
                      {issue.reasons[0] || 'Anomaly detected'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--cr-primary-interactive)] font-bold flex items-center gap-1">
                      {isExpanded ? 'Hide Details' : 'View Action'}
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                </div>

                {/* Expanded High-Contrast Diagnostic & Action Breakdown */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-[var(--cr-border-subtle)] space-y-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--cr-status-amber)] block mb-1">
                        Diagnostic Reasons:
                      </span>
                      <ul className="space-y-1 bg-[var(--cr-surface)] p-3 rounded-lg border border-[var(--cr-border)] text-xs text-[var(--cr-text-primary)]">
                        {issue.reasons.map((r, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2">
                            <span className="text-[var(--cr-status-amber)] mt-0.5 font-bold">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--cr-primary-interactive)] block mb-1">
                        Recommended Operational Action:
                      </span>
                      <div className="bg-[var(--cr-surface)] p-3 rounded-lg border border-[var(--cr-border)] text-xs text-[var(--cr-text-primary)] flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[var(--cr-status-green)] mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed font-semibold">{issue.recommended_action}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
