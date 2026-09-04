import React from 'react';
import { Layers, ShieldCheck, Clock } from 'lucide-react';
import type { LookAheadOpportunity } from '../types';

interface OpportunityPanelProps {
  opportunities: LookAheadOpportunity[];
}

export const OpportunityPanel: React.FC<OpportunityPanelProps> = ({ opportunities }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#0b132b] border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-6 h-6 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Look-Ahead Coordinated Bundling Engine</h2>
          <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
            14-Day Horizon Proactive Scan
          </span>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          The system does not wait for departments to submit isolated requests. It scans planned, due, and overdue maintenance up to 14 days in advance and proactively pairs compatible Engineering, Traction, and S&T tasks into single shadow windows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((opp) => (
          <div
            key={opp.opportunity_id}
            className="bg-[#0b132b] border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl shadow-xl transition-all"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded font-mono text-xs font-bold">
                  {opp.opportunity_id}
                </span>
                <span className="text-xs font-semibold text-slate-300 font-mono">{opp.corridor_id}</span>
              </div>
              <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-0.5 rounded-full font-semibold">
                Avoids {opp.blocks_avoided} Separate Blocks
              </span>
            </div>

            <h3 className="text-sm font-bold text-white mb-2">{opp.section_name}</h3>
            <p className="text-xs text-slate-400 mb-4">{opp.summary}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {opp.departments.map((dept, i) => (
                <span
                  key={i}
                  className="bg-slate-900 border border-slate-700 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{dept}</span>
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Shared Window: <strong className="text-white">{opp.estimated_shared_window_hours} hrs</strong></span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>25 kV Power Invariant Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
