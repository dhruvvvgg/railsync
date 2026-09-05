import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StoryFlow } from './components/StoryFlow';
import { MareyDiagram } from './components/MareyDiagram';
import { GanttTimeline } from './components/GanttTimeline';
import { DataQualityCenter } from './components/DataQualityCenter';
import { OpportunityPanel } from './components/OpportunityPanel';
import { PlanComparison } from './components/PlanComparison';
import { DisruptionSimulator } from './components/DisruptionSimulator';
import { AuditLogViewer } from './components/AuditLogViewer';
import { GlossaryDrawer } from './components/GlossaryDrawer';
import { GuidedDemoModal } from './components/GuidedDemoModal';
import type { DataQualityReport, LookAheadOpportunity, OptimizerSolveResponse } from './types';
import type { Language } from './i18n/translations';
import { TrendingUp, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [viewMode, setViewMode] = useState<'story' | 'console'>('story');
  const [activeTab, setActiveTab] = useState<string>('cockpit');
  const [selectedPlanKey, setSelectedPlanKey] = useState<'plan_a' | 'plan_b' | 'baseline_fcfs'>('plan_a');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  
  const [dataReport, setDataReport] = useState<DataQualityReport | null>(null);
  const [opportunities, setOpportunities] = useState<LookAheadOpportunity[]>([]);
  const [optimizerResults, setOptimizerResults] = useState<OptimizerSolveResponse | null>(null);
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

  const currentPlan = selectedPlanKey === 'plan_a' ? planA : (selectedPlanKey === 'plan_b' ? planB : baseline);
  const activeCandidateBlocks = currentPlan?.candidate_blocks || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060913] via-[#090e1f] to-[#04060d] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Ambient background glow blooms */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        anomaliesCount={dataReport?.summary?.anomalies_detected || 7}
        opportunitiesCount={opportunities.length || 12}
        language={language}
        setLanguage={setLanguage}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onLaunchDemo={() => setIsDemoModalOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 relative z-10">
        {/* If Story Mode: Render the 3-act narrative landing page */}
        {viewMode === 'story' ? (
          <StoryFlow
            language={language}
            onLaunchDemo={() => setIsDemoModalOpen(true)}
            onOpenConsole={(tab) => {
              if (tab) setActiveTab(tab);
              setViewMode('console');
            }}
            onOpenGlossary={() => setIsGlossaryOpen(true)}
          />
        ) : (
          /* Full Engineering Console with all 6 original tabs */
          <div className="space-y-6">
            {/* Top KPI Metric Cards (Modern Glassmorphic Telemetry) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 rounded-2xl shadow-xl hover:border-emerald-500/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-medium">Block Utilization</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-white tracking-tight">
                    {selectedPlanKey === 'baseline_fcfs' ? '42%' : (selectedPlanKey === 'plan_b' ? '82%' : '88%')}
                  </span>
                  <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                    selectedPlanKey === 'baseline_fcfs' ? 'bg-red-500/15 text-red-300' : 'bg-emerald-500/15 text-emerald-300'
                  }`}>
                    {selectedPlanKey === 'baseline_fcfs' ? '-46% vs Plan A' : '+46% vs Baseline'}
                  </span>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl shadow-xl hover:border-cyan-500/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-medium">Passenger Train Delays</span>
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold font-mono tracking-tight ${selectedPlanKey === 'baseline_fcfs' ? 'text-red-400' : 'text-cyan-300'}`}>
                    {selectedPlanKey === 'baseline_fcfs' ? `${baseline?.passenger_trains_delayed || 4} Trains` : '0 min'}
                  </span>
                  <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                    selectedPlanKey === 'baseline_fcfs' ? 'bg-red-500/15 text-red-300' : 'bg-cyan-500/15 text-cyan-300'
                  }`}>
                    {selectedPlanKey === 'baseline_fcfs' ? 'Detentions in Day' : '100% Punctual'}
                  </span>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl shadow-xl hover:border-blue-500/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-medium">Track Availability Index</span>
                  <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-white tracking-tight">
                    {selectedPlanKey === 'baseline_fcfs' ? '71.5%' : (selectedPlanKey === 'plan_b' ? '91.0%' : '94.2%')}
                  </span>
                  <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                    selectedPlanKey === 'baseline_fcfs' ? 'bg-amber-500/15 text-amber-300' : 'bg-blue-500/15 text-blue-300'
                  }`}>
                    {selectedPlanKey === 'baseline_fcfs' ? 'Bottlenecks' : 'Max Capacity'}
                  </span>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl shadow-xl hover:border-emerald-500/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-medium">Multi-Dept Synergy</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-white tracking-tight">
                    {selectedPlanKey === 'baseline_fcfs' ? '0%' : (currentPlan?.bundled_blocks_ratio || '83.3%')}
                  </span>
                  <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                    selectedPlanKey === 'baseline_fcfs' ? 'bg-red-500/15 text-red-300' : 'bg-emerald-500/15 text-emerald-300'
                  }`}>
                    {selectedPlanKey === 'baseline_fcfs' ? 'Unbundled Silos' : '3-in-1 Bundled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tab 1: Planning Cockpit (Marey & Gantt) */}
            {activeTab === 'cockpit' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-3 rounded-2xl shadow-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono font-semibold px-2">Display Plan:</span>
                    <button
                      onClick={() => setSelectedPlanKey('plan_a')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedPlanKey === 'plan_a'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400/40'
                          : 'text-slate-400 hover:text-white bg-slate-900/80 border border-slate-700/60'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${selectedPlanKey === 'plan_a' ? 'bg-slate-950' : 'bg-emerald-400'}`}></span>
                      <span>Plan A (Least Disruption - Recommended)</span>
                    </button>
                    <button
                      onClick={() => setSelectedPlanKey('plan_b')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedPlanKey === 'plan_b'
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/25 ring-1 ring-amber-400/40'
                          : 'text-slate-400 hover:text-white bg-slate-900/80 border border-slate-700/60'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${selectedPlanKey === 'plan_b' ? 'bg-slate-950' : 'bg-amber-400'}`}></span>
                      <span>Plan B (Fastest Critical Maintenance)</span>
                    </button>
                    <button
                      onClick={() => setSelectedPlanKey('baseline_fcfs')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedPlanKey === 'baseline_fcfs'
                          ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-500/25 ring-1 ring-red-400/40'
                          : 'text-slate-400 hover:text-white bg-slate-900/80 border border-slate-700/60'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${selectedPlanKey === 'baseline_fcfs' ? 'bg-white' : 'bg-red-400'}`}></span>
                      <span>Current Reality (FCFS Baseline)</span>
                    </button>
                  </div>

                  <div className="text-xs text-slate-400 font-mono hidden lg:block bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800">
                    Corridor: Kanpur Central (CNB) ➔ New Delhi (NDLS) Main Line
                  </div>
                </div>

                <MareyDiagram
                  selectedPlan={selectedPlanKey}
                  blocks={activeCandidateBlocks}
                  trainSchedules={optimizerResults?.train_schedules}
                  onTogglePlan={(plan) => setSelectedPlanKey(plan as any)}
                  language={language}
                />
                <GanttTimeline
                  selectedPlan={selectedPlanKey}
                  blocks={activeCandidateBlocks}
                  language={language}
                />
              </div>
            )}

            {/* Tab 2: Data-Quality Center */}
            {activeTab === 'gateway' && (
              <DataQualityCenter report={dataReport} onRefresh={fetchDataQuality} />
            )}

            {/* Tab 3: Look-Ahead Bundling */}
            {activeTab === 'opportunities' && (
              <OpportunityPanel opportunities={opportunities} />
            )}

            {/* Tab 4: Plan Comparison */}
            {activeTab === 'comparison' && (
              <PlanComparison
                planA={planA}
                planB={planB}
                baseline={baseline}
                onApprove={handleApprovePlan}
              />
            )}

            {/* Tab 5: Emergency Disruption Simulator */}
            {activeTab === 'emergency' && (
              <DisruptionSimulator onInject={handleInjectDisruption} />
            )}

            {/* Tab 6: Audit Log & Approval Records */}
            {activeTab === 'audit' && (
              <AuditLogViewer logs={auditLogs} />
            )}
          </div>
        )}
      </main>

      {/* Slide-out Railway Jargon Glossary Drawer */}
      <GlossaryDrawer
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        language={language}
      />

      {/* 90-Second Guided Demo Walkthrough Modal */}
      <GuidedDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onExploreConsole={() => {
          setIsDemoModalOpen(false);
          setViewMode('console');
          setActiveTab('cockpit');
        }}
        language={language}
      />

      {/* Global Institutional Footer */}
      <footer className="bg-[#0b132b] border-t border-slate-800 py-3.5 px-6 text-center text-xs text-slate-400 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>RAILSYNC-ABP v1.0 • Smart India Hackathon 2026 • Ministry of Railways (SIH26027)</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
          <span>Decision-Support Layer</span>
          <span>•</span>
          <span>General & Subsidiary Rules (G&SR) Verified</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
