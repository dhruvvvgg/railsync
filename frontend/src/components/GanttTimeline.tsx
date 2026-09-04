import React from 'react';
import { Layers, ShieldCheck, Zap, Radio, Hammer } from 'lucide-react';

interface GanttTimelineProps {
  selectedPlan: string;
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({ selectedPlan: _selectedPlan }) => {
  const lanes = [
    {
      id: 'civil',
      name: 'Civil Engineering (Track/TMS)',
      icon: Hammer,
      color: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300',
      badgeColor: 'bg-cyan-500/20 text-cyan-300',
      tasks: [
        { id: 'T-101', name: 'Continuous Action Track Tamping (CSM-09)', start: '01:30', end: '04:30', widthPct: 15, leftPct: 6.25 },
        { id: 'T-102', name: 'USFD Ultrasonic Flaw Rectification (Km 142)', start: '02:00', end: '03:45', widthPct: 8.75, leftPct: 8.3 }
      ]
    },
    {
      id: 'trd',
      name: 'Traction TRD (OHE/TDMS)',
      icon: Zap,
      color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      tasks: [
        { id: 'TRD-201', name: '25 kV OHE Cantilever Inspection & Height Adjustment', start: '01:45', end: '04:15', widthPct: 12.5, leftPct: 7.3 },
        { id: 'TRD-202', name: 'Neutral Section Assembly Overhaul', start: '02:15', end: '03:45', widthPct: 7.5, leftPct: 9.375 }
      ]
    },
    {
      id: 'snt',
      name: 'Signal & Telecom (SMMS)',
      icon: Radio,
      color: 'border-purple-500/40 bg-purple-950/30 text-purple-300',
      badgeColor: 'bg-purple-500/20 text-purple-300',
      tasks: [
        { id: 'SIG-301', name: 'Point Machine 143mm Calibration & Testing', start: '02:00', end: '04:00', widthPct: 10, leftPct: 8.3 },
        { id: 'SIG-302', name: 'Digital Axle Counter (MSDAC) Sensor Verification', start: '02:30', end: '03:30', widthPct: 5, leftPct: 10.4 }
      ]
    }
  ];

  return (
    <div className="bg-[#0b132b] rounded-2xl border border-slate-800 p-5 shadow-xl mt-6">
      <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">Cross-Department Synchronized Gantt Schedule</h2>
          <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded font-mono font-medium">
            Synchronized Under Single 25 kV Power Shutoff
          </span>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Formula: Setup + Work + Testing + Site Clearance + Safety Buffer</span>
        </div>
      </div>

      <div className="relative mb-2 border-b border-slate-800 pb-2">
        <div className="grid grid-cols-12 text-center text-[10px] text-slate-400 font-mono">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-slate-800/40 py-1">
              {i.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {lanes.map((lane) => {
          const Icon = lane.icon;
          return (
            <div key={lane.id} className="flex items-center gap-4 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <div className="w-56 flex-shrink-0 flex items-center gap-2">
                <div className={`p-1.5 rounded-lg border ${lane.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block truncate">{lane.name}</span>
                  <span className="text-[10px] text-slate-400">{lane.tasks.length} tasks scheduled</span>
                </div>
              </div>

              <div className="flex-1 h-12 bg-slate-950/80 rounded-lg relative overflow-hidden border border-slate-800/60">
                <div
                  className="absolute top-0 bottom-0 bg-cyan-500/5 border-x border-cyan-500/20"
                  style={{ left: '4.16%', width: '16.66%' }}
                >
                  <span className="text-[9px] text-cyan-400 font-mono absolute top-1 left-1.5 opacity-60">
                    Candidate Block Window
                  </span>
                </div>

                {lane.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`absolute top-1.5 bottom-1.5 rounded-md px-2 flex flex-col justify-center border shadow-md transition-transform hover:scale-[1.02] cursor-pointer ${lane.color}`}
                    style={{
                      left: `${task.leftPct * 2}%`,
                      width: `${task.widthPct * 2}%`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white truncate max-w-[150px]">
                        {task.name}
                      </span>
                      <span className={`text-[8px] font-mono px-1 rounded ${lane.badgeColor}`}>
                        {task.start}–{task.end}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>
            <strong>Result:</strong> 3 departments executing work in 1 combined possession. Avoids 2 separate daytime disconnections.
          </span>
        </div>
        <span className="font-mono text-cyan-400 font-semibold">
          Total Effective Work Done: 8.75 Task Hours in 3.25 Block Hours (269% Productivity)
        </span>
      </div>
    </div>
  );
};
