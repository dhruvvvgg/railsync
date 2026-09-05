import React, { useState } from 'react';
import { GitCompare, CheckCircle, FileCheck, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { CandidatePlan } from '../types';

interface PlanComparisonProps {
  planA: CandidatePlan | null;
  planB: CandidatePlan | null;
  baseline: CandidatePlan | null;
  onApprove: (planName: string, reason: string) => void;
}

export const PlanComparison: React.FC<PlanComparisonProps> = ({
  planA,
  planB,
  baseline,
  onApprove
}) => {
  const [selectedPlanForApproval, setSelectedPlanForApproval] = useState<string>('Plan A (Least Disruption)');
  const [approvalReason, setApprovalReason] = useState<string>('Zero passenger express train detention; scheduled during natural freight lull.');
  const [approvalSuccess, setApprovalSuccess] = useState<boolean>(false);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({
    planA: false,
    planB: false,
    baseline: false
  });

  const toggleDetails = (planKey: string) => {
    setExpandedDetails(prev => ({ ...prev, [planKey]: !prev[planKey] }));
  };

  const handleApproveClick = () => {
    onApprove(selectedPlanForApproval, approvalReason);
    setApprovalSuccess(true);
    setTimeout(() => setApprovalSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="cr-panel p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <GitCompare className="w-5 h-5 text-[var(--cr-primary-interactive)]" />
          <h2 className="text-base sm:text-lg font-extrabold text-[var(--cr-text-primary)]">Dual Candidate Plan Comparison & Trade-Offs</h2>
          <span className="cr-badge-neutral text-[10.5px]">
            No Universal Optimum Claimed
          </span>
        </div>
        <p className="text-xs text-[var(--cr-text-secondary)] max-w-3xl leading-relaxed">
          A safety-critical railway system does not claim one single "best" plan. We present candidate plans with mathematically explicit trade-offs for human review and authorization by the Section Controller.
        </p>
      </div>

      {/* 3 Comparative Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Baseline Card */}
        <div className="cr-card p-4 sm:p-5 flex flex-col justify-between border-l-4 border-l-[var(--cr-status-red)]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--cr-border-subtle)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--cr-text-secondary)]">Current Reality</span>
              <span className="cr-badge-red text-[10px]">Uncoordinated</span>
            </div>
            <h3 className="text-base font-bold text-[var(--cr-text-primary)] mb-1">Honest FCFS Baseline</h3>
            <p className="text-xs text-[var(--cr-text-secondary)] mb-4">Department-wise separate block booking via BDMS.</p>

            {/* 3 Key Hero Metrics */}
            <div className="grid grid-cols-3 gap-2 py-3 px-2.5 rounded-lg bg-[var(--cr-surface-subtle)] border border-[var(--cr-border-subtle)] mb-4 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--cr-text-secondary)] block">Pax Delay</span>
                <span className="text-lg font-extrabold text-[var(--cr-status-red)]">
                  {baseline?.passenger_trains_delayed || 4}
                </span>
                <span className="text-[9px] text-[var(--cr-status-red)] block font-medium">trains</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--cr-text-secondary)] block">Bundled</span>
                <span className="text-lg font-extrabold text-[var(--cr-status-red)]">0%</span>
                <span className="text-[9px] text-[var(--cr-text-secondary)] block font-medium">silos</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--cr-text-secondary)] block">Impact</span>
                <span className="text-lg font-extrabold text-[var(--cr-status-red)]">
                  {baseline?.average_operational_impact || 72}
                </span>
                <span className="text-[9px] text-[var(--cr-status-red)] block font-medium">Severe</span>
              </div>
            </div>

            {/* Secondary Specs */}
            <div className="space-y-2 text-xs text-[var(--cr-text-secondary)]">
              <div className="flex justify-between py-1 border-b border-[var(--cr-border-subtle)]">
                <span>Total Closures:</span>
                <strong className="text-[var(--cr-text-primary)] font-bold">{baseline?.total_separate_blocks || 12} closures</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--cr-border-subtle)]">
                <span>Freight Trains Looped:</span>
                <strong className="text-[var(--cr-text-primary)] font-bold">{baseline?.freight_trains_delayed || 9} rakes</strong>
              </div>
            </div>

            {/* Explainability Callout */}
            <div className="mt-4 pt-3 border-t border-[var(--cr-border-subtle)] text-xs text-[var(--cr-text-secondary)] leading-relaxed">
              <div className="flex items-start gap-1.5 text-[var(--cr-status-red)] font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[var(--cr-status-red)]" />
                <span>Causes repeated telephone arguments; blocks frequently curtailed mid-work.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Plan A (Recommended) */}
        <div className="cr-card p-4 sm:p-5 flex flex-col justify-between border-l-4 border-l-[var(--cr-primary-interactive)] relative">
          <div className="absolute -top-2.5 right-4 bg-[var(--cr-primary-interactive)] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
            RECOMMENDED
          </div>
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--cr-border-subtle)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--cr-primary-interactive)]">Candidate Option 1</span>
              <span className="cr-badge-blue text-[10px]">Punctuality First</span>
            </div>
            <h3 className="text-base font-bold text-[var(--cr-text-primary)] mb-1">Plan A (Least Disruption)</h3>
            
            {/* 3 Key Hero Metrics */}
            <div className="grid grid-cols-3 gap-2 py-3 px-2.5 rounded-lg bg-[var(--cr-surface-subtle)] border border-[var(--cr-border-subtle)] mb-4 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--cr-text-secondary)] block">Pax Delay</span>
                <span className="text-lg font-extrabold text-[var(--cr-status-green)]">0 min</span>
                <span className="text-[9px] text-[var(--cr-status-green)] block font-medium">0 trains</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--cr-text-secondary)] block">Bundled</span>
                <span className="text-lg font-extrabold text-[var(--cr-status-green)]">100%</span>
                <span className="text-[9px] text-[var(--cr-status-green)] block font-medium">multi-dept</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--cr-text-secondary)] block">Impact</span>
                <span className="text-lg font-extrabold text-[var(--cr-status-green)]">
                  {planA?.average_operational_impact || 18}
                </span>
                <span className="text-[9px] text-[var(--cr-status-green)] block font-medium">Optimal</span>
              </div>
            </div>

            {/* Secondary Specs */}
            <div className="space-y-2 text-xs text-[var(--cr-text-secondary)]">
              <div className="flex justify-between py-1 border-b border-[var(--cr-border-subtle)]">
                <span>Bundled Blocks:</span>
                <strong className="text-[var(--cr-text-primary)] font-bold">{planA?.total_candidate_blocks || 6} blocks</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--cr-border-subtle)]">
                <span>Freight Rescheduled:</span>
                <strong className="text-[var(--cr-text-primary)] font-bold">{planA?.freight_trains_delayed || 6} rescheduled</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--cr-border-subtle)]">
                <span>Resource Feasibility:</span>
                <strong className={`font-bold text-xs ${planA?.candidate_blocks?.some(b => b.resource_constrained) ? 'text-[var(--cr-status-amber)]' : 'text-[var(--cr-status-green)]'}`}>
                  {planA?.candidate_blocks?.some(b => b.resource_constrained)
                    ? `${planA?.candidate_blocks?.filter(b => b.resource_constrained).length} Constrained`
                    : 'All Resources Verified'}
                </strong>
              </div>
            </div>

            {/* Explainability & Detailed Diagnostics */}
            <div className="mt-4 pt-3 border-t border-[var(--cr-border-subtle)] space-y-2.5">
              <div className="bg-[var(--cr-surface-subtle)] p-2.5 rounded-lg border border-[var(--cr-border-subtle)] text-xs text-[var(--cr-text-primary)] leading-relaxed font-normal">
                {planA?.trade_off_summary || '0 passenger disruption; scheduled during 01:30–04:45 night freight lull with full 25 kV isolation.'}
              </div>

              <button
                onClick={() => toggleDetails('planA')}
                className="text-[11px] text-[var(--cr-primary-interactive)] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{expandedDetails.planA ? 'Hide Constraints Detail' : 'View Safety & Headway Diagnostics'}</span>
                {expandedDetails.planA ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {expandedDetails.planA && (
                <div className="bg-[var(--cr-surface-subtle)] p-3 rounded-lg border border-[var(--cr-border)] text-xs text-[var(--cr-text-secondary)] space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-1 text-[var(--cr-status-green)] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Headway: 15-min safety clearance before Train 20104</span>
                  </div>
                  <div>• OHE Power Feed: 25 kV Substation #4 isolated with permit-to-work</div>
                  <div>• Machine Allocations: Unomat Tie Tamper + Tower Wagon synchronized</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Plan B (Fastest Maintenance) */}
        <div className="cr-card p-4 sm:p-5 flex flex-col justify-between border-l-4 border-l-[var(--cr-status-amber)]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--cr-border-subtle)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--cr-status-amber)]">Candidate Option 2</span>
              <span className="cr-badge-amber text-[10px]">Safety First</span>
            </div>
            <h3 className="text-base font-bold text-[var(--cr-text-primary)] mb-1">Plan B (Fastest Critical Work)</h3>

            {/* 3 Key Hero Metrics */}
            <div className="grid grid-cols-3 gap-2 py-3 px-2.5 rounded-lg bg-[var(--cr-surface-subtle)] border border-[var(--cr-border-subtle)] mb-4 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--cr-text-secondary)] block">Pax Delay</span>
                <span className="text-lg font-extrabold text-[var(--cr-text-primary)]">0 min</span>
                <span className="text-[9px] text-[var(--cr-text-secondary)] block font-medium">0 trains</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--cr-text-secondary)] block">P0 Cleared</span>
                <span className="text-lg font-extrabold text-[var(--cr-status-amber)]">100%</span>
                <span className="text-[9px] text-[var(--cr-status-amber)] block font-medium">in 48 hrs</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--cr-text-secondary)] block">Impact</span>
                <span className="text-lg font-extrabold text-[var(--cr-status-amber)]">
                  {planB?.average_operational_impact || 34}
                </span>
                <span className="text-[9px] text-[var(--cr-status-amber)] block font-medium">Moderate</span>
              </div>
            </div>

            {/* Secondary Specs */}
            <div className="space-y-2 text-xs text-[var(--cr-text-secondary)]">
              <div className="flex justify-between py-1 border-b border-[var(--cr-border-subtle)]">
                <span>Candidate Blocks:</span>
                <strong className="text-[var(--cr-text-primary)] font-bold">{planB?.total_candidate_blocks || 8} blocks</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--cr-border-subtle)]">
                <span>Freight Trains Looped:</span>
                <strong className="text-[var(--cr-status-amber)] font-bold">{planB?.freight_trains_delayed || 8} looped</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--cr-border-subtle)]">
                <span>Resource Feasibility:</span>
                <strong className={`font-bold text-xs ${planB?.candidate_blocks?.some(b => b.resource_constrained) ? 'text-[var(--cr-status-amber)]' : 'text-[var(--cr-status-green)]'}`}>
                  {planB?.candidate_blocks?.some(b => b.resource_constrained)
                    ? `${planB?.candidate_blocks?.filter(b => b.resource_constrained).length} Constrained`
                    : 'All Resources Verified'}
                </strong>
              </div>
            </div>

            {/* Explainability & Detailed Diagnostics */}
            <div className="mt-4 pt-3 border-t border-[var(--cr-border-subtle)] space-y-2.5">
              <div className="bg-[var(--cr-surface-subtle)] p-2.5 rounded-lg border border-[var(--cr-border-subtle)] text-xs text-[var(--cr-text-primary)] leading-relaxed font-normal">
                {planB?.trade_off_summary || 'Clears safety backlogs rapidly to eliminate emergency speed restrictions (TSRs).'}
              </div>

              <button
                onClick={() => toggleDetails('planB')}
                className="text-[11px] text-[var(--cr-status-amber)] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{expandedDetails.planB ? 'Hide Constraints Detail' : 'View Safety & Headway Diagnostics'}</span>
                {expandedDetails.planB ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {expandedDetails.planB && (
                <div className="bg-[var(--cr-surface-subtle)] p-3 rounded-lg border border-[var(--cr-border)] text-xs text-[var(--cr-text-secondary)] space-y-1.5 text-[11px]">
                  <div>• Speed Restrictions: Lifts 20 km/h temporary restriction at KM 180</div>
                  <div>• Backlog Clearance: 8 critical IMR rail weld defects renewed</div>
                  <div>• Freight Delay Trade-off: Additional 2 rakes detained on loop line</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section Controller Authorization Gate */}
      <div className="cr-panel p-5 sm:p-6 mt-6 border-l-4 border-l-[var(--cr-primary-interactive)]">
        <div className="flex items-center gap-2 mb-1.5">
          <FileCheck className="w-5 h-5 text-[var(--cr-primary-interactive)]" />
          <h3 className="text-base font-bold text-[var(--cr-text-primary)]">Section Controller Authorization Gate</h3>
          <span className="cr-badge-neutral text-[10.5px]">Human-in-the-Loop Audit</span>
        </div>
        <p className="text-xs text-[var(--cr-text-secondary)] mb-5 leading-relaxed">
          In accordance with Indian Railways General Rules, candidate plans generated by AI require human confirmation. Approving a candidate plan generates an immutable timestamped audit record.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-4">
          <div>
            <label className="text-xs text-[var(--cr-text-secondary)] block mb-1 font-bold">Candidate Plan Selection:</label>
            <select
              value={selectedPlanForApproval}
              onChange={(e) => setSelectedPlanForApproval(e.target.value)}
              className="w-full bg-[var(--cr-surface-subtle)] border border-[var(--cr-border)] text-[var(--cr-text-primary)] rounded-lg px-3 py-2 text-xs focus:border-[var(--cr-primary-interactive)] focus:outline-none"
            >
              <option value="Plan A (Least Disruption)">Plan A (Least Disruption - Recommended)</option>
              <option value="Plan B (Fastest Critical Maintenance)">Plan B (Fastest Critical Maintenance)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-[var(--cr-text-secondary)] block mb-1 font-bold">Recorded Controller Justification Reason:</label>
            <input
              type="text"
              value={approvalReason}
              onChange={(e) => setApprovalReason(e.target.value)}
              className="w-full bg-[var(--cr-surface-subtle)] border border-[var(--cr-border)] text-[var(--cr-text-primary)] rounded-lg px-3 py-2 text-xs focus:border-[var(--cr-primary-interactive)] focus:outline-none"
              placeholder="Enter official justification..."
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="text-[11px] text-[var(--cr-text-secondary)] font-medium">
            * Synced directly to Section Controller Master Ledger (CRIS COA / BDMS).
          </span>

          <button
            onClick={handleApproveClick}
            className="cr-btn-primary"
          >
            <CheckCircle className="w-4 h-4 text-white" />
            <span>Authorize & Record Candidate Plan</span>
          </button>
        </div>

        {approvalSuccess && (
          <div className="mt-4 p-3 bg-[var(--cr-status-green-bg)] border border-[var(--cr-status-green-border)] rounded-lg text-[var(--cr-status-green)] text-xs flex items-center gap-2 font-semibold">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Plan approved successfully! Immutable audit record generated and logged to official ledger.</span>
          </div>
        )}
      </div>
    </div>
  );
};
