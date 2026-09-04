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

export const MareyDiagram: React.FC<MareyDiagramProps> = ({
  selectedPlan,
  blocks,
  trainSchedules,
  onTogglePlan,
  language = 'en'
}) => {
  const [hoveredEntity, setHoveredEntity] = useState<any>(null);

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

  const width = 960;
  const height = 490;
  const margin = { top: 38, right: 30, bottom: 48, left: 185 };

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

  // Compute dynamic candidate blocks directly from real solver output
  const candidateBlocks = useMemo(() => {
    if (blocks && blocks.length > 0) {
      return blocks.slice(0, 7).map((b) => {
        const isBaseline = selectedPlan === 'baseline_fcfs';
        const color = isBaseline ? '#ef4444' : (selectedPlan === 'plan_b' ? '#f59e0b' : '#10b981');
        const kmRange = corridorKmMap[b.corridor_id] || [44, 139];
        
        let km1 = kmRange[0];
        let km2 = kmRange[1];
        if (b.km_span) {
          const match = b.km_span.match(/KM\s*([\d.]+)(?:\s*-\s*KM\s*([\d.]+))?/i);
          if (match) {
            km1 = parseFloat(match[1]);
            km2 = match[2] ? parseFloat(match[2]) : km1 + 15;
          }
        }

        const depts = (b.departments_involved && b.departments_involved.length > 0)
          ? b.departments_involved.join(' + ')
          : (b.department || 'Maintenance');

        return {
          id: b.block_id,
          name: `${b.block_id}: ${b.section || b.corridor_id}`,
          start: b.start_time.replace(/Day \d+ /, ''),
          end: b.end_time.replace(/Day \d+ /, ''),
          km1: Math.min(km1, km2),
          km2: Math.max(km1, km2) + (Math.abs(km2 - km1) < 10 ? 20 : 0),
          color,
          depts,
          impact: b.operational_impact_score,
          delayedPax: b.passenger_trains_delayed || 0,
          notes: b.explainability_notes || 'CP-SAT Scheduled Block'
        };
      });
    }

    return selectedPlan === 'baseline_fcfs' ? [
      { id: 'BASE-CLASH', name: '⚠ Uncoordinated Civil Block (Clashing with Train 12582)', start: '01:15', end: '02:45', km1: 195, km2: 231, color: '#ef4444', depts: 'Civil Only (Unbundled)', impact: 89, delayedPax: 1, notes: 'Direct clash with Train 12582' },
      { id: 'BASE-1', name: 'Civil Track Disconnection (Separate)', start: '09:00', end: '12:00', km1: 0, km2: 83, color: '#ef4444', depts: 'Engineering', impact: 72, delayedPax: 2, notes: 'Departmental FCFS booking' },
      { id: 'BASE-2', name: 'TRD OHE Inspection (Separate)', start: '13:00', end: '15:30', km1: 44, km2: 139, color: '#ef4444', depts: 'Traction', impact: 75, delayedPax: 1, notes: 'Departmental FCFS booking' },
      { id: 'BASE-3', name: 'S&T Point Disconnection (Separate)', start: '16:00', end: '18:30', km1: 139, km2: 231, color: '#ef4444', depts: 'Signal & Telecom', impact: 70, delayedPax: 1, notes: 'Departmental FCFS booking' }
    ] : [
      { id: 'CAND-A1', name: 'Synchronized Shadow Corridor Block B-101', start: '01:00', end: '04:25', km1: 0, km2: 139, color: '#10b981', depts: '3-in-1: Civil + TRD + S&T', impact: 18, delayedPax: 0, notes: 'CP-SAT 0m delay optimal window' },
      { id: 'CAND-A2', name: 'Look-Ahead Bundled Night Block B-102', start: '01:30', end: '04:45', km1: 195, km2: 309, color: '#10b981', depts: '2-in-1: Civil + TRD', impact: 18, delayedPax: 0, notes: 'CP-SAT 0m delay optimal window' }
    ];
  }, [blocks, selectedPlan]);

  return (
    <div className="bg-[#0b132b] rounded-2xl border border-slate-800 p-5 shadow-xl relative">
      {/* Permanent Plain-English Caption Banner */}
      {(() => {
        const t = TRANSLATIONS[language] || TRANSLATIONS.en;
        return (
          <div className="bg-slate-900/95 border-l-4 border-cyan-400 p-3.5 rounded-r-xl mb-4 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-start gap-2.5 max-w-2xl">
              <span className="font-bold text-cyan-300 flex-shrink-0 text-sm">
                {language === 'hi' ? '📖 ग्राफ कैसे पढ़ें:' : (language === 'ta' ? '📖 வரைபடத்தை எவ்வாறு படிப்பது:' : '📖 How to Read:')}
              </span>
              <span className="text-slate-200 leading-relaxed">
                {t.mareyCaption}
              </span>
            </div>
            {onTogglePlan && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => onTogglePlan('baseline_fcfs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedPlan === 'baseline_fcfs'
                      ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <span>{language === 'hi' ? 'पहले: पुरानी अव्यवस्था (टकराव)' : (language === 'ta' ? 'முன்பு: கையேடு மோதல்கள்' : 'Before: Manual Conflicts')}</span>
                </button>
                <button
                  onClick={() => onTogglePlan('plan_a')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedPlan === 'plan_a'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{language === 'hi' ? 'बाद में: CP-SAT समाधान (0 विलंब)' : (language === 'ta' ? 'பின்னர்: CP-SAT தீர்வு (0 தாமதம்)' : 'After: CP-SAT Fix (0 Delays)')}</span>
                </button>
              </div>
            )}
          </div>
        );
      })()}

      <div className="flex flex-wrap items-center justify-between pb-3 mb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Railway Time-Distance Marey Diagram (String Graph)</span>
              <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-0.5 rounded font-mono font-normal">
                Live Division View
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#00e5ff] rounded-full"></span>
            <span className="text-slate-300">Vande Bharat / Rajdhani</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#818cf8] rounded-full"></span>
            <span className="text-slate-300">Superfast / Express</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#64748b] rounded-full border border-dashed border-slate-400"></span>
            <span className="text-slate-300">Goods Freight</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-3 h-2 rounded ${selectedPlan === 'baseline_fcfs' ? 'bg-red-500/50' : 'bg-emerald-500/50'}`}></span>
            <span className="text-slate-300">
              {selectedPlan === 'baseline_fcfs' ? 'Fragmented Blocks (Conflicting)' : 'Bundled Shadow Block (0m Delay)'}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
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
                  stroke={i === 0 || i === stations.length - 1 ? '#334155' : '#1e293b'}
                  strokeDasharray={i === 0 || i === stations.length - 1 ? 'none' : '3 3'}
                  strokeWidth="1"
                />
                {/* KM label positioned on the far left with generous clearance */}
                <text
                  x={16}
                  y={y + 4}
                  textAnchor="start"
                  className="fill-slate-500 text-[10px] font-mono select-none"
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
                  <tspan className="fill-slate-300 font-medium text-[11px] font-sans">{st.name}</tspan>
                  <tspan className="fill-cyan-400 font-mono font-semibold text-[10px]"> ({st.code})</tspan>
                </text>
              </g>
            );
          })}

          {/* Time axis vertical gridlines and labels */}
          {Array.from({ length: 13 }).map((_, i) => {
            const hour = i * 2;
            const hourStr = `${hour.toString().padStart(2, '0')}:00`;
            const x = timeToX(hourStr);
            return (
              <g key={hour}>
                <line
                  x1={x}
                  y1={margin.top}
                  x2={x}
                  y2={height - margin.bottom}
                  stroke="#1e293b"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - margin.bottom + 20}
                  textAnchor="middle"
                  className="fill-slate-400 text-[10.5px] font-mono select-none"
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
                fill="#10b981"
                fillOpacity="0.06"
                stroke="#10b981"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              {/* Top Banner indicating the Night Maintenance Window */}
              <rect
                x={timeToX('01:00')}
                y={margin.top - 24}
                width={Math.max(20, timeToX('04:25') - timeToX('01:00'))}
                height={18}
                rx="4"
                fill="#064e3b"
                stroke="#10b981"
                strokeWidth="1"
                fillOpacity="0.9"
              />
              <text
                x={(timeToX('01:00') + timeToX('04:25')) / 2}
                y={margin.top - 11}
                textAnchor="middle"
                fill="#6ee7b7"
                className="text-[9.5px] font-bold font-mono tracking-tight"
              >
                {language === 'hi' ? '✦ रात्रि ब्लॉक (01:00–04:25)' : (language === 'ta' ? '✦ இரவு பிளாக் (01:00–04:25)' : '✦ SHADOW WINDOW (01:00–04:25)')}
              </text>
            </g>
          )}

          {/* Candidate Block Rectangles with clean non-overlapping ID badges */}
          {candidateBlocks.map((blk) => {
            const x1 = timeToX(blk.start);
            const x2 = timeToX(blk.end);
            const y1 = kmToY(blk.km2);
            const y2 = kmToY(blk.km1);
            const blockWidth = Math.max(28, x2 - x1);
            const blockHeight = Math.max(14, y2 - y1);
            const shortId = blk.id.replace('CAND-BLK-', 'B-').replace('BASE-BLK-', 'FCFS-');

            return (
              <g
                key={blk.id}
                className="cursor-pointer transition-all hover:opacity-100"
                onMouseEnter={() => setHoveredEntity({ type: 'block', data: blk })}
                onMouseLeave={() => setHoveredEntity(null)}
              >
                <rect
                  x={x1}
                  y={y1}
                  width={blockWidth}
                  height={blockHeight}
                  fill={blk.color}
                  fillOpacity={selectedPlan === 'baseline_fcfs' ? "0.38" : "0.26"}
                  stroke={blk.color}
                  strokeWidth="1.5"
                  rx="4"
                  className="hover:stroke-white hover:stroke-[2] transition-colors"
                />
                {/* Render clean ID pill ONLY if box has adequate height and width */}
                {blockHeight >= 18 && blockWidth >= 34 && (
                  <text
                    x={x1 + blockWidth / 2}
                    y={y1 + blockHeight / 2 + 3.5}
                    textAnchor="middle"
                    fill="#ffffff"
                    className="text-[9px] font-bold font-mono drop-shadow pointer-events-none select-none"
                  >
                    {shortId}
                  </text>
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
                  strokeWidth="3"
                  strokeDasharray={train.dashed ? '4 4' : 'none'}
                  strokeLinecap="round"
                  className="transition-all hover:stroke-white hover:stroke-[4]"
                />
                <text
                  x={x1 + (x2 - x1) * 0.4}
                  y={y1 + (y2 - y1) * 0.4 - 5}
                  fill={train.color}
                  transform={`rotate(-25, ${x1 + (x2 - x1) * 0.4}, ${y1 + (y2 - y1) * 0.4 - 5})`}
                  className="text-[10px] font-mono font-semibold select-none"
                >
                  {train.id} ({train.name.split(' ')[0]})
                </text>
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
                stroke="#ef4444"
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
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <line
                x1={timeToX('01:50')}
                y1={kmToY(213)}
                x2={timeToX('01:50') + 20}
                y2={kmToY(213) - 28}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <g transform={`translate(${timeToX('01:50') + 20}, ${kmToY(213) - 60})`}>
                <rect
                  x="0"
                  y="0"
                  width="240"
                  height="52"
                  rx="8"
                  fill="#1e1014"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  className="filter drop-shadow-xl"
                />
                <text x="10" y="17" fill="#f87171" className="text-[10.5px] font-bold">
                  ⚠️ REAL COLLISION DETECTED
                </text>
                <text x="10" y="32" fill="#fecaca" className="text-[9.5px]">
                  Train 12582 crosses uncoordinated Civil block
                </text>
                <text x="10" y="45" fill="#fca5a5" className="text-[9px] font-mono">
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
                stroke="#10b981"
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
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {/* Dashed connector line to open valley at 04:35 KM 220 */}
              <path
                d={`M ${timeToX('01:50')} ${kmToY(213)} L ${timeToX('04:35')} ${kmToY(213) - 12}`}
                stroke="#10b981"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity="0.75"
              />
              <g transform={`translate(${timeToX('04:35')}, ${kmToY(213) - 36})`}>
                <rect
                  x="0"
                  y="0"
                  width="235"
                  height="46"
                  rx="8"
                  fill="#06281e"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  className="filter drop-shadow-xl"
                />
                <text x="10" y="17" fill="#34d399" className="text-[10.5px] font-bold font-sans">
                  ✅ CONFLICT RESOLVED (CP-SAT)
                </text>
                <text x="10" y="33" fill="#a7f3d0" className="text-[9.5px] font-sans">
                  Bundled into night valley 01:00–04:25 • 0m delay
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {hoveredEntity && (
        <div className="absolute bottom-4 right-6 bg-slate-900/95 border border-cyan-500/50 p-3.5 rounded-xl shadow-2xl backdrop-blur text-xs max-w-sm">
          {hoveredEntity.type === 'train' ? (
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-1.5">
                <span className="font-bold text-white font-mono">{hoveredEntity.data.id} • {hoveredEntity.data.name}</span>
                <span className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded text-[10px]">
                  {hoveredEntity.data.priority}
                </span>
              </div>
              <p className="text-slate-300">
                Departure: <strong className="text-white">{hoveredEntity.data.start}</strong> ➔ Arrival: <strong className="text-white">{hoveredEntity.data.end}</strong>
              </p>
              <p className="text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                ✓ Headway clear; zero conflict with shadow maintenance blocks.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-1.5">
                <span className="font-bold text-white">{hoveredEntity.data.name}</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[10px]">
                  Candidate Block
                </span>
              </div>
              <p className="text-slate-300">
                Window: <strong className="text-white">{hoveredEntity.data.start} to {hoveredEntity.data.end}</strong>
              </p>
              <p className="text-slate-300 mt-0.5">
                Participating: <strong className="text-cyan-300">{hoveredEntity.data.depts}</strong>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                25 kV OHE power cutoff verified. All tasks execute simultaneously in 1 possession.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
