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
    const civilRaw: Omit<TimelineTask, 'subRow' | 'leftPct' | 'widthPct'>[] = [];
    const trdRaw: Omit<TimelineTask, 'subRow' | 'leftPct' | 'widthPct'>[] = [];
    const sntRaw: Omit<TimelineTask, 'subRow' | 'leftPct' | 'widthPct'>[] = [];

    (blocks || []).forEach((b) => {
      const depts = (b.departments_involved && b.departments_involved.length > 0)
        ? b.departments_involved
        : (b.department ? [b.department] : ['Engineering']);

      const hasCivil = depts.some((d: string) => /civil|engineering|tms/i.test(d));
      const hasTrd = depts.some((d: string) => /traction|trd|electrical|ohe|power/i.test(d)) || b.isolation_required;
      const hasSnt = depts.some((d: string) => /signal|telecom|s&t|smms/i.test(d));

      const cleanStart = (b.start_time || '01:00').replace(/Day \d+ /, '').trim();
      const cleanEnd = (b.end_time || '03:00').replace(/Day \d+ /, '').trim();
      const startMin = b.start_minutes !== undefined ? (b.start_minutes % 1440) : parseToMins(cleanStart);
      let endMin = b.end_minutes !== undefined ? (b.end_minutes % 1440) : parseToMins(cleanEnd);
      if (endMin <= startMin) {
        const dur = b.duration_hours ? Math.round(b.duration_hours * 60) : 120;
        endMin = Math.min(1439, startMin + dur);
      }

      const sectionStr = b.section || b.corridor_id || 'Corridor Track';
      const kmStr = b.km_span ? ` (${b.km_span})` : '';
      const equipmentStr = b.isolation_type || (b.isolation_required ? '25 kV OHE Tower Wagon' : 'Standard Gang / Machine');

      // 1. Civil Lane
      if (hasCivil || (!hasTrd && !hasSnt)) {
        civilRaw.push({
          id: `${b.block_id}-CIV`,
          name: `${b.block_id}: Track Renewal & Possessions`,
          shortName: `${b.block_id} Track Work`,
          department: 'Civil Engineering (TMS)',
          start: cleanStart,
          end: cleanEnd,
          startMin,
          endMin,
          section: `${sectionStr}${kmStr}`,
          equipment: equipmentStr,
          safetyStatus: isBaseline
            ? `Uncoordinated FCFS · Impact ${b.operational_impact_score || 0}/100`
            : (b.isolation_required ? '25 kV AC Isolated · 100% G&SR Compliant' : '100% G&SR Compliant · 0m Train Delay'),
          gradient: isBaseline
            ? 'bg-gradient-to-r from-red-950/80 to-rose-950/80'
            : 'bg-gradient-to-r from-cyan-950/85 to-sky-950/85',
          border: isBaseline ? 'border-red-500/50 hover:border-red-400' : 'border-cyan-500/50 hover:border-cyan-400',
          badgeBg: isBaseline ? 'bg-red-500/20' : 'bg-cyan-500/20',
          badgeText: isBaseline ? 'text-red-300' : 'text-cyan-300'
        });
      }

      // 2. TRD Lane
      if (hasTrd) {
        trdRaw.push({
          id: `${b.block_id}-TRD`,
          name: `${b.block_id}: 25 kV OHE Power Cut & Wire Overhaul`,
          shortName: `${b.block_id} OHE Work`,
          department: 'Traction Distribution (TRD)',
          start: cleanStart,
          end: cleanEnd,
          startMin,
          endMin,
          section: `${sectionStr}${kmStr}`,
          equipment: 'OHE Tower Wagon & SCADA',
          safetyStatus: isBaseline
            ? `Uncoordinated FCFS · Impact ${b.operational_impact_score || 0}/100`
            : 'Permit-to-Work Authorized by TPC · Wire Grounded',
          gradient: isBaseline
            ? 'bg-gradient-to-r from-red-950/80 to-rose-950/80'
            : 'bg-gradient-to-r from-emerald-950/85 to-teal-950/85',
          border: isBaseline ? 'border-red-500/50 hover:border-red-400' : 'border-emerald-500/50 hover:border-emerald-400',
          badgeBg: isBaseline ? 'bg-red-500/20' : 'bg-emerald-500/20',
          badgeText: isBaseline ? 'text-emerald-300' : 'text-emerald-300'
        });
      }

      // 3. S&T Lane
      if (hasSnt) {
        sntRaw.push({
          id: `${b.block_id}-SNT`,
          name: `${b.block_id}: Point Machine & Axle Sensor Tuning`,
          shortName: `${b.block_id} S&T Work`,
          department: 'Signal & Telecom (SMMS)',
          start: cleanStart,
          end: cleanEnd,
          startMin,
          endMin,
          section: `${sectionStr}${kmStr}`,
          equipment: 'Electronic Point Motor Testing Kit',
          safetyStatus: isBaseline
            ? `Uncoordinated FCFS · Impact ${b.operational_impact_score || 0}/100`
            : '100% Signal Integrity Certified · Track Clear',
          gradient: isBaseline
            ? 'bg-gradient-to-r from-red-950/80 to-rose-950/80'
            : 'bg-gradient-to-r from-purple-950/85 to-indigo-950/85',
          border: isBaseline ? 'border-red-500/50 hover:border-red-400' : 'border-purple-500/50 hover:border-purple-400',
          badgeBg: isBaseline ? 'bg-red-500/20' : 'bg-purple-500/20',
          badgeText: isBaseline ? 'text-purple-300' : 'text-purple-300'
        });
      }
    });

    return [
      {
        id: 'civil',
        name: t.laneCivil,
        icon: Hammer,
        iconColor: isBaseline ? 'text-red-400' : 'text-cyan-400',
        iconBg: isBaseline ? 'bg-red-500/10 border-red-500/30' : 'bg-cyan-500/10 border-cyan-500/30',
        ...layoutSubLanes(civilRaw)
      },
      {
        id: 'trd',
        name: t.laneTrd,
        icon: Zap,
        iconColor: isBaseline ? 'text-red-400' : 'text-emerald-400',
        iconBg: isBaseline ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30',
        ...layoutSubLanes(trdRaw)
      },
      {
        id: 'snt',
        name: t.laneSnt,
        icon: Radio,
        iconColor: isBaseline ? 'text-red-400' : 'text-purple-400',
        iconBg: isBaseline ? 'bg-red-500/10 border-red-500/30' : 'bg-purple-500/10 border-purple-500/30',
        ...layoutSubLanes(sntRaw)
      }
    ];
  }, [blocks, isBaseline, t]);

  return (
    <div className="cr-panel p-5 sm:p-6 mt-6 relative">
      {/* 3-State Machine Safety Badge Strip */}
      <div className="bg-[var(--cr-bg)] border border-[var(--cr-border)] p-3 rounded-lg mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--cr-status-green)] flex-shrink-0" />
          <span className="font-semibold text-[var(--cr-text-primary)]">
            {language === 'hi'
              ? '25 kV ट्रैक्शन सुरक्षा प्रोटोकॉल (G&SR):'
              : (language === 'ta'
              ? '25 kV மின் இழுவை பாதுகாப்பு நெறிமுறை (G&SR):'
              : '25 kV Traction Safety State Machine (G&SR Norms):')}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={isBaseline ? 'cr-badge-red' : 'cr-badge-neutral'}>
            {t.badgeLiveOhe}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[var(--cr-text-muted)]" />
          <span className={!isBaseline ? 'cr-badge-amber' : 'cr-badge-neutral'}>
            {t.badgeIsolating}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[var(--cr-text-muted)]" />
          <span className={!isBaseline ? 'cr-badge-green' : 'cr-badge-neutral'}>
            {t.badgeCleared}
          </span>
        </div>
      </div>

      {/* Title & Plan Status Bar */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[var(--cr-border)] gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-1.5 rounded-lg bg-[var(--cr-primary)]/10 border border-[var(--cr-primary)]/30 text-[var(--cr-primary)]">
            <Layers className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-[var(--cr-text-primary)]">
            {language === 'hi'
              ? 'त्रि-विभागीय समन्वित कार्य अनुसूची (गैंट चार्ट)'
              : (language === 'ta'
              ? 'முத்துறை ஒருங்கிணைந்த பணிக் காலவரிசை (கான்ட் வரைபடம்)'
              : 'Cross-Department Synchronized Gantt Schedule')}
          </h2>
          <span className={isBaseline ? 'cr-badge-red' : 'cr-badge-green'}>
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
        <div className="text-xs text-[var(--cr-text-muted)] flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-[var(--cr-status-green)]" />
          <span className="hidden sm:inline">Setup + Work + Testing + Clearance + Safety Buffer</span>
        </div>
      </div>

      {/* Main Gantt Track Container with Scroll Safeguard */}
      <div className="overflow-x-auto max-w-full">
        <div className="min-w-[700px]">
          {/* 24-Hour Time Axis Header */}
          <div className="relative mb-3 border-b border-[var(--cr-border)] pb-2 select-none">
            <div className="flex items-center">
              <div className="w-64 flex-shrink-0 text-[var(--cr-text-muted)] text-xs font-semibold px-2">
                <span>Department Lane</span>
              </div>

              <div className="flex-1 relative h-6">
                {/* Top Night Window Banner */}
                {!isBaseline && (
                  <div
                    className="absolute top-0 bottom-0 bg-[var(--cr-status-green)]/15 border-x border-[var(--cr-status-green)]/40 flex items-center justify-center rounded pointer-events-none"
                    style={{
                      left: `${toPct(60)}%`,
                      width: `${toPct(205)}%`
                    }}
                  >
                    <span className="text-xs font-bold text-[var(--cr-status-green)] tracking-tight px-1 truncate">
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
                      className="absolute -translate-x-1/2 text-xs text-[var(--cr-text-secondary)] tabular-nums font-semibold flex flex-col items-center pointer-events-none"
                      style={{ left: `${pct}%` }}
                    >
                      <span>{hourStr}</span>
                      <div className="w-px h-1.5 bg-[var(--cr-border)] mt-0.5" />
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
                  className="flex items-center gap-3 bg-[var(--cr-surface)] p-3 rounded-xl border border-[var(--cr-border)] transition-colors"
                >
                  {/* Lane Info Card */}
                  <div className="w-64 flex-shrink-0 flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl border ${lane.iconBg} ${lane.iconColor} flex-shrink-0 shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-[var(--cr-text-primary)] block truncate" title={lane.name}>
                        {lane.name}
                      </span>
                      <span className="text-xs text-[var(--cr-text-muted)] block mt-0.5">
                        {lane.tasks.length} {lane.tasks.length === 1 ? 'task' : 'tasks'} scheduled
                      </span>
                    </div>
                  </div>

                  {/* Timeline Track Container */}
                  <div
                    className="flex-1 bg-[var(--cr-bg)] rounded-xl relative overflow-hidden border border-[var(--cr-border)] transition-all shadow-inner"
                    style={{ height: `${containerHeight}px` }}
                  >
                    {/* 24-Hour Vertical Grid Guidelines */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 w-px bg-[var(--cr-border)]/40 pointer-events-none"
                        style={{ left: `${(i / 12) * 100}%` }}
                      />
                    ))}

                    {/* Night Traffic Lull Background Highlight Band */}
                    {!isBaseline && (
                      <div
                        className="absolute top-0 bottom-0 bg-[var(--cr-status-green)]/[0.05] border-x border-[var(--cr-status-green)]/20 pointer-events-none"
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
                        className={`absolute rounded-lg px-2.5 flex items-center justify-between border shadow-md transition-all hover:scale-[1.01] hover:z-20 cursor-pointer overflow-hidden ${task.gradient} ${task.border}`}
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
                        <span className="text-xs font-bold text-white truncate pr-2 select-none">
                          {task.widthPct < 8 ? task.shortName : task.name}
                        </span>

                        {/* Time Badge */}
                        <span className={`text-xs tabular-nums font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${task.badgeBg} ${task.badgeText} select-none`}>
                          {task.start}–{task.end}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Task Inspection Popover */}
      {hoveredTask && (
        <div className="absolute top-16 right-8 cr-panel p-4 shadow-2xl backdrop-blur-md text-xs max-w-md z-30 pointer-events-none transition-all">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--cr-border)] pb-2 mb-2">
            <span className="font-bold text-[var(--cr-text-primary)] text-sm">{hoveredTask.name}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold tabular-nums ${hoveredTask.badgeBg} ${hoveredTask.badgeText}`}>
              {hoveredTask.start} to {hoveredTask.end}
            </span>
          </div>

          <div className="space-y-1.5 text-[var(--cr-text-muted)]">
            <p className="flex items-center gap-1.5">
              <strong className="text-[var(--cr-text-primary)] font-semibold">Department:</strong>
              <span className="text-[var(--cr-primary)] font-medium">{hoveredTask.department}</span>
            </p>
            {hoveredTask.section && (
              <p className="flex items-center gap-1.5">
                <strong className="text-[var(--cr-text-primary)] font-semibold">Corridor / Span:</strong>
                <span className="text-[var(--cr-text-primary)] font-medium tabular-nums">{hoveredTask.section}</span>
              </p>
            )}
            {hoveredTask.equipment && (
              <p className="flex items-center gap-1.5">
                <strong className="text-[var(--cr-text-primary)] font-semibold">Plant & Machinery:</strong>
                <span className="text-[var(--cr-status-green)] font-medium">{hoveredTask.equipment}</span>
              </p>
            )}
            <p className="flex items-start gap-1.5 mt-2 pt-2 border-t border-[var(--cr-border)]">
              {isBaseline ? (
                <span className="text-[var(--cr-status-red)] flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{hoveredTask.safetyStatus}</span>
                </span>
              ) : (
                <span className="text-[var(--cr-status-green)] flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{hoveredTask.safetyStatus}</span>
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="mt-5 pt-3.5 border-t border-[var(--cr-border)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--cr-text-muted)]">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isBaseline ? 'bg-[var(--cr-status-red)]' : 'bg-[var(--cr-status-green)]'}`}></span>
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
        <span className={`font-semibold tabular-nums ${isBaseline ? 'text-[var(--cr-status-red)]' : 'text-[var(--cr-primary)]'}`}>
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
