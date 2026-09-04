import React, { useState } from 'react';
import { AlertCircle, Zap, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

interface DisruptionSimulatorProps {
  onInject: () => Promise<any>;
}

export const DisruptionSimulator: React.FC<DisruptionSimulatorProps> = ({ onInject }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await onInject();
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0b132b] border border-red-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <h2 className="text-lg font-bold text-white">Live Disruption & Emergency Re-Dispatching Sandbox</h2>
          <span className="bg-red-500/20 text-red-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
            Live Hackathon Showstopper
          </span>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          Demonstrates how the Google OR-Tools CP-SAT engine dynamically repairs schedules in sub-second latency when unexpected incidents occur, rerouting flexible freight rakes while safeguarding high-priority express passenger paths.
        </p>

        <div className="mt-6">
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="flex items-center gap-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-xl shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Zap className={`w-5 h-5 text-amber-300 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Solving CP-SAT Constraints...' : '🚨 Trigger Live Emergency: Rail Fracture at Km 144.2'}</span>
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-[#0b132b] border-2 border-emerald-500/50 rounded-2xl p-6 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Dynamic Schedule Re-Optimized Successfully</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded font-mono font-bold">
                  {result.replan_status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Incident: <span className="text-red-300 font-semibold">{result.incident_type}</span> at <span className="text-cyan-300 font-mono">{result.location}</span>
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">CP-SAT Solve Latency</span>
              <span className="text-lg font-bold font-mono text-cyan-400">{result.solver_latency_seconds}s</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Passenger Express Traffic Protection</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-200 font-medium">Train 20104 (Vande Bharat Express):</span>
                  <span className="text-emerald-400 font-bold font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                    {result.operational_impact?.vande_bharat_20104}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-200 font-medium">Train 12302 (Howrah Rajdhani Exp):</span>
                  <span className="text-emerald-400 font-bold font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                    {result.operational_impact?.howrah_rajdhani_12302}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Emergency Possession & Freight Rerouting</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-200 font-medium">Emergency Possession Slot:</span>
                  <span className="text-cyan-400 font-bold font-mono">
                    {result.operational_impact?.emergency_block_allocated}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-200 font-medium">Goods Train 70021 Movement:</span>
                  <span className="text-amber-400 font-medium">
                    {result.operational_impact?.goods_train_70021}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-200 font-medium">Assigned Work Gang:</span>
                  <span className="text-slate-300">
                    {result.operational_impact?.repair_gang_deployed}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 italic">
            <strong>Audit Trace:</strong> {result.audit_trail}
          </div>
        </div>
      )}
    </div>
  );
};
