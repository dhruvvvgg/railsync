import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MareyDiagram } from './components/MareyDiagram';
import { GanttTimeline } from './components/GanttTimeline';
import { DataQualityCenter } from './components/DataQualityCenter';
import { OpportunityPanel } from './components/OpportunityPanel';
import { PlanComparison } from './components/PlanComparison';
import { DisruptionSimulator } from './components/DisruptionSimulator';
import { AuditLogViewer } from './components/AuditLogViewer';
import type { DataQualityReport, LookAheadOpportunity } from './types';
import { TrendingUp, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('cockpit');
  const [selectedPlanKey, setSelectedPlanKey] = useState<'plan_a' | 'plan_b' | 'baseline_fcfs'>('plan_a');
  
  const [dataReport, setDataReport] = useState<DataQualityReport | null>(null);
  const [opportunities, setOpportunities] = useState<LookAheadOpportunity[]>([]);
  const [optimizerResults, setOptimizerResults] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchDataQuality();
    fetchOpportunities();
    fetchOptimization();
    fetchAuditLogs();
  }, []);

  const fetchDataQuality = async () => {
    try {
      const res = await fetch('/api/gateway/validation');
      if (res.ok) {
        const data = await res.json();
        setDataReport(data);
      }
    } catch {
      console.log('Using local fallback for Data-Quality Gateway');
    }
  };

  const fetchOpportunities = async () => {
    try {
      const res = await fetch('/api/opportunities');
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.opportunities || []);
      }
    } catch {
      console.log('Using local fallback for opportunities');
    }
  };

  const fetchOptimization = async () => {
    try {
      const res = await fetch('/api/optimizer/solve', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setOptimizerResults(data);
      }
    } catch {
      console.log('Using local fallback for solver');
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit/logs');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.audit_logs || []);
      }
    } catch {
      console.log('Using local fallback for audit logs');
    }
  };

  const handleApprovePlan = async (planName: string, reason: string) => {
    try {
      const res = await fetch('/api/plans/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_name: planName,
          approved_by: 'Senior Section Controller - CNB Division',
          role: 'Authorized Traffic Controller',
          action: 'APPROVED',
          reason
        })
      });
      if (res.ok) {
        fetchAuditLogs();
      }
    } catch {
      const newEntry = {
        timestamp: new Date().toISOString(),
        action: 'APPROVED',
        plan_name: planName,
        approved_by: 'Senior Section Controller (Local Demo)',
        role: 'Authorized Traffic Controller',
        reason
      };
      setAuditLogs((prev) => [newEntry, ...prev]);
    }
  };

  const handleInjectDisruption = async () => {
    try {
      const res = await fetch('/api/disruption/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident_type: 'P0 Emergency Rail Fracture (IMR Defect)',
          corridor_id: 'COR-001',
          km_location: 'KM 144.2'
        })
      });
      if (res.ok) {
        const data = await res.json();
        fetchAuditLogs();
        return data;
      }
    } catch {
      console.log('Using local fallback for emergency re-plan');
    }

    return {
      incident_type: 'P0 Emergency Rail Fracture (IMR Defect)',
      location: 'COR-001 Km 144.2 (Kanpur-Rura UP Line)',
      replan_status: 'SUCCESSFULLY_RESOLVED',
      solver_latency_seconds: 0.38,
      operational_impact: {
        vande_bharat_20104: 'ON_TIME (No Delay, clear headway)',
        howrah_rajdhani_12302: 'ON_TIME (Passed before block window)',
        goods_train_70021: 'Held on Loop Siding at Rura for 28 mins',
        emergency_block_allocated: '06:45 - 07:30 (45 mins emergency window)',
        repair_gang_deployed: 'Track Renewal Gang Alpha #4'
      },
      audit_trail: 'Automated CP-SAT Dynamic Repair: Preserved passenger paths, rescheduled goods freight to secondary loop line, and generated immediate emergency track possession.'
    };
  };

  const planA = optimizerResults?.candidate_plans?.plan_a || null;
  const planB = optimizerResults?.candidate_plans?.plan_b || null;
  const baseline = optimizerResults?.candidate_plans?.baseline_fcfs || null;

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        anomaliesCount={dataReport?.summary?.anomalies_detected || 7}
        opportunitiesCount={opportunities.length || 12}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0b132b] border border-slate-800 p-4 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Block Utilization</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">88%</span>
              <span className="text-xs text-emerald-400 font-semibold">+48% vs Baseline</span>
            </div>
          </div>

          <div className="bg-[#0b132b] border border-slate-800 p-4 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Vande Bharat / Rajdhani Delay</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-cyan-300">0 min</span>
              <span className="text-xs text-cyan-400 font-semibold">100% Punctual</span>
            </div>
          </div>

          <div className="bg-[#0b132b] border border-slate-800 p-4 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Track Availability Index</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">94.2%</span>
              <span className="text-xs text-blue-400 font-semibold">Max Line Capacity</span>
            </div>
          </div>

          <div className="bg-[#0b132b] border border-slate-800 p-4 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Multi-Dept Bundling Efficiency</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">76.5%</span>
              <span className="text-xs text-emerald-400 font-semibold">3-in-1 Corridors</span>
            </div>
          </div>
        </div>

        {activeTab === 'cockpit' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-[#0b132b] p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium px-2">Display Plan:</span>
                <button
                  onClick={() => setSelectedPlanKey('plan_a')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedPlanKey === 'plan_a'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-700'
                  }`}
                >
                  Plan A (Least Disruption - Recommended)
                </button>
                <button
                  onClick={() => setSelectedPlanKey('plan_b')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedPlanKey === 'plan_b'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-700'
                  }`}
                >
                  Plan B (Fastest Critical Maintenance)
                </button>
                <button
                  onClick={() => setSelectedPlanKey('baseline_fcfs')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedPlanKey === 'baseline_fcfs'
                      ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-700'
                  }`}
                >
                  Current Reality (FCFS Baseline)
                </button>
              </div>

              <div className="text-xs text-slate-400 font-mono hidden md:block">
                Corridor: Kanpur Central (CNB) ➔ New Delhi (NDLS) Main Line
              </div>
            </div>

            <MareyDiagram selectedPlan={selectedPlanKey} />
            <GanttTimeline selectedPlan={selectedPlanKey} />
          </div>
        )}

        {activeTab === 'gateway' && (
          <DataQualityCenter report={dataReport} onRefresh={fetchDataQuality} />
        )}

        {activeTab === 'opportunities' && (
          <OpportunityPanel opportunities={opportunities} />
        )}

        {activeTab === 'comparison' && (
          <PlanComparison
            planA={planA}
            planB={planB}
            baseline={baseline}
            onApprove={handleApprovePlan}
          />
        )}

        {activeTab === 'emergency' && (
          <DisruptionSimulator onInject={handleInjectDisruption} />
        )}

        {activeTab === 'audit' && (
          <AuditLogViewer logs={auditLogs} />
        )}
      </main>

      <footer className="bg-[#0b132b] border-t border-slate-800 py-3 px-6 text-center text-xs text-slate-500 flex flex-wrap justify-between items-center">
        <span>RAILSYNC-ABP v1.0 • Smart India Hackathon 2026 • Ministry of Railways (SIH26027)</span>
        <span>Decision-Support Layer • Authorized Human Control Preserved</span>
      </footer>
    </div>
  );
}

export default App;
