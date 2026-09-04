import React from 'react';
import { AlertTriangle, ShieldAlert, Database, RefreshCw } from 'lucide-react';
import type { DataQualityReport } from '../types';

interface DataQualityCenterProps {
  report: DataQualityReport | null;
  onRefresh: () => void;
}

export const DataQualityCenter: React.FC<DataQualityCenterProps> = ({ report, onRefresh }) => {
  if (!report) {
    return (
      <div className="bg-[#0b132b] rounded-2xl border border-slate-800 p-8 text-center text-slate-400">
        Loading Data-Quality Validation Report...
      </div>
    );
  }

  const { summary } = report;

  return (
    <div className="space-y-6">
      <div className="bg-[#0b132b] border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Data-Quality & Canonical Ingestion Gateway</h2>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Section 6 & 21 Red-Team Safeguard Active
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              Real railway feeds contain missing fields, duplicates, and stale inputs. RAILSYNC-ABP never silently drops or modifies dirty records. It flags them with actionable diagnostic reasons for Section Controllers.
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Re-Scan Feeds</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block mb-1">Total Records Screened</span>
            <span className="text-2xl font-bold font-mono text-white">{summary.total_records_screened}</span>
          </div>
          <div className="bg-slate-900/80 border border-emerald-500/30 p-4 rounded-xl">
            <span className="text-xs text-emerald-400 block mb-1">Canonical & Valid</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">{summary.valid_records}</span>
          </div>
          <div className="bg-slate-900/80 border border-amber-500/30 p-4 rounded-xl">
            <span className="text-xs text-amber-400 block mb-1">Flagged Anomalies</span>
            <span className="text-2xl font-bold font-mono text-amber-400">{summary.anomalies_detected}</span>
          </div>
          <div className="bg-slate-900/80 border border-cyan-500/30 p-4 rounded-xl">
            <span className="text-xs text-cyan-400 block mb-1">Gateway SLA Status</span>
            <span className="text-xl font-bold font-mono text-cyan-300">PROTECTED</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0b132b] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Source System Feed Health</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(summary.source_system_health).map(([sys, counts]) => (
            <div key={sys} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-200 block">{sys}</span>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-slate-400">Total: {counts.total}</span>
                {counts.issues > 0 ? (
                  <span className="text-amber-400 font-semibold font-mono">⚠️ {counts.issues} flags</span>
                ) : (
                  <span className="text-emerald-400 font-semibold font-mono">✓ Clean</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0b132b] border border-slate-800 rounded-2xl p-5 shadow-xl overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Active Flagged Anomalies (Actionable Diagnoses)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Record ID</th>
                <th className="py-2.5 px-3">Source System</th>
                <th className="py-2.5 px-3">Entity Type</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Diagnostic Reason</th>
                <th className="py-2.5 px-3">Recommended Operational Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {summary.issues.map((issue, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-cyan-300 font-semibold">{issue.record_id}</td>
                  <td className="py-3 px-3">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
                      {issue.source_system}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{issue.entity_type}</td>
                  <td className="py-3 px-3">
                    <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {issue.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-amber-200">
                    <ul className="list-disc list-inside space-y-0.5">
                      {issue.reasons.map((r, rIdx) => (
                        <li key={rIdx}>{r}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 px-3 text-slate-400 italic">{issue.recommended_action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
