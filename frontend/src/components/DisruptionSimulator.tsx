import React, { useState } from 'react';
import { AlertCircle, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

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
      {/* Simulation Trigger Panel */}
      <div className="cr-panel p-5 sm:p-6 border-l-4 border-l-[var(--cr-status-red)]">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <AlertCircle className="w-5 h-5 text-[var(--cr-status-red)]" />
          <h2 className="text-base sm:text-lg font-extrabold text-[var(--cr-text-primary)]">Live Disruption & Emergency Re-Dispatching Sandbox</h2>
          <span className="cr-badge-red text-xs">
            Dynamic CP-SAT Re-dispatch
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--cr-text-secondary)] max-w-3xl leading-relaxed">
          Demonstrates how the Google OR-Tools CP-SAT engine dynamically repairs schedules in sub-second latency when unexpected incidents occur, rerouting flexible freight rakes while safeguarding high-priority express passenger paths.
        </p>

        <div className="mt-5">
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="cr-btn-primary bg-[var(--cr-status-red)] text-white hover:opacity-90 disabled:opacity-50"
          >
            <span>{loading ? 'Solving CP-SAT Constraints...' : 'Simulate Emergency: Rail Fracture at Km 144.2'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Resolution Telemetry Panel */}
      {result && (
        <div className="cr-panel p-5 sm:p-6 border-l-4 border-l-[var(--cr-status-green)] animate-fade-in">
          {/* Status Header */}
          <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-[var(--cr-border-subtle)] gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-5 h-5 text-[var(--cr-status-green)]" />
                <h3 className="text-base font-bold text-[var(--cr-text-primary)]">Dynamic Schedule Re-Optimized Successfully</h3>
                <span className="cr-badge-green text-xs">
                  {result.replan_status}
                </span>
              </div>
              <p className="text-xs text-[var(--cr-text-secondary)]">
                Incident: <span className="text-[var(--cr-status-red)] font-bold">{result.incident_type}</span> at <span className="text-[var(--cr-primary-interactive)] font-semibold">{result.location}</span>
              </p>
            </div>

            <div className="bg-[var(--cr-surface-subtle)] border border-[var(--cr-border)] px-3.5 py-2 rounded-lg text-right">
              <span className="text-xs text-[var(--cr-text-secondary)] block uppercase font-bold">CP-SAT Solve Latency</span>
              <span className="text-lg font-extrabold text-[var(--cr-primary-interactive)]">{result.solver_latency_seconds}s</span>
            </div>
          </div>

          {/* 2 Telemetry Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Express Protection */}
            <div className="cr-card p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--cr-primary-interactive)] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[var(--cr-status-green)]" />
                <span>Passenger Express Traffic Protection</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--cr-surface-subtle)] border border-[var(--cr-border-subtle)]">
                  <span className="text-[var(--cr-text-primary)] font-medium">Train 20104 (Vande Bharat):</span>
                  <span className="cr-badge-green text-xs">
                    {result.operational_impact?.vande_bharat_20104}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--cr-surface-subtle)] border border-[var(--cr-border-subtle)]">
                  <span className="text-[var(--cr-text-primary)] font-medium">Train 12302 (Howrah Rajdhani):</span>
                  <span className="cr-badge-green text-xs">
                    {result.operational_impact?.howrah_rajdhani_12302}
                  </span>
                </div>
              </div>
            </div>

            {/* Freight & Possession Rerouting */}
            <div className="cr-card p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--cr-status-amber)] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[var(--cr-status-amber)]" />
                <span>Emergency Possession & Freight Rerouting</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--cr-surface-subtle)] border border-[var(--cr-border-subtle)]">
                  <span className="text-[var(--cr-text-primary)] font-medium">Emergency Slot:</span>
                  <span className="cr-badge-blue text-xs">
                    {result.operational_impact?.emergency_block_allocated}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--cr-surface-subtle)] border border-[var(--cr-border-subtle)]">
                  <span className="text-[var(--cr-text-primary)] font-medium">Goods Train 70021:</span>
                  <span className="text-[var(--cr-status-amber)] font-bold text-xs">
                    {result.operational_impact?.goods_train_70021}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--cr-surface-subtle)] border border-[var(--cr-border-subtle)]">
                  <span className="text-[var(--cr-text-primary)] font-medium">Assigned Gang:</span>
                  <span className="text-[var(--cr-text-secondary)] font-medium text-xs">
                    {result.operational_impact?.repair_gang_deployed}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Trace */}
          <div className="mt-4 pt-3 border-t border-[var(--cr-border-subtle)] text-xs text-[var(--cr-text-secondary)] bg-[var(--cr-surface-subtle)] p-3 rounded-lg border border-[var(--cr-border)] leading-relaxed">
            <strong className="text-[var(--cr-status-green)] font-bold">Audit Trace:</strong> {result.audit_trail}
          </div>
        </div>
      )}
    </div>
  );
};
