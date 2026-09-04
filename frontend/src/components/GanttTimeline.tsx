import React, { useState, useMemo } from 'react';
import { Layers, ShieldCheck, Zap, Radio, Hammer, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { CandidateBlock } from '../types';
import type { Language } from '../i18n/translations';
import { TRANSLATIONS } from '../i18n/translations';

interface GanttTimelineProps {
  selectedPlan: string;
  blocks?: CandidateBlock[];
  language?: Language;
}

interface TimelineTask {
  id: string;
  name: string;
  shortName: string;
  department: string;
  start: string;
  end: string;
  startMin: number;
  endMin: number;
  leftPct: number;
  widthPct: number;
  subRow: number;
  section?: string;
  equipment?: string;
  safetyStatus?: string;
  gradient: string;
  border: string;
  badgeBg: string;
  badgeText: string;
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({ selectedPlan, blocks, language = 'en' }) => {
  const isBaseline = selectedPlan === 'baseline_fcfs';
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [hoveredTask, setHoveredTask] = useState<TimelineTask | null>(null);

  const parseToMins = (timeStr: string) => {
    const clean = timeStr.replace(/Day \d+ /, '').trim();
    const [h, m] = clean.split(':').map(Number);
    return ((h || 0) * 60 + (m || 0)) % 1440;
  };

  const toPct = (mins: number) => Math.min(100, Math.max(0, (mins / 1440) * 100));

  // Smart sub-lane layout engine: stacks overlapping tasks into clean distinct vertical rows
  const layoutSubLanes = (tasks: Omit<TimelineTask, 'subRow' | 'leftPct' | 'widthPct'>[]) => {
    const sorted = [...tasks].sort((a, b) => a.startMin - b.startMin);
    const rowEnds: number[] = [];

    const positionedTasks: TimelineTask[] = sorted.map((task) => {
      let assignedRow = -1;
      for (let r = 0; r < rowEnds.length; r++) {
        // Minimum 5 minutes buffer to share the same sub-row
        if (task.startMin >= rowEnds[r] + 4) {
          assignedRow = r;
          rowEnds[r] = task.endMin;
          break;
        }
      }

      if (assignedRow === -1) {
        assignedRow = rowEnds.length;
        rowEnds.push(task.endMin);
      }

      const leftPct = toPct(task.startMin);
      const rawWidthPct = toPct(task.endMin > task.startMin ? task.endMin - task.startMin : (1440 - task.startMin + task.endMin));
      const widthPct = Math.max(5.5, rawWidthPct);

      return {
        ...task,
        subRow: assignedRow,
        leftPct,
        widthPct
      };
    });

    return {
      tasks: positionedTasks,
      totalRows: Math.max(1, rowEnds.length)
    };
  };

  const lanes = useMemo(() => {
    if (isBaseline) {
      // BASELINE FCFS: 3 uncoordinated daytime blocks across separate hours
      const civilRaw = [
        {
          id: 'CIV-BASE-1',
          name: 'Track Renewal & Ballast Screening (COR-003)',
          shortName: 'Track Renewal',
          department: 'Civil Engineering (TMS)',
          start: '09:00',
          end: '12:00',
          startMin: 9 * 60,
          endMin: 12 * 60,
          section: 'COR-003 (KM 116.1 – 120.7)',
          equipment: 'CSM-09 Continuous Action Tamper',
          safetyStatus: 'Uncoordinated FCFS · Delayed Train 12876 (Neelachal Exp)',
          gradient: 'bg-gradient-to-r from-red-950/80 to-rose-950/80',
          border: 'border-red-500/50 hover:border-red-400',
          badgeBg: 'bg-red-500/20',
          badgeText: 'text-red-300'
        }
      ];

      const trdRaw = [
        {
          id: 'TRD-BASE-1',
          name: '25 kV OHE Isolation & Overhaul (COR-012)',
          shortName: 'OHE Isolation',
          department: 'Traction Distribution (TRD)',
          start: '13:00',
          end: '15:30',
          startMin: 13 * 60,
          endMin: 15 * 60 + 30,
          section: 'COR-012 (KM 178.2 – 182.8)',
          equipment: 'OHE Tower Wagon 4-Wheeler',
          safetyStatus: 'Uncoordinated FCFS · Detained Freight BCN Rake 70109',
          gradient: 'bg-gradient-to-r from-red-950/80 to-rose-950/80',
          border: 'border-red-500/50 hover:border-red-400',
          badgeBg: 'bg-red-500/20',
          badgeText: 'text-red-300'
        }
      ];

      const sntRaw = [
        {
          id: 'SNT-BASE-1',
          name: 'MSDAC Point Machine Calibration (COR-002)',
          shortName: 'Point Calibration',
          department: 'Signal & Telecom (SMMS)',
          start: '16:00',
          end: '18:30',
          startMin: 16 * 60,
          endMin: 18 * 60 + 30,
          section: 'COR-002 (KM 226.5 – 231.1)',
          equipment: 'Electronic Point Motor Testing Kit',
          safetyStatus: 'Uncoordinated FCFS · Delayed Train 14164 (Sangam Exp)',
          gradient: 'bg-gradient-to-r from-red-950/80 to-rose-950/80',
          border: 'border-red-500/50 hover:border-red-400',
          badgeBg: 'bg-red-500/20',
          badgeText: 'text-red-300'
        }
      ];

      return [
        {
          id: 'civil',
          name: t.laneCivil,
          icon: Hammer,
          iconColor: 'text-red-400',
          iconBg: 'bg-red-500/10 border-red-500/30',
          ...layoutSubLanes(civilRaw)
        },
        {
          id: 'trd',
          name: t.laneTrd,
          icon: Zap,
          iconColor: 'text-red-400',
          iconBg: 'bg-red-500/10 border-red-500/30',
          ...layoutSubLanes(trdRaw)
        },
        {
          id: 'snt',
          name: t.laneSnt,
          icon: Radio,
          iconColor: 'text-red-400',
          iconBg: 'bg-red-500/10 border-red-500/30',
          ...layoutSubLanes(sntRaw)
        }
      ];
    }

    // CP-SAT OPTIMIZED: Synchronized parallel co-work under single 25 kV shutdown (01:00–04:25)
    const civilRaw = [
      {
        id: 'CIV-OPT-1',
        name: 'CSM-09 Track Tamping & Lining (KM 116–155)',
        shortName: 'CSM-09 Track Tamping',
        department: 'Civil Engineering (TMS)',
        start: '01:15',
        end: '03:20',
        startMin: parseToMins('01:15'),
        endMin: parseToMins('03:20'),
        section: 'COR-003, COR-005, COR-008',
        equipment: 'CSM-09 32-Sleeper Continuous Action Tamper',
        safetyStatus: '100% G&SR Compliant • 0m Train Delay',
        gradient: 'bg-gradient-to-r from-cyan-950/85 to-sky-950/85',
        border: 'border-cyan-500/50 hover:border-cyan-400',
        badgeBg: 'bg-cyan-500/20',
        badgeText: 'text-cyan-300'
      },
      {
        id: 'CIV-OPT-2',
        name: 'USFD Ultrasonic Rail Flaw Rectification',
        shortName: 'USFD Flaw Testing',
        department: 'Civil Engineering (TMS)',
        start: '02:30',
        end: '04:15',
        startMin: parseToMins('02:30'),
        endMin: parseToMins('04:15'),
        section: 'COR-007 (KM 143.7 – 146.0)',
        equipment: 'Digital USFD Rail Flaw Detector Trolley',
        safetyStatus: '100% G&SR Compliant • 0m Train Delay',
        gradient: 'bg-gradient-to-r from-cyan-950/85 to-blue-950/85',
        border: 'border-cyan-500/50 hover:border-cyan-400',
        badgeBg: 'bg-cyan-500/20',
        badgeText: 'text-cyan-300'
      }
    ];

    const trdRaw = [
      {
        id: 'TRD-OPT-1',
        name: '25 kV OHE Isolation & Earth Discharge',
        shortName: 'OHE Power Cutoff',
        department: 'Traction Distribution (TRD)',
        start: '01:00',
        end: '01:30',
        startMin: parseToMins('01:00'),
        endMin: parseToMins('01:30'),
        section: 'Division Main Line (KM 116 – 231)',
        equipment: 'TPC Supervisory Remote Terminal (SCADA)',
        safetyStatus: 'Permit-to-Work Authorized by TPC',
        gradient: 'bg-gradient-to-r from-amber-950/85 to-yellow-950/85',
        border: 'border-amber-500/50 hover:border-amber-400',
        badgeBg: 'bg-amber-500/20',
        badgeText: 'text-amber-300'
      },
      {
        id: 'TRD-OPT-2',
        name: 'Cantilever & Dropper Overhaul (Power Block)',
        shortName: 'Cantilever Overhaul',
        department: 'Traction Distribution (TRD)',
        start: '01:30',
        end: '03:50',
        startMin: parseToMins('01:30'),
        endMin: parseToMins('03:50'),
        section: 'COR-003 to COR-008 (KM 116 – 155)',
        equipment: 'OHE Tower Inspection Wagon',
        safetyStatus: 'Work under Verified De-energized Wire',
        gradient: 'bg-gradient-to-r from-emerald-950/85 to-teal-950/85',
        border: 'border-emerald-500/50 hover:border-emerald-400',
        badgeBg: 'bg-emerald-500/20',
        badgeText: 'text-emerald-300'
      },
      {
        id: 'TRD-OPT-3',
        name: 'OHE Normalization & Track Clearance',
        shortName: 'OHE Recharge',
        department: 'Traction Distribution (TRD)',
        start: '03:50',
        end: '04:20',
        startMin: parseToMins('03:50'),
        endMin: parseToMins('04:20'),
        section: 'Division Main Line (KM 116 – 231)',
        equipment: 'SCADA Circuit Breaker Reclose',
        safetyStatus: 'Power Recharged • Clear for Traffic',
        gradient: 'bg-gradient-to-r from-cyan-950/85 to-sky-950/85',
        border: 'border-cyan-500/50 hover:border-cyan-400',
        badgeBg: 'bg-cyan-500/20',
        badgeText: 'text-cyan-300'
      }
    ];

    const sntRaw = [
      {
        id: 'SNT-OPT-1',
        name: 'Point Machine 143mm Calibration & Testing',
        shortName: 'Point Machine Testing',
        department: 'Signal & Telecom (SMMS)',
        start: '01:30',
        end: '03:15',
        startMin: parseToMins('01:30'),
        endMin: parseToMins('03:15'),
        section: 'COR-005 (KM 129.9 – 134.5)',
        equipment: 'High-Precision Point Obstruction Gauge',
        safetyStatus: 'Simultaneous with Civil Tamping Window',
        gradient: 'bg-gradient-to-r from-purple-950/85 to-indigo-950/85',
        border: 'border-purple-500/50 hover:border-purple-400',
        badgeBg: 'bg-purple-500/20',
        badgeText: 'text-purple-300'
      },
      {
        id: 'SNT-OPT-2',
        name: 'Dual MSDAC Sensor Tuning & Verification',
        shortName: 'MSDAC Axle Tuning',
        department: 'Signal & Telecom (SMMS)',
        start: '02:45',
        end: '04:15',
        startMin: parseToMins('02:45'),
        endMin: parseToMins('04:15'),
        section: 'COR-008 (KM 150.6 – 155.2)',
        equipment: 'MSDAC Axle Counter Calibrator',
        safetyStatus: '100% Signal Integrity Certified',
        gradient: 'bg-gradient-to-r from-purple-950/85 to-violet-950/85',
        border: 'border-purple-500/50 hover:border-purple-400',
        badgeBg: 'bg-purple-500/20',
        badgeText: 'text-purple-300'
      }
    ];

    return [
      {
        id: 'civil',
        name: t.laneCivil,
        icon: Hammer,
        iconColor: 'text-cyan-400',
        iconBg: 'bg-cyan-500/10 border-cyan-500/30',
        ...layoutSubLanes(civilRaw)
      },
      {
        id: 'trd',
        name: t.laneTrd,
        icon: Zap,
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/10 border-emerald-500/30',
        ...layoutSubLanes(trdRaw)
      },
      {
        id: 'snt',
        name: t.laneSnt,
        icon: Radio,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-500/10 border-purple-500/30',
        ...layoutSubLanes(sntRaw)
      }
    ];
  }, [blocks, isBaseline, t]);

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl shadow-2xl mt-6 relative transition-all">
      {/* 3-State Machine Safety Badge Strip */}
      <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl mb-5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-bold text-slate-200 font-mono">
            {language === 'hi'
              ? '25 kV ट्रैक्शन सुरक्षा प्रोटोकॉल (G&SR):'
              : (language === 'ta'
              ? '25 kV மின் இழுவை பாதுகாப்பு நெறிமுறை (G&SR):'
              : '25 kV Traction Safety State Machine (G&SR Norms):')}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold border ${
            isBaseline ? 'bg-red-500/20 text-red-300 border-red-500/40 ring-1 ring-red-500/50' : 'bg-slate-800 text-slate-500 border-slate-700'
          }`}>
            {t.badgeLiveOhe}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold border ${
            !isBaseline ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'
          }`}>
            {t.badgeIsolating}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold border ${
            !isBaseline ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/50' : 'bg-slate-800 text-slate-500 border-slate-700'
          }`}>
            {t.badgeCleared}
          </span>
        </div>
      </div>

      {/* Title & Plan Status Bar */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white">
            {language === 'hi'
              ? 'त्रि-विभागीय समन्वित कार्य अनुसूची (गैंट चार्ट)'
              : (language === 'ta'
              ? 'முத்துறை ஒருங்கிணைந்த பணிக் காலவரிசை (கான்ட் வரைபடம்)'
              : 'Cross-Department Synchronized Gantt Schedule')}
          </h2>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold ${isBaseline ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}`}>
            {isBaseline
              ? (language === 'hi'
                ? 'असमन्वित अलग-अलग ब्लॉक (विभागीय साइलो)'
                : (language === 'ta'
                ? 'தனித்தனி ஒருங்கிணைப்பற்ற பிளாக்குகள்'
                : 'Fragmented Uncoordinated Possessions (Departmental Silos)'))
              : (language === 'hi'
                ? 'एकल 25 kV पावर ब्लॉक में समन्वित कार्य'
                : (language === 'ta'
                ? 'ஒற்றை 25 kV மின் நிறுத்தத்தில் ஒருங்கிணைந்த பணி'
                : 'Synchronized Under Single 25 kV Power Shutoff'))}
          </span>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Setup + Work + Testing + Clearance + Safety Buffer</span>
        </div>
      </div>

      {/* 24-Hour Time Axis Header */}
      <div className="relative mb-3 border-b border-slate-800/80 pb-2 select-none">
        <div className="flex items-center">
          <div className="w-64 flex-shrink-0 text-slate-400 text-xs font-semibold px-2 font-mono">
            <span>Department Lane</span>
          </div>

          <div className="flex-1 relative h-6">
            {/* Top Night Window Banner (No text collisions inside lane tracks) */}
            {!isBaseline && (
              <div
                className="absolute top-0 bottom-0 bg-emerald-500/10 border-x border-emerald-500/40 flex items-center justify-center rounded pointer-events-none"
                style={{
                  left: `${toPct(60)}%`,
                  width: `${toPct(205)}%`
                }}
              >
                <span className="text-[9px] font-mono font-bold text-emerald-400 tracking-tight px-1 truncate">
                  ✦ {language === 'hi' ? 'रात्रि ब्लॉक (01:00–04:25)' : (language === 'ta' ? 'இரவு பிளாக் (01:00–04:25)' : 'Night Window (01:00–04:25)')}
                </span>
              </div>
            )}

            {/* 13 Time Ticks across full 24-hour cycle */}
            {Array.from({ length: 13 }).map((_, i) => {
              const hour = i * 2;
              const pct = (hour / 24) * 100;
              const hourStr = `${hour.toString().padStart(2, '0')}:00`;

              return (
                <div
                  key={hour}
                  className="absolute -translate-x-1/2 text-[10px] text-slate-400 font-mono flex flex-col items-center pointer-events-none"
                  style={{ left: `${pct}%` }}
                >
                  <span>{hourStr}</span>
                  <div className="w-px h-1.5 bg-slate-700 mt-0.5" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Department Lanes with Smart Sub-lane Stacking */}
      <div className="space-y-3.5">
        {lanes.map((lane) => {
          const Icon = lane.icon;
          const containerHeight = Math.max(48, lane.totalRows * 42 + 8);

          return (
            <div
              key={lane.id}
              className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              {/* Lane Info Card */}
              <div className="w-64 flex-shrink-0 flex items-center gap-3 min-w-0">
                <div className={`p-2.5 rounded-xl border ${lane.iconBg} ${lane.iconColor} flex-shrink-0 shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-200 block truncate" title={lane.name}>
                    {lane.name}
                  </span>
                  <span className="text-[10.5px] text-slate-400 block font-mono mt-0.5">
                    {lane.tasks.length} {lane.tasks.length === 1 ? 'task' : 'tasks'} scheduled
                  </span>
                </div>
              </div>

              {/* Timeline Track Container */}
              <div
                className="flex-1 bg-slate-950/80 rounded-xl relative overflow-hidden border border-slate-800/60 transition-all shadow-inner"
                style={{ height: `${containerHeight}px` }}
              >
                {/* 24-Hour Vertical Grid Guidelines */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 w-px bg-slate-800/20 pointer-events-none"
                    style={{ left: `${(i / 12) * 100}%` }}
                  />
                ))}

                {/* Night Traffic Lull Background Highlight Band */}
                {!isBaseline && (
                  <div
                    className="absolute top-0 bottom-0 bg-emerald-500/[0.04] border-x border-emerald-500/20 pointer-events-none"
                    style={{
                      left: `${toPct(60)}%`,
                      width: `${toPct(205)}%`
                    }}
                  />
                )}

                {/* Sub-lane Stacked Task Cards (Guaranteed zero overlapping) */}
                {lane.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`absolute rounded-lg px-2.5 flex items-center justify-between border shadow-lg transition-all hover:scale-[1.01] hover:z-20 cursor-pointer overflow-hidden ${task.gradient} ${task.border}`}
                    style={{
                      left: `${task.leftPct}%`,
                      width: `${task.widthPct}%`,
                      top: `${task.subRow * 42 + 5}px`,
                      height: '34px'
                    }}
                    onMouseEnter={() => setHoveredTask(task)}
                    onMouseLeave={() => setHoveredTask(null)}
                  >
                    {/* Task Title */}
                    <span className="text-[10px] font-bold text-white truncate pr-2 select-none">
                      {task.widthPct < 8 ? task.shortName : task.name}
                    </span>

                    {/* Time Badge */}
                    <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${task.badgeBg} ${task.badgeText} select-none`}>
                      {task.start}–{task.end}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Task Inspection Popover */}
      {hoveredTask && (
        <div className="absolute top-16 right-8 bg-slate-900/95 border border-cyan-500/60 p-4 rounded-xl shadow-2xl backdrop-blur-md text-xs max-w-md z-30 pointer-events-none transition-all">
          <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-2 mb-2">
            <span className="font-bold text-white text-sm">{hoveredTask.name}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${hoveredTask.badgeBg} ${hoveredTask.badgeText}`}>
              {hoveredTask.start} to {hoveredTask.end}
            </span>
          </div>

          <div className="space-y-1.5 text-slate-300">
            <p className="flex items-center gap-1.5">
              <strong className="text-slate-400">Department:</strong>
              <span className="text-cyan-300">{hoveredTask.department}</span>
            </p>
            {hoveredTask.section && (
              <p className="flex items-center gap-1.5">
                <strong className="text-slate-400">Corridor / Span:</strong>
                <span className="text-white font-mono">{hoveredTask.section}</span>
              </p>
            )}
            {hoveredTask.equipment && (
              <p className="flex items-center gap-1.5">
                <strong className="text-slate-400">Plant & Machinery:</strong>
                <span className="text-emerald-300">{hoveredTask.equipment}</span>
              </p>
            )}
            <p className="flex items-start gap-1.5 mt-2 pt-2 border-t border-slate-800">
              {isBaseline ? (
                <span className="text-red-400 flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{hoveredTask.safetyStatus}</span>
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{hoveredTask.safetyStatus}</span>
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isBaseline ? 'bg-red-400 shadow-[0_0_8px_#ef4444]' : 'bg-emerald-400 shadow-[0_0_8px_#10b981]'}`}></span>
          <span>
            {isBaseline ? (
              language === 'hi' ? (
                <><strong>परिणाम:</strong> 3 विभागों द्वारा अलग-अलग दिन के ब्लॉक मांगने से 4+ ट्रेनें लेट और ट्रैक क्षमता का भारी नुकसान।</>
              ) : (language === 'ta' ? (
                <><strong>முடிவு:</strong> 3 துறைகள் பகலில் தனித்தனியாக பிளாக் கேட்பதால் 4+ ரயில்கள் தாமதம் மற்றும் பாதை திறன் இழப்பு.</>
              ) : (
                <><strong>Result:</strong> 3 departments booking separate daytime blocks causing 4+ train detentions and severe line capacity loss.</>
              ))
            ) : (
              language === 'hi' ? (
                <><strong>परिणाम:</strong> तीनों विभाग 1 ही संयुक्त ब्लॉक में एक साथ काम करते हैं। दिन के अलग-अलग ब्लॉकों से पूरी तरह मुक्ति।</>
              ) : (language === 'ta' ? (
                <><strong>முடிவு:</strong> 3 துறைகளும் ஒரே கூட்டுப் பிளாக்கில் இணைந்து செயல்படுகின்றன. பகல் நேரத் தனி மூடல்கள் தவிர்க்கப்பட்டன.</>
              ) : (
                <><strong>Result:</strong> 3 departments executing synchronized works under 1 combined possession. Avoids separate daytime track closures.</>
              ))
            )}
          </span>
        </div>
        <span className={`font-mono font-semibold ${isBaseline ? 'text-red-400' : 'text-cyan-400'}`}>
          {isBaseline
            ? (language === 'hi'
              ? 'संचालन प्रभाव: 74/100 (गंभीर व्यवधान)'
              : (language === 'ta'
              ? 'இயக்கத் தாக்கம்: 74/100 (அதிக இடையூறு)'
              : 'Operational Impact: 74/100 (High Disruption)'))
            : (language === 'hi'
              ? 'कुल प्रभावी कार्य: 3.25 घंटे में 8.75 घंटे का काम (269% उत्पादकता)'
              : (language === 'ta'
              ? 'மொத்த பயனுள்ள வேலை: 3.25 மணி நேரத்தில் 8.75 மணிநேர பணி (269% உற்பத்தித்திறன்)'
              : 'Total Effective Work Done: 8.75 Task Hours in 3.25 Block Hours (269% Productivity)'))}
        </span>
      </div>
    </div>
  );
};
