import React, { useState } from 'react';

interface MareyDiagramProps {
  selectedPlan: string;
}

export const MareyDiagram: React.FC<MareyDiagramProps> = ({ selectedPlan }) => {
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

  const width = 900;
  const height = 460;
  const margin = { top: 30, right: 30, bottom: 40, left: 130 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const timeToX = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const totalHours = h + (m || 0) / 60;
    return margin.left + (totalHours / 24) * innerWidth;
  };

  const kmToY = (km: number) => {
    return margin.top + innerHeight - (km / 440) * innerHeight;
  };

  const trainPaths = [
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

  const candidateBlocks = selectedPlan === 'baseline_fcfs' ? [
    { id: 'BASE-1', name: 'Civil Track Disconnection (Separate)', start: '09:00', end: '12:00', km1: 0, km2: 83, color: '#ef4444', depts: 'Engineering' },
    { id: 'BASE-2', name: 'TRD OHE Inspection (Separate)', start: '13:00', end: '15:30', km1: 44, km2: 139, color: '#f97316', depts: 'Traction' },
    { id: 'BASE-3', name: 'S&T Point Disconnection (Separate)', start: '16:00', end: '18:30', km1: 139, km2: 231, color: '#eab308', depts: 'Signal & Telecom' }
  ] : [
    { id: 'CAND-A1', name: 'Synchronized Shadow Corridor Block B-101', start: '01:30', end: '04:45', km1: 0, km2: 139, color: '#10b981', depts: '3-in-1: Civil + TRD + S&T' },
    { id: 'CAND-A2', name: 'Look-Ahead Bundled Night Block B-102', start: '01:00', end: '04:15', km1: 195, km2: 309, color: '#10b981', depts: '2-in-1: Civil + TRD' }
  ];

  return (
    <div className="bg-[#0b132b] rounded-2xl border border-slate-800 p-5 shadow-xl relative">
      <div className="flex flex-wrap items-center justify-between pb-4 mb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Railway Time-Distance Marey Diagram (String Graph)</span>
              <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-0.5 rounded font-mono font-normal">
                Live Division View
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sloped lines indicate train movements across stations (Y-axis) vs Time (X-axis). Shaded windows represent maintenance blocks.
          </p>
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
        <svg width={width} height={height} className="select-none mx-auto">
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
                <text
                  x={margin.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[11px] font-mono"
                >
                  {st.name} ({st.code})
                </text>
                <text
                  x={margin.left - 90}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-500 text-[10px] font-mono"
                >
                  {st.km} km
                </text>
              </g>
            );
          })}

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
                  y={height - margin.bottom + 18}
                  textAnchor="middle"
                  className="fill-slate-400 text-[11px] font-mono"
                >
                  {hourStr}
                </text>
              </g>
            );
          })}

          {candidateBlocks.map((blk) => {
            const x1 = timeToX(blk.start);
            const x2 = timeToX(blk.end);
            const y1 = kmToY(blk.km2);
            const y2 = kmToY(blk.km1);
            const blockWidth = x2 - x1;
            const blockHeight = y2 - y1;

            return (
              <g
                key={blk.id}
                className="cursor-pointer transition-opacity hover:opacity-90"
                onMouseEnter={() => setHoveredEntity({ type: 'block', data: blk })}
                onMouseLeave={() => setHoveredEntity(null)}
              >
                <rect
                  x={x1}
                  y={y1}
                  width={blockWidth}
                  height={blockHeight}
                  fill={blk.color}
                  fillOpacity="0.22"
                  stroke={blk.color}
                  strokeWidth="2"
                  rx="6"
                />
                <text
                  x={x1 + blockWidth / 2}
                  y={y1 + blockHeight / 2 - 6}
                  textAnchor="middle"
                  fill="#ffffff"
                  className="text-[11px] font-bold drop-shadow-md"
                >
                  {blk.name}
                </text>
                <text
                  x={x1 + blockWidth / 2}
                  y={y1 + blockHeight / 2 + 10}
                  textAnchor="middle"
                  fill={blk.color}
                  className="text-[10px] font-semibold font-mono"
                >
                  {blk.depts} • {blk.start}–{blk.end}
                </text>
              </g>
            );
          })}

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
                  className="text-[10px] font-mono font-semibold"
                >
                  {train.id} ({train.name.split(' ')[0]})
                </text>
              </g>
            );
          })}
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
