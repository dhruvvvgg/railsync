import React from 'react';
import { Train, ShieldCheck, Activity, Cpu, AlertTriangle, Layers, GitCompare, FileCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  anomaliesCount: number;
  opportunitiesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  anomaliesCount,
  opportunitiesCount
}) => {
  return (
    <header className="bg-[#0b132b] border-b border-slate-800 text-white sticky top-0 z-50 shadow-lg">
      {/* Top Banner */}
      <div className="px-6 py-3 flex flex-wrap items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-md flex items-center justify-center">
            <Train className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-mono">RAILSYNC-ABP</h1>
              <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-0.5 rounded-full border border-cyan-500/30 font-semibold">
                v1.0 • Candidate Planner
              </span>
              <span className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded-full border border-red-500/30 font-semibold">
                Ministry of Railways (SIH26027)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Explainable AI-Assisted Automatic Block Planning for Coordinated Railway Maintenance • North Central Railway
            </p>
          </div>
        </div>

        {/* Operational Status Chips */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 px-3 py-1.5 rounded-lg shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">100% G&SR Safety Rules</span>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-950/60 border border-blue-500/40 text-blue-400 px-3 py-1.5 rounded-lg shadow-sm">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="font-medium">Google OR-Tools CP-SAT</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg shadow-sm">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Human Authorization Gate Active</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 flex items-center gap-2 overflow-x-auto bg-[#080d1e] py-1 text-sm font-medium">
        <button
          onClick={() => setActiveTab('cockpit')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            activeTab === 'cockpit'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Train className="w-4 h-4" />
          <span>Planning Cockpit (Marey & Gantt)</span>
        </button>

        <button
          onClick={() => setActiveTab('gateway')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            activeTab === 'gateway'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Data-Quality Center</span>
          <span className="bg-amber-500/30 text-amber-300 text-xs px-1.5 py-0.2 rounded-full font-bold">
            {anomaliesCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            activeTab === 'opportunities'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Look-Ahead Bundling</span>
          <span className="bg-emerald-500/30 text-emerald-300 text-xs px-1.5 py-0.2 rounded-full font-bold">
            {opportunitiesCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            activeTab === 'comparison'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <GitCompare className="w-4 h-4 text-purple-400" />
          <span>Plan A vs Plan B vs Baseline</span>
        </button>

        <button
          onClick={() => setActiveTab('emergency')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            activeTab === 'emergency'
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-4 h-4 text-red-400" />
          <span>Emergency Disruption Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            activeTab === 'audit'
              ? 'bg-slate-700/60 text-white border border-slate-600 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileCheck className="w-4 h-4 text-slate-300" />
          <span>Audit Log & Approval Records</span>
        </button>
      </div>
    </header>
  );
};
