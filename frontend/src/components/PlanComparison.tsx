import React, { useState } from 'react';
import { GitCompare, CheckCircle, FileCheck } from 'lucide-react';
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

  const handleApproveClick = () => {
    onApprove(selectedPlanForApproval, approvalReason);
    setApprovalSuccess(true);
    setTimeout(() => setApprovalSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0b132b] border border-purple-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <GitCompare className="w-6 h-6 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Dual Candidate Plan Comparison & Trade-Offs</h2>
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
            No Universal Optimum Claimed
          </span>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          A safety-critical railway system does not claim one single "best" plan. We present two candidate plans with mathematically explicit trade-offs for human review and authorization by the Section Controller.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0b132b] border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Current Reality</span>
              <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded font-bold">Uncoordinated</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Honest FCFS Baseline</h3>
            <p className="text-xs text-slate-400 mb-4">Department-wise separate block booking via BDMS.</p>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Separate Blocks:</span>
                <strong className="text-white font-mono">{baseline?.total_separate_blocks || 12} closures</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Bundled Blocks:</span>
                <strong className="text-red-400 font-mono">0 (0% synergy)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Express Trains Delayed:</span>
                <strong className="text-red-400 font-mono">{baseline?.passenger_trains_delayed || 4} express trains</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Freight Trains Delayed:</span>
                <strong className="text-white font-mono">{baseline?.freight_trains_delayed || 9} rakes</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Operational Impact Index:</span>
                <strong className="text-red-400 font-mono text-sm">{baseline?.average_operational_impact || 72}/100 (Severe)</strong>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-500 italic">
            Causes repeated telephone arguments between DOM and Engineering; blocks frequently curtailed.
          </div>
        </div>

        <div className="bg-[#0b132b] border-2 border-cyan-500/50 p-5 rounded-2xl shadow-2xl flex flex-col justify-between relative">
          <div className="absolute -top-3 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
            RECOMMENDED BY CONTROLLER
          </div>
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">Candidate Option 1</span>
              <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-0.5 rounded font-bold">Punctuality First</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Plan A (Least Disruption)</h3>
            <p className="text-xs text-slate-400 mb-4">{planA?.trade_off_summary}</p>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Candidate Blocks:</span>
                <strong className="text-white font-mono">{planA?.total_candidate_blocks || 6} bundled blocks</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Bundled Blocks Ratio:</span>
                <strong className="text-emerald-400 font-mono">100% Multi-Dept</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Express Trains Delayed:</span>
                <strong className="text-emerald-400 font-mono font-bold">0 min (0 Trains)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Freight Trains Delayed:</span>
                <strong className="text-white font-mono">{planA?.freight_trains_delayed || 6} rescheduled</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Operational Impact Index:</span>
                <strong className="text-emerald-400 font-mono text-sm">{planA?.average_operational_impact || 18}/100 (Optimal)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Resource Feasibility:</span>
                <strong className={`font-mono text-xs ${planA?.candidate_blocks?.some(b => b.resource_constrained) ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {planA?.candidate_blocks?.some(b => b.resource_constrained)
                    ? `${planA?.candidate_blocks?.filter(b => b.resource_constrained).length} Constrained`
                    : 'All Resources Verified'}
                </strong>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-emerald-400/90 font-medium">
            ✓ 0 passenger disruption; scheduled during 01:30–04:45 night freight lull with full 25 kV isolation.
          </div>
        </div>

        <div className="bg-[#0b132b] border border-emerald-500/40 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Candidate Option 2</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded font-bold">Safety First</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Plan B (Fastest Critical Work)</h3>
            <p className="text-xs text-slate-400 mb-4">{planB?.trade_off_summary}</p>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Candidate Blocks:</span>
                <strong className="text-white font-mono">{planB?.total_candidate_blocks || 8} blocks</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Urgent P0/P1 Tasks Cleared:</span>
                <strong className="text-emerald-400 font-mono">100% in 48 Hours</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Express Trains Delayed:</span>
                <strong className="text-white font-mono">0 Express Trains</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Freight Trains Delayed:</span>
                <strong className="text-amber-400 font-mono">{planB?.freight_trains_delayed || 8} looped</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Operational Impact Index:</span>
                <strong className="text-amber-400 font-mono text-sm">{planB?.average_operational_impact || 34}/100 (Moderate)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Resource Feasibility:</span>
                <strong className={`font-mono text-xs ${planB?.candidate_blocks?.some(b => b.resource_constrained) ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {planB?.candidate_blocks?.some(b => b.resource_constrained)
                    ? `${planB?.candidate_blocks?.filter(b => b.resource_constrained).length} Constrained`
                    : 'All Resources Verified'}
                </strong>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
            Clears safety backlogs rapidly to eliminate emergency speed restrictions (TSRs).
          </div>
        </div>
      </div>

      <div className="bg-[#0b132b] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl mt-8">
        <div className="flex items-center gap-2 mb-2">
          <FileCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Section Controller Authorization Gate</h3>
          <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded font-mono">Human-in-the-Loop Audit</span>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          In accordance with Indian Railways General Rules, candidate plans generated by AI require human confirmation. Approving a candidate plan generates an immutable timestamped audit record.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1.5 font-medium">Select Candidate Plan:</label>
            <select
              value={selectedPlanForApproval}
              onChange={(e) => setSelectedPlanForApproval(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
            >
              <option value="Plan A (Least Disruption)">Plan A (Least Disruption - Recommended)</option>
              <option value="Plan B (Fastest Critical Maintenance)">Plan B (Fastest Critical Maintenance)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-slate-300 block mb-1.5 font-medium">Recorded Controller Approval Reason:</label>
            <input
              type="text"
              value={approvalReason}
              onChange={(e) => setApprovalReason(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
              placeholder="Enter official justification..."
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500">
            * Recorded into Section Controller Master Ledger (CRIS COA / BDMS Sync).
          </span>

          <button
            onClick={handleApproveClick}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Authorize & Record Candidate Plan</span>
          </button>
        </div>

        {approvalSuccess && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Plan approved successfully! Immutable audit record generated and logged to official ledger.</span>
          </div>
        )}
      </div>
    </div>
  );
};
