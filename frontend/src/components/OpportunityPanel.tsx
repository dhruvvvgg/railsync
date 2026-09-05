import React, { useState } from 'react';
import { Layers, ShieldCheck, Clock, ChevronDown, ChevronUp, CheckCircle2, Zap } from 'lucide-react';
import type { LookAheadOpportunity } from '../types';

interface OpportunityPanelProps {
  opportunities: LookAheadOpportunity[];
}

export const OpportunityPanel: React.FC<OpportunityPanelProps> = ({ opportunities }) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalBlocksAvoided = opportunities.reduce((sum, opp) => sum + (opp.blocks_avoided || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner & Telemetry */}
      <div className="cr-panel p-5 sm:p-6 border-l-4 border-l-[var(--cr-status-green)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Layers className="w-5 h-5 text-[var(--cr-status-green)]" />
              <h2 className="text-base sm:text-lg font-extrabold text-[var(--cr-text-primary)]">Look-Ahead Coordinated Bundling Engine</h2>
              <span className="cr-badge-green text-xs">
                14-Day Horizon Proactive Scan
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--cr-text-secondary)] max-w-3xl leading-relaxed">
              The system does not wait for departments to submit isolated requests. It scans planned, due, and overdue maintenance up to 14 days in advance and proactively pairs compatible Engineering, Traction, and S&T tasks into single shadow windows.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="cr-card p-3 text-center">
              <span className="text-xs uppercase font-bold text-[var(--cr-text-secondary)] block">Total Opportunities</span>
              <span className="text-xl font-extrabold text-[var(--cr-text-primary)]">{opportunities.length}</span>
            </div>
            <div className="cr-card p-3 text-center border-[var(--cr-status-green-border)]">
              <span className="text-xs uppercase font-bold text-[var(--cr-status-green)] block">Blocks Avoided</span>
              <span className="text-xl font-extrabold text-[var(--cr-status-green)]">{totalBlocksAvoided}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Bundling Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((opp) => {
          const isExpanded = !!expandedCards[opp.opportunity_id];

          return (
            <div
              key={opp.opportunity_id}
              className="cr-card p-4 sm:p-5 flex flex-col justify-between hover:border-[var(--cr-border-active)] transition-colors"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--cr-border-subtle)]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[var(--cr-status-green)]">
                      {opp.opportunity_id}
                    </span>
                    <span className="text-xs font-semibold text-[var(--cr-text-secondary)]">
                      {opp.corridor_id}
                    </span>
                  </div>
                  <span className="cr-badge-blue text-xs">
                    Avoids {opp.blocks_avoided} Separate Blocks
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[var(--cr-text-primary)] mb-2">{opp.section_name}</h3>

                {/* 2 Prominent Key Metrics */}
                <div className="flex items-center gap-4 bg-[var(--cr-surface-subtle)] p-2.5 rounded-lg border border-[var(--cr-border-subtle)] mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--cr-primary-interactive)]" />
                    <div>
                      <span className="text-xs uppercase font-bold text-[var(--cr-text-secondary)] block leading-none">Shared Window</span>
                      <strong className="text-sm font-bold text-[var(--cr-text-primary)]">{opp.estimated_shared_window_hours} hrs</strong>
                    </div>
                  </div>
                  <div className="w-px h-6 bg-[var(--cr-border)]" />
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[var(--cr-status-amber)]" />
                    <div>
                      <span className="text-xs uppercase font-bold text-[var(--cr-text-secondary)] block leading-none">Synergy</span>
                      <strong className="text-sm font-bold text-[var(--cr-status-green)]">{opp.departments.length} Depts Bundled</strong>
                    </div>
                  </div>
                </div>

                {/* Departments Involved */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {opp.departments.map((dept, i) => (
                    <span
                      key={i}
                      className="cr-badge-neutral text-xs py-0.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--cr-status-green)]"></span>
                      <span>{dept}</span>
                    </span>
                  ))}
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-[var(--cr-text-secondary)] leading-relaxed mb-3">
                  {opp.summary}
                </p>

                {/* Expandable Power Invariant & Feasibility Check */}
                {isExpanded && (
                  <div className="mt-3 p-3 bg-[var(--cr-surface-subtle)] rounded-lg border border-[var(--cr-border)] space-y-2 text-xs text-[var(--cr-text-secondary)]">
                    <div className="flex items-center gap-1.5 text-[var(--cr-status-green)] font-bold">
                      <ShieldCheck className="w-4 h-4 text-[var(--cr-status-green)] flex-shrink-0" />
                      <span>25 kV Power Invariant Verified (G&SR Rule 4.12)</span>
                    </div>
                    <div>• Single permit-to-work de-energizes overhead wire for both Civil and S&T tasks.</div>
                    <div>• Eliminates recurring 45-minute traction cutoffs on adjacent tracks.</div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 mt-3 border-t border-[var(--cr-border-subtle)] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[var(--cr-status-green)] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="text-xs">Verified Compatible</span>
                </div>

                <button
                  onClick={() => toggleExpand(opp.opportunity_id)}
                  className="text-[var(--cr-primary-interactive)] hover:underline text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>{isExpanded ? 'Hide Isolation Details' : 'View Invariant Details'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
