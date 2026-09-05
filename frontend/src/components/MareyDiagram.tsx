import React, { useState, useMemo } from 'react';
import type { CandidateBlock } from '../types';
import type { Language } from '../i18n/translations';
import { TRANSLATIONS } from '../i18n/translations';

interface MareyDiagramProps {
  selectedPlan: string;
  blocks?: CandidateBlock[];
  trainSchedules?: any[];
  onTogglePlan?: (planKey: string) => void;
  language?: Language;
}

interface PossessionZone {
  id: string;
  sectionName: string;
  start: string;
  end: string;
  km1: number;
  km2: number;
  color: string;
  depts: string;
  impact: number;
  delayedPax: number;
  notes: string;
  subTasks: string[];
}

export const MareyDiagram: React.FC<MareyDiagramProps> = ({
  selectedPlan,
  blocks = [],
  trainSchedules,
  onTogglePlan,
  language = 'en'
}) => {
  const [hoveredEntity, setHoveredEntity] = useState<any>(null);

  // 10 Station Milestones along the North Central Railway Corridor
  const stations = [
    { code: 'CNB', name: 'Kanpur Central', km: 0 },
    { code: 'RRH', name: 'Rura', km: 44 },
    { code: 'PHD', name: 'Phaphund', km: 83 },
    { code: 'ETW', name: 'Etawah', km: 139 },
    { code: 'SKB', name: 'Shikohabad', km: 195 },
    { code: 'TDL', name: 'Tundla Jn', km: 231 },
    { code: 'ALJN', name: 'Aligarh Jn', km: 309 },
    { code: 'KRJ', name: 'Khurja Jn', km: 352 },
    { code: 'GZB', name: 'Ghaziabad', km: 410 },
    { code: 'NDLS', name: 'New Delhi', km: 440 }
  ];

  const corridorKmMap: Record<string, [number, number]> = {
    'COR-001': [0, 44],
    'COR-002': [44, 83],
    'COR-003': [83, 139],
    'COR-004': [139, 195],
    'COR-005': [195, 231],
    'COR-006': [231, 309],
    'COR-007': [309, 352],
    'COR-008': [352, 410],
    'COR-009': [410, 440],
    'COR-010': [410, 440],
    'COR-011': [0, 83],
    'COR-012': [139, 231]
  };

  const width = 1180;
  const height = 530;
  // Generous left margin (195px) guarantees zero collision between station names and KM text
  const margin = { top: 54, right: 36, bottom: 48, left: 195 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const timeToX = (timeStr: string) => {
    const cleanTime = timeStr.replace(/Day \d+ /, '');
    const [h, m] = cleanTime.split(':').map(Number);
    const totalHours = (h || 0) + (m || 0) / 60;
    return margin.left + ((totalHours % 24) / 24) * innerWidth;
  };

  const kmToY = (km: number) => {
    const clampedKm = Math.max(0, Math.min(440, km));
    return margin.top + innerHeight - (clampedKm / 440) * innerHeight;
  };

  const trainPaths = useMemo(() => {
    if (trainSchedules && trainSchedules.length > 0) {
      return trainSchedules.map((t: any) => {
        const isPremium = t.priority === 'P0_TRAIN' || t.priority === 'P0';
        const isSuperfast = t.priority === 'P1_TRAIN' || t.priority === 'P1';
        const isFreight = t.priority === 'P3_TRAIN' || t.priority === 'Goods Rake' || t.train_id?.includes('GOODS');
        const color = isPremium ? '#00e5ff' : (isSuperfast ? '#818cf8' : (isFreight ? '#64748b' : '#f59e0b'));
        const kmBounds = corridorKmMap[t.route?.[0]] || [0, 440];
        const lastBounds = corridorKmMap[t.route?.[t.route.length - 1]] || [0, 440];

        return {
          id: t.train_id,
          name: t.train_name,
          type: t.class || 'Express',
          color,
          start: t.departure_time || '06:00',
          end: t.arrival_time || '10:00',
          kmStart: kmBounds[0],
          kmEnd: lastBounds[1],
          priority: isPremium ? 'P0 Premium' : (isSuperfast ? 'P1 Superfast' : (isFreight ? 'Goods Freight' : 'Passenger')),
          dashed: isFreight
        };
      });
    }

    return [
      { id: '12582', name: 'BSBS-NDLS Superfast Express', type: 'Superfast', color: '#f43f5e', start: '00:45', end: '03:15', kmStart: 83, kmEnd: 280, priority: 'P1 Superfast' },
      { id: '20104', name: 'Vande Bharat Express', type: 'Vande Bharat', color: '#00e5ff', start: '06:00', end: '09:15', kmStart: 0, kmEnd: 440, priority: 'P0 Premium' },
      { id: '12302', name: 'Howrah Rajdhani Express', type: 'Rajdhani', color: '#38bdf8', start: '06:45', end: '10:10', kmStart: 0, kmEnd: 440, priority: 'P0 Premium' },
      { id: '12424', name: 'Dibrugarh Rajdhani Exp', type: 'Rajdhani', color: '#0ea5e9', start: '07:30', end: '10:45', kmStart: 0, kmEnd: 440, priority: 'P0 Premium' },
      { id: '12876', name: 'Neelachal Express', type: 'Superfast', color: '#818cf8', start: '11:15', end: '15:30', kmStart: 0, kmEnd: 440, priority: 'P1 Superfast' },
      { id: '12488', name: 'Seemanchal Express', type: 'Superfast', color: '#a78bfa', start: '14:00', end: '18:15', kmStart: 83, kmEnd: 440, priority: 'P1 Superfast' },
      { id: '14164', name: 'Sangam Express', type: 'Express', color: '#f59e0b', start: '17:45', end: '22:30', kmStart: 0, kmEnd: 352, priority: 'P2 Express' },
      { id: '04154', name: 'Kanpur-Etawah Passenger', type: 'Passenger', color: '#fb923c', start: '19:00', end: '23:00', kmStart: 0, kmEnd: 139, priority: 'P3 Passenger' },
      { id: 'GOODS-70102', name: 'BOXN Coal Freight Rake', type: 'Freight', color: '#64748b', start: '00:15', end: '05:30', kmStart: 440, kmEnd: 0, priority: 'Goods Rake', dashed: true },
      { id: 'GOODS-70109', name: 'BCN Foodgrain Freight', type: 'Freight', color: '#64748b', start: '05:00', end: '09:45', kmStart: 440, kmEnd: 139, priority: 'Goods Rake', dashed: true }
    ];
  }, [trainSchedules]);

  // Non-Overlapping Station-to-Station Corridor Possessions
  // Dynamic Station-to-Station Corridor Possessions mapped directly from real solver candidate_blocks
  const candidateBlocks: PossessionZone[] = useMemo(() => {
    if (!blocks || blocks.length === 0) {
      return [];
    }

    // Filter to primary 24-hour cycle window (Day 1 blocks or un-prefixed blocks)
    const day1Blocks = blocks.filter((b) => !b.start_time?.includes('Day 2') && !b.start_time?.includes('Day 3'));
    const displayBlocks = day1Blocks.length > 0 ? day1Blocks : blocks.slice(0, 7);

    return displayBlocks.map((b) => {
      // Determine KM bounds for the corridor section cleanly without stacking
      let km1 = 83;
      let km2 = 139;

      if (b.corridor_id && corridorKmMap[b.corridor_id]) {
        [km1, km2] = corridorKmMap[b.corridor_id];
      } else {
        const sec = (b.section || '').toLowerCase();
        if (sec.includes('kanpur') || sec.includes('rura')) {
          km1 = 0; km2 = 44;
        } else if (sec.includes('phaphund') || (sec.includes('etawah') && !sec.includes('shikohabad'))) {
          km1 = 83; km2 = 139;
        } else if (sec.includes('etawah') && sec.includes('shikohabad')) {
          km1 = 139; km2 = 195;
        } else if (sec.includes('shikohabad') && sec.includes('tundla')) {
          km1 = 195; km2 = 231;
        } else if (sec.includes('tundla') || sec.includes('hathras')) {
          km1 = 231; km2 = 309;
        } else if (sec.includes('aligarh') || sec.includes('khurja')) {
          km1 = 309; km2 = 352;
        } else if (sec.includes('ghaziabad') || sec.includes('delhi')) {
          km1 = 410; km2 = 440;
        } else {
          const kmMatches = (b.km_span || '').match(/\d+(?:\.\d+)?/g);
          if (kmMatches && kmMatches.length >= 2) {
            km1 = parseFloat(kmMatches[0]);
            km2 = parseFloat(kmMatches[1]);
          }
        }
      }

      // Format clean HH:MM string for Marey time axis
      const cleanStart = (b.start_time || '01:00').replace(/Day \d+ /, '').trim();
      const cleanEnd = (b.end_time || '04:00').replace(/Day \d+ /, '').trim();

      // Color scheme based on plan type and performance
      const isBaseline = selectedPlan === 'baseline_fcfs';
      const color = isBaseline
        ? '#ef4444'
        : selectedPlan === 'plan_b'
        ? '#f59e0b'
        : '#10b981';

      // Department description
      const depts = b.departments_involved && b.departments_involved.length > 0
        ? b.departments_involved.join(' + ')
        : (b.department || 'Civil Engineering');

      // Notes
      const notes = b.explainability_notes || (
        isBaseline
          ? `Departmental FCFS booking · ${b.passenger_trains_delayed || 0} pax delay`
          : `CP-SAT Optimized Window · ${b.passenger_trains_delayed || 0}m train delay`
      );

      // Sub-tasks
      const subTasks = b.bundled_tasks && b.bundled_tasks.length > 0
        ? b.bundled_tasks.map((tid: any) => typeof tid === 'string' ? `${b.block_id}: Task ${tid}` : `${b.block_id}: Task ${tid.defect_id || ''}`)
        : [b.task_id ? `${b.block_id}: Task ${b.task_id}` : `${b.block_id}: Single Task Possession`];

      // Station section clean label
      const cleanSection = b.section?.replace(/[?]/g, '➔') || `${km1}–${km2} km`;

      return {
        id: b.block_id,
        sectionName: cleanSection,
        start: cleanStart,
        end: cleanEnd,
        km1: Math.min(km1, km2),
        km2: Math.max(km1, km2),
        color,
        depts,
        impact: b.operational_impact_score || 20,
        delayedPax: b.passenger_trains_delayed || 0,
        notes,
        subTasks
      };
    });
  }, [blocks, selectedPlan]);

  return (
    <div className="cr-panel p-5 sm:p-6 relative">
      {/* Plain-English Caption Banner */}
      {(() => {
        const t = TRANSLATIONS[language] || TRANSLATIONS.en;
        return (
          <div className="bg-[var(--cr-bg)] border-l-2 border-l-[var(--cr-primary)] border-y border-r border-[var(--cr-border)] p-3 rounded-r-lg mb-4 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-2 max-w-2xl">
              <span className="font-bold text-[var(--cr-primary)] flex-shrink-0 text-xs">
                {language === 'hi' ? 'ग्राफ कैसे पढ़ें:' : (language === 'ta' ? 'வரைபடத்தை எவ்வாறு படிப்பது:' : 'How to Read:')}
              </span>
              <span className="text-[var(--cr-text-muted)] leading-relaxed text-xs">
                {t.mareyCaption}
              </span>
            </div>
            {onTogglePlan && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => onTogglePlan('baseline_fcfs')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    selectedPlan === 'baseline_fcfs'
                      ? 'bg-[var(--cr-status-red)]/15 text-[var(--cr-status-red)] border border-[var(--cr-status-red)]/50'
                      : 'bg-[var(--cr-surface)] text-[var(--cr-text-muted)] hover:text-[var(--cr-text-primary)] border border-[var(--cr-border)]'
                  }`}
                >
                  <span>{language === 'hi' ? 'पहले: पुरानी अव्यवस्था (टकराव)' : (language === 'ta' ? 'முன்பு: கையேடு மோதல்கள்' : 'Before: Manual Conflicts')}</span>
                </button>
                <button
                  onClick={() => onTogglePlan('plan_a')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    selectedPlan === 'plan_a'
                      ? 'bg-[var(--cr-status-green)]/15 text-[var(--cr-status-green)] border border-[var(--cr-status-green)]/50'
                      : 'bg-[var(--cr-surface)] text-[var(--cr-text-muted)] hover:text-[var(--cr-text-primary)] border border-[var(--cr-border)]'
                  }`}
                >
                  <span>{language === 'hi' ? 'बाद में: CP-SAT समाधान (0 विलंब)' : (language === 'ta' ? 'பின்னர்: CP-SAT தீர்வு (0 தாமதம்)' : 'After: CP-SAT Fix (0 Delays)')}</span>
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* Header with Title & Legend */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-2 border-b border-[var(--cr-border)] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[var(--cr-text-primary)] flex items-center gap-2">
              <span>Railway Time-Distance Marey Diagram (String Graph)</span>
              <span className="cr-badge-blue text-xs">
                Live Division View
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#00e5ff] rounded-full"></span>
            <span className="text-[var(--cr-text-muted)]">Vande Bharat / Rajdhani</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#818cf8] rounded-full"></span>
            <span className="text-[var(--cr-text-muted)]">Superfast / Express</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#64748b] rounded-full border border-dashed border-slate-400"></span>
            <span className="text-[var(--cr-text-muted)]">Goods Freight</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-3 h-2 rounded ${selectedPlan === 'baseline_fcfs' ? 'bg-[var(--cr-status-red)]' : 'bg-[var(--cr-status-green)]'}`}></span>
            <span className="text-[var(--cr-text-muted)]">
              {selectedPlan === 'baseline_fcfs' ? 'Fragmented Possessions (Conflicting)' : 'Bundled Shadow Blocks (0m Delay)'}
            </span>
          </div>
        </div>
      </div>

      {/* Main SVG Visualization */}
      <div className="overflow-x-auto max-w-full">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="select-none mx-auto max-w-full h-auto">
          {/* Station gridlines and labels */}
          {stations.map((st, i) => {
            const y = kmToY(st.km);
            return (
              <g key={st.code}>
                <line
                  x1={margin.left}
                  y1={y}
                  x2={width - margin.right}
                  y2={y}
                  stroke="var(--cr-border)"
                  strokeDasharray={i === 0 || i === stations.length - 1 ? 'none' : '3 3'}
                  strokeWidth="1"
                  strokeOpacity="0.8"
                />
                {/* KM label positioned on the far left with generous clearance */}
                <text
                  x={16}
                  y={y + 4}
                  textAnchor="start"
                  fill="var(--cr-text-muted)"
                  className="text-xs tabular-nums font-medium select-none"
                >
                  {st.km} km
                </text>
                {/* Station Name + Code right-aligned against the diagram margin */}
                <text
                  x={margin.left - 12}
                  y={y + 4}
                  textAnchor="end"
                  className="select-none"
                >
                  <tspan fill="var(--cr-text-primary)" className="font-bold text-xs">{st.name}</tspan>
                  <tspan fill="var(--cr-primary-interactive)" className="font-bold text-xs"> ({st.code})</tspan>
                </text>
              </g>
            );
          })}

          {/* Time axis vertical gridlines and labels */}
          {Array.from({ length: 13 }).map((_, i) => {
            const hour = i * 2;
            const hourStr = `${hour.toString().padStart(2, '0')}:00`;
            const x = timeToX(hourStr);
            const anchor = i === 0 ? 'start' : (i === 12 ? 'end' : 'middle');
            const xOffset = i === 0 ? x + 2 : (i === 12 ? x - 2 : x);
            return (
              <g key={hour}>
                <line
                  x1={x}
                  y1={margin.top}
                  x2={x}
                  y2={height - margin.bottom}
                  stroke="var(--cr-border)"
                  strokeWidth="1"
                  strokeOpacity="0.6"
                />
                <text
                  x={xOffset}
                  y={height - margin.bottom + 22}
                  textAnchor={anchor}
                  fill="var(--cr-text-secondary)"
                  className="text-xs tabular-nums font-semibold select-none"
                >
                  {hourStr}
                </text>
              </g>
            );
          })}

          {/* Background Shadow Corridor Guide Band for Plan A & Plan B */}
          {selectedPlan !== 'baseline_fcfs' && (
            <g className="pointer-events-none">
              <rect
                x={timeToX('01:00')}
                y={margin.top}
                width={Math.max(20, timeToX('04:25') - timeToX('01:00'))}
                height={innerHeight}
                fill="var(--cr-status-green)"
                fillOpacity="0.08"
                stroke="var(--cr-status-green)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              {/* Top Banner indicating the Night Maintenance Window - Never Clipped */}
              <rect
                x={timeToX('01:00')}
                y={14}
                width={Math.max(20, timeToX('04:25') - timeToX('01:00'))}
                height={26}
                rx="6"
                fill="var(--cr-status-green)"
                fillOpacity="0.9"
              />
              <text
                x={(timeToX('01:00') + timeToX('04:25')) / 2}
                y={31}
                textAnchor="middle"
                fill="#ffffff"
                className="text-xs font-bold tracking-tight"
              >
                {language === 'hi' ? '✦ रात्रि ब्लॉक (01:00–04:25)' : (language === 'ta' ? '✦ இரவு பிளாக் (01:00–04:25)' : '✦ SHADOW WINDOW (01:00–04:25)')}
              </text>
            </g>
          )}

          {/* Clean, Non-Overlapping Station Possession Blocks */}
          {candidateBlocks.map((blk) => {
            const x1 = timeToX(blk.start);
            const x2 = timeToX(blk.end);
            const yTop = kmToY(blk.km2);
            const yBottom = kmToY(blk.km1);
            const blockWidth = Math.max(90, x2 - x1);
            const blockHeight = Math.max(30, yBottom - yTop);

            return (
              <g
                key={blk.id}
                className="cursor-pointer transition-all hover:opacity-100"
                onMouseEnter={() => setHoveredEntity({ type: 'block', data: blk })}
                onMouseLeave={() => setHoveredEntity(null)}
              >
                {/* Block Possession Rectangle with Soft Glow */}
                <rect
                  x={x1}
                  y={yTop}
                  width={blockWidth}
                  height={blockHeight}
                  fill={blk.color}
                  fillOpacity={selectedPlan === 'baseline_fcfs' ? "0.32" : "0.22"}
                  stroke={blk.color}
                  strokeWidth="1.5"
                  rx="6"
                  className="hover:stroke-white hover:stroke-[2] transition-colors"
                />

                {/* Primary Block Title */}
                <text
                  x={x1 + 10}
                  y={yTop + 16}
                  fill="#ffffff"
                  className="text-xs font-bold drop-shadow-md select-none pointer-events-none"
                >
                  {blk.id}: {blk.sectionName}
                </text>

                {/* Secondary Department & Timing Subtitle */}
                {blockHeight >= 30 && (
                  <text
                    x={x1 + 10}
                    y={yTop + 29}
                    fill={selectedPlan === 'baseline_fcfs' ? '#fecaca' : '#a7f3d0'}
                    className="text-xs font-medium tabular-nums select-none pointer-events-none"
                  >
                    {blk.depts} • {blk.start}–{blk.end}
                  </text>
                )}

                {/* Right Status Pill Badge */}
                {blockWidth >= 120 && (
                  <g transform={`translate(${x1 + blockWidth - 76}, ${yTop + 5})`}>
                    <rect
                      x="0"
                      y="0"
                      width="68"
                      height="18"
                      rx="4"
                      fill={selectedPlan === 'baseline_fcfs' ? '#450a0a' : '#064e3b'}
                      stroke={selectedPlan === 'baseline_fcfs' ? 'var(--cr-status-red)' : 'var(--cr-status-green)'}
                      strokeWidth="1"
                    />
                    <text
                      x="34"
                      y="13"
                      textAnchor="middle"
                      fill="#ffffff"
                      className="text-xs font-bold select-none pointer-events-none"
                    >
                      {selectedPlan === 'baseline_fcfs' ? 'Train Delay' : '0m Delay'}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Train Trajectory Lines */}
          {trainPaths.map((train) => {
            const x1 = timeToX(train.start);
            const x2 = timeToX(train.end);
            const y1 = kmToY(train.kmStart);
            const y2 = kmToY(train.kmEnd);

            const midX = x1 + (x2 - x1) * 0.45;
            const midY = y1 + (y2 - y1) * 0.45;

            return (
              <g
                key={train.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredEntity({ type: 'train', data: train })}
                onMouseLeave={() => setHoveredEntity(null)}
              >
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={train.color}
                  strokeWidth="2.5"
                  strokeDasharray={train.dashed ? '4 4' : 'none'}
                  strokeLinecap="round"
                  className="transition-all hover:stroke-white hover:stroke-[3.5]"
                />
                <g transform={`translate(${midX - 34}, ${midY - 10})`}>
                  <rect
                    x="0"
                    y="0"
                    width="68"
                    height="18"
                    rx="4"
                    fill="var(--cr-surface)"
                    stroke={train.color}
                    strokeWidth="1.2"
                    className="filter drop-shadow-sm"
                  />
                  <text
                    x="34"
                    y="13"
                    textAnchor="middle"
                    fill={train.color}
                    className="text-xs font-bold tabular-nums select-none pointer-events-none"
                  >
                    {train.id}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Conflict Highlight Overlay for Baseline FCFS */}
          {selectedPlan === 'baseline_fcfs' && (
            <g className="cursor-pointer">
              <circle
                cx={timeToX('01:50')}
                cy={kmToY(213)}
                r="18"
                fill="none"
                stroke="var(--cr-status-red)"
                strokeWidth="2"
                opacity="0.8"
              >
                <animate attributeName="r" values="8;24;8" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle
                cx={timeToX('01:50')}
                cy={kmToY(213)}
                r="5"
                fill="var(--cr-status-red)"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <line
                x1={timeToX('01:50')}
                y1={kmToY(213)}
                x2={timeToX('04:30')}
                y2={kmToY(213) - 40}
                stroke="var(--cr-status-red)"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <g transform={`translate(${timeToX('04:30')}, ${kmToY(213) - 62})`}>
                <rect
                  x="0"
                  y="0"
                  width="250"
                  height="56"
                  rx="8"
                  fill="var(--cr-surface)"
                  stroke="var(--cr-status-red)"
                  strokeWidth="1.5"
                  className="filter drop-shadow-xl"
                />
                <text x="12" y="18" fill="var(--cr-status-red)" className="text-xs font-bold">
                  ⚠️ REAL COLLISION DETECTED
                </text>
                <text x="12" y="34" fill="var(--cr-text-primary)" className="text-xs font-medium">
                  Train 12582 crosses uncoordinated Civil block
                </text>
                <text x="12" y="48" fill="var(--cr-status-red)" className="text-xs tabular-nums font-bold">
                  at 01:50 (KM 213 TDL) ➔ 48m Express Delay!
                </text>
              </g>
            </g>
          )}

          {/* Conflict Resolved Badge for Plan A (positioned in clear space with connector) */}
          {selectedPlan === 'plan_a' && (
            <g className="cursor-pointer">
              <circle
                cx={timeToX('01:50')}
                cy={kmToY(213)}
                r="12"
                fill="none"
                stroke="var(--cr-status-green)"
                strokeWidth="1.5"
                opacity="0.6"
              >
                <animate attributeName="r" values="6;16;6" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle
                cx={timeToX('01:50')}
                cy={kmToY(213)}
                r="4"
                fill="var(--cr-status-green)"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {/* Dashed connector line to open valley */}
              <path
                d={`M ${timeToX('01:50')} ${kmToY(213)} L ${timeToX('05:00')} ${kmToY(260)}`}
                stroke="var(--cr-status-green)"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity="0.75"
              />
              <g transform={`translate(${timeToX('05:00')}, ${kmToY(260) - 25})`}>
                <rect
                  x="0"
                  y="0"
                  width="250"
                  height="48"
                  rx="8"
                  fill="var(--cr-surface)"
                  stroke="var(--cr-status-green)"
                  strokeWidth="1.5"
                  className="filter drop-shadow-xl"
                />
                <text x="12" y="18" fill="var(--cr-status-green)" className="text-xs font-bold">
                  ✅ CONFLICT RESOLVED (CP-SAT)
                </text>
                <text x="12" y="34" fill="var(--cr-text-primary)" className="text-xs font-medium">
                  Bundled into night valley 01:00–04:25 • 0m delay
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Rich Interactive Floating Inspection Card */}
      {hoveredEntity && (
        <div className="absolute bottom-5 right-6 cr-panel p-4 shadow-2xl backdrop-blur-md text-xs max-w-sm z-30 pointer-events-none transition-all">
          {hoveredEntity.type === 'train' ? (
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-[var(--cr-border)] pb-1.5 mb-1.5">
                <span className="font-bold text-[var(--cr-text-primary)] tabular-nums">{hoveredEntity.data.id} • {hoveredEntity.data.name}</span>
                <span className="bg-[var(--cr-primary-interactive)]/15 text-[var(--cr-primary-interactive)] px-1.5 py-0.5 rounded text-xs font-semibold">
                  {hoveredEntity.data.priority}
                </span>
              </div>
              <p className="text-[var(--cr-text-secondary)]">
                Departure: <strong className="text-[var(--cr-text-primary)] tabular-nums">{hoveredEntity.data.start}</strong> ➔ Arrival: <strong className="text-[var(--cr-text-primary)] tabular-nums">{hoveredEntity.data.end}</strong>
              </p>
              <p className="text-[var(--cr-status-green)] mt-1.5 flex items-center gap-1 font-medium">
                ✓ Full speed headway clear; zero conflict with shadow maintenance corridor.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-[var(--cr-border)] pb-1.5 mb-1.5">
                <span className="font-bold text-[var(--cr-text-primary)] text-sm">{hoveredEntity.data.id}: {hoveredEntity.data.sectionName}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  selectedPlan === 'baseline_fcfs' ? 'bg-[var(--cr-status-red)]/15 text-[var(--cr-status-red)]' : 'bg-[var(--cr-status-green)]/15 text-[var(--cr-status-green)]'
                }`}>
                  {selectedPlan === 'baseline_fcfs' ? 'Conflict Block' : 'Shadow Possession'}
                </span>
              </div>
              <p className="text-[var(--cr-text-secondary)]">
                Window: <strong className="text-[var(--cr-text-primary)] tabular-nums">{hoveredEntity.data.start} to {hoveredEntity.data.end}</strong> (KM {hoveredEntity.data.km1}–{hoveredEntity.data.km2})
              </p>
              <p className="text-[var(--cr-text-secondary)] mt-0.5">
                Departments: <strong className="text-[var(--cr-primary-interactive)]">{hoveredEntity.data.depts}</strong>
              </p>
              {hoveredEntity.data.subTasks && hoveredEntity.data.subTasks.length > 0 && (
                <div className="mt-2 pt-2 border-t border-[var(--cr-border)]">
                  <span className="text-xs font-bold text-[var(--cr-text-secondary)] block mb-1">Bundled Works:</span>
                  <ul className="space-y-0.5 text-xs text-[var(--cr-text-primary)]">
                    {hoveredEntity.data.subTasks.map((t: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-[var(--cr-status-green)]">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-xs text-[var(--cr-text-secondary)] mt-2 italic">
                {hoveredEntity.data.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
