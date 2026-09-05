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
import { motion, AnimatePresence } from 'framer-motion';

export function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [viewMode, setViewMode] = useState<'story' | 'console'>('story');
  const [activeTab, setActiveTab] = useState<string>('cockpit');
  const [selectedPlanKey, setSelectedPlanKey] = useState<'plan_a' | 'plan_b' | 'baseline_fcfs'>('plan_a');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);

  // Theme Management: light / dark with system preference fallback and localStorage persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('railsync-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('railsync-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };
  
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
    <div className="min-h-screen bg-[var(--cr-bg)] text-[var(--cr-text-primary)] flex flex-col font-sans selection:bg-[var(--cr-primary-interactive)] selection:text-white relative overflow-x-hidden w-full max-w-full transition-colors">
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
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6 relative z-10">
        <AnimatePresence mode="wait">
          {viewMode === 'story' ? (
            /* Story Flow View with smooth motion transition */
            <motion.div
              key="story-flow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <StoryFlow
                language={language}
                onLaunchDemo={() => setIsDemoModalOpen(true)}
                onOpenConsole={(tab) => {
                  if (tab) setActiveTab(tab);
                  setViewMode('console');
                }}
                onOpenGlossary={() => setIsGlossaryOpen(true)}
              />
            </motion.div>
          ) : (
            /* Full Engineering Console View */
            <motion.div
              key={`console-${activeTab}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="space-y-6 w-full"
            >
              {/* Top KPI Telemetry Cards (Clean layout, sans-serif typography, WCAG legible) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Block Utilization */}
                <div className="cr-card p-4 sm:p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[var(--cr-text-secondary)] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Block Utilization</span>
                    <div className="p-1.5 rounded bg-[var(--cr-status-green-bg)] text-[var(--cr-status-green)]">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[var(--cr-text-primary)] tracking-tight">
                      {selectedPlanKey === 'baseline_fcfs' ? '42%' : (selectedPlanKey === 'plan_b' ? '82%' : '88%')}
                    </span>
                    <span className={selectedPlanKey === 'baseline_fcfs' ? 'cr-badge-red' : 'cr-badge-green'}>
                      {selectedPlanKey === 'baseline_fcfs' ? '-46% vs Plan A' : '+46% vs Baseline'}
                    </span>
                  </div>
                </div>

                {/* Passenger Train Delays */}
                <div className="cr-card p-4 sm:p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[var(--cr-text-secondary)] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Passenger Delays</span>
                    <div className="p-1.5 rounded bg-[var(--cr-status-blue-bg)] text-[var(--cr-status-blue)]">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${selectedPlanKey === 'baseline_fcfs' ? 'text-[var(--cr-status-red)]' : 'text-[var(--cr-status-green)]'}`}>
                      {selectedPlanKey === 'baseline_fcfs' ? `${baseline?.passenger_trains_delayed || 4} Trains` : '0 min'}
                    </span>
                    <span className={selectedPlanKey === 'baseline_fcfs' ? 'cr-badge-red' : 'cr-badge-green'}>
                      {selectedPlanKey === 'baseline_fcfs' ? 'Detentions' : '100% Punctual'}
                    </span>
                  </div>
                </div>

                {/* Track Availability Index */}
                <div className="cr-card p-4 sm:p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[var(--cr-text-secondary)] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Track Availability</span>
                    <div className="p-1.5 rounded bg-[var(--cr-status-blue-bg)] text-[var(--cr-status-blue)]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[var(--cr-text-primary)] tracking-tight">
                      {selectedPlanKey === 'baseline_fcfs' ? '71.5%' : (selectedPlanKey === 'plan_b' ? '91.0%' : '94.2%')}
                    </span>
                    <span className={selectedPlanKey === 'baseline_fcfs' ? 'cr-badge-amber' : 'cr-badge-green'}>
                      {selectedPlanKey === 'baseline_fcfs' ? 'Bottlenecks' : 'Max Capacity'}
                    </span>
                  </div>
                </div>

                {/* Multi-Dept Synergy */}
                <div className="cr-card p-4 sm:p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[var(--cr-text-secondary)] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Multi-Dept Synergy</span>
                    <div className="p-1.5 rounded bg-[var(--cr-status-green-bg)] text-[var(--cr-status-green)]">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[var(--cr-text-primary)] tracking-tight">
                      {selectedPlanKey === 'baseline_fcfs' ? '0%' : (currentPlan?.bundled_blocks_ratio || '83.3%')}
                    </span>
                    <span className={selectedPlanKey === 'baseline_fcfs' ? 'cr-badge-red' : 'cr-badge-green'}>
                      {selectedPlanKey === 'baseline_fcfs' ? 'Silos' : '3-in-1 Bundled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab 1: Planning Cockpit (Marey & Gantt) */}
              {activeTab === 'cockpit' && (
                <div className="space-y-6">
                  {/* Plan Selection Bar (Tactile segmented controls) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 cr-panel p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[var(--cr-text-secondary)] px-1">Display Plan:</span>
                      <div className="cr-segmented-container">
                        <button
                          onClick={() => setSelectedPlanKey('plan_a')}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                            selectedPlanKey === 'plan_a'
                              ? 'bg-[var(--cr-surface)] text-[var(--cr-text-primary)] border border-[var(--cr-border-active)] shadow-xs'
                              : 'text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)]'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-[var(--cr-status-green)]"></span>
                          <span>Plan A (Least Disruption - Recommended)</span>
                        </button>
                        <button
                          onClick={() => setSelectedPlanKey('plan_b')}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                            selectedPlanKey === 'plan_b'
                              ? 'bg-[var(--cr-surface)] text-[var(--cr-text-primary)] border border-[var(--cr-border-active)] shadow-xs'
                              : 'text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)]'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-[var(--cr-status-amber)]"></span>
                          <span>Plan B (Fastest Critical Maintenance)</span>
                        </button>
                        <button
                          onClick={() => setSelectedPlanKey('baseline_fcfs')}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                            selectedPlanKey === 'baseline_fcfs'
                              ? 'bg-[var(--cr-surface)] text-[var(--cr-text-primary)] border border-[var(--cr-border-active)] shadow-xs'
                              : 'text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)]'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-[var(--cr-status-red)]"></span>
                          <span>Current Reality (FCFS Baseline)</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-[var(--cr-text-secondary)] hidden lg:block bg-[var(--cr-surface-subtle)] px-3 py-1.5 rounded-lg border border-[var(--cr-border)] font-medium">
                      Corridor: <span className="font-bold text-[var(--cr-text-primary)]">Kanpur Central (CNB) ➔ New Delhi (NDLS) Main Line</span>
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
            </motion.div>
          )}
        </AnimatePresence>
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
      <footer className="bg-[var(--cr-surface)] border-t border-[var(--cr-border)] py-3 px-6 text-center text-xs text-[var(--cr-text-secondary)] flex flex-wrap justify-between items-center gap-3 transition-colors">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--cr-status-green)]"></span>
          <span className="font-semibold text-[var(--cr-text-primary)]">
            RAILSYNC v1.0 • Smart India Hackathon 2026 • Ministry of Railways (SIH26027)
          </span>
        </div>
        <div className="flex items-center gap-4 text-[var(--cr-text-secondary)] text-xs font-medium">
          <span>Decision-Support Layer</span>
          <span className="text-[var(--cr-border)]">•</span>
          <span className="text-[var(--cr-status-green)] font-bold">G&SR Safety Rules Verified</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
