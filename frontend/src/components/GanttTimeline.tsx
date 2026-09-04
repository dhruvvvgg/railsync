import React, { useMemo } from 'react';
import { Layers, ShieldCheck, Zap, Radio, Hammer, ArrowRight } from 'lucide-react';
import type { CandidateBlock } from '../types';
import type { Language } from '../i18n/translations';
import { TRANSLATIONS } from '../i18n/translations';

interface GanttTimelineProps {
  selectedPlan: string;
  blocks?: CandidateBlock[];
  language?: Language;
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({ selectedPlan, blocks, language = 'en' }) => {
  const isBaseline = selectedPlan === 'baseline_fcfs';
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const lanes = useMemo(() => {
    // If real solver blocks are passed, extract dynamic department tasks
    if (blocks && blocks.length > 0) {
      const activeBlocks = blocks.slice(0, 6);

      const parseTimeMins = (timeStr: string) => {
        const clean = timeStr.replace(/Day \d+ /, '');
        const [h, m] = clean.split(':').map(Number);
        return ((h || 0) * 60 + (m || 0)) % 1440;
      };

      const civilTasks: any[] = [];
      const trdTasks: any[] = [];
      const sntTasks: any[] = [];

      activeBlocks.forEach((b) => {
        const stMins = b.start_minutes !== undefined ? (b.start_minutes % 1440) : parseTimeMins(b.start_time);
        const endMins = b.end_minutes !== undefined ? (b.end_minutes % 1440) : parseTimeMins(b.end_time);
        const durMins = Math.max(45, (endMins > stMins ? endMins - stMins : (1440 - stMins + endMins)));

        const leftPct = (stMins / 1440) * 100;
        const widthPct = Math.max(5, (durMins / 1440) * 100);

        const stStr = b.start_time.replace(/Day \d+ /, '');
        const endStr = b.end_time.replace(/Day \d+ /, '');

        const depts = b.departments_involved || (b.department ? [b.department] : ['Engineering']);

        if (depts.includes('Engineering') || depts.some(d => d.toLowerCase().includes('civil') || d.toLowerCase().includes('track'))) {
          civilTasks.push({
            id: `CIV-${b.block_id}`,
            name: `${b.block_id}: Continuous Track Tamping & Deep Screening (${b.corridor_id})`,
            start: stStr,
            end: endStr,
            leftPct,
            widthPct
          });
        }

        if (depts.includes('Traction Distribution') || depts.some(d => d.toLowerCase().includes('traction') || d.toLowerCase().includes('trd'))) {
          trdTasks.push({
            id: `TRD-${b.block_id}`,
            name: `${b.block_id}: 25 kV Cantilever & Isolator Overhaul (${b.corridor_id})`,
            start: stStr,
            end: endStr,
            leftPct,
            widthPct
          });
        }

        if (depts.includes('Signal & Telecommunication') || depts.some(d => d.toLowerCase().includes('signal') || d.toLowerCase().includes('s&t') || d.toLowerCase().includes('telecom'))) {
          sntTasks.push({
            id: `SNT-${b.block_id}`,
            name: `${b.block_id}: MSDAC Axle Counter & Point Machine Inspection (${b.corridor_id})`,
            start: stStr,
            end: endStr,
            leftPct,
            widthPct
          });
        }
      });

      return [
        {
          id: 'civil',
          name: t.laneCivil,
          icon: Hammer,
          color: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300',
          badgeColor: 'bg-cyan-500/20 text-cyan-300',
          tasks: civilTasks.length > 0 ? civilTasks : [
            { id: 'T-101', name: 'Track Maintenance Window (Standby)', start: '01:00', end: '04:25', leftPct: 4.16, widthPct: 14.2 }
          ]
        },
        {
          id: 'trd',
          name: t.laneTrd,
          icon: Zap,
          color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300',
          badgeColor: 'bg-emerald-500/20 text-emerald-300',
          tasks: trdTasks.length > 0 ? trdTasks : [
            { id: 'TRD-201', name: '25 kV OHE Isolation Window (Standby)', start: '01:00', end: '04:25', leftPct: 4.16, widthPct: 14.2 }
          ]
        },
        {
          id: 'snt',
          name: t.laneSnt,
          icon: Radio,
          color: 'border-purple-500/40 bg-purple-950/30 text-purple-300',
          badgeColor: 'bg-purple-500/20 text-purple-300',
          tasks: sntTasks.length > 0 ? sntTasks : [
            { id: 'SIG-301', name: 'Point Machine Testing (Standby)', start: '01:00', end: '04:25', leftPct: 4.16, widthPct: 14.2 }
          ]
        }
      ];
    }

    return [
      {
        id: 'civil',
        name: t.laneCivil,
        icon: Hammer,
        color: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300',
        badgeColor: 'bg-cyan-500/20 text-cyan-300',
        tasks: [
          { id: 'T-101', name: 'Continuous Action Track Tamping (CSM-09)', start: '01:30', end: '04:30', leftPct: 6.25, widthPct: 12.5 },
          { id: 'T-102', name: 'USFD Ultrasonic Flaw Rectification (Km 142)', start: '02:00', end: '03:45', leftPct: 8.3, widthPct: 7.3 }
        ]
      },
      {
        id: 'trd',
        name: t.laneTrd,
        icon: Zap,
        color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300',
        badgeColor: 'bg-emerald-500/20 text-emerald-300',
        tasks: [
          { id: 'TRD-201', name: '25 kV OHE Cantilever Inspection & Height Adjustment', start: '01:45', end: '04:15', leftPct: 7.3, widthPct: 10.4 },
          { id: 'TRD-202', name: 'Neutral Section Assembly Overhaul', start: '02:15', end: '03:45', leftPct: 9.375, widthPct: 6.25 }
        ]
      },
      {
        id: 'snt',
        name: t.laneSnt,
        icon: Radio,
        color: 'border-purple-500/40 bg-purple-950/30 text-purple-300',
        badgeColor: 'bg-purple-500/20 text-purple-300',
        tasks: [
          { id: 'SIG-301', name: 'Point Machine 143mm Calibration & Testing', start: '02:00', end: '04:00', leftPct: 8.3, widthPct: 8.3 },
          { id: 'SIG-302', name: 'Digital Axle Counter (MSDAC) Sensor Verification', start: '02:30', end: '03:30', leftPct: 10.4, widthPct: 4.16 }
        ]
      }
    ];
  }, [blocks, t]);

  return (
    <div className="bg-[#0b132b] rounded-2xl border border-slate-800 p-5 shadow-xl mt-6">
      {/* 3-State Machine Safety Badge Strip */}
      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200">
            {language === 'hi' ? '25 kV ट्रैक्शन सुरक्षा प्रोटोकॉल (G&SR):' : '25 kV Traction Safety State Machine (G&SR Norms):'}
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
            !isBaseline ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'
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

      <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">
            {language === 'hi' ? 'त्रि-विभागीय समन्वित कार्य अनुसूची (गैंट चार्ट)' : 'Cross-Department Synchronized Gantt Schedule'}
          </h2>
          <span className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${isBaseline ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
            {isBaseline
              ? (language === 'hi' ? 'असमन्वित अलग-अलग ब्लॉक (विभागीय साइलो)' : 'Fragmented Uncoordinated Possessions (Departmental Silos)')
              : (language === 'hi' ? 'एकल 25 kV पावर ब्लॉक में समन्वित कार्य' : 'Synchronized Under Single 25 kV Power Shutoff')}
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
          <span className={`w-2.5 h-2.5 rounded-full ${isBaseline ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
          <span>
            {isBaseline ? (
              language === 'hi' ? (
                <><strong>परिणाम:</strong> 3 विभागों द्वारा अलग-अलग दिन के ब्लॉक मांगने से 4+ ट्रेनें लेट और ट्रैक क्षमता का भारी नुकसान।</>
              ) : (
                <><strong>Result:</strong> 3 departments booking separate daytime blocks causing 4+ train detentions and severe fragmentation.</>
              )
            ) : (
              language === 'hi' ? (
                <><strong>परिणाम:</strong> तीनों विभाग 1 ही संयुक्त ब्लॉक में एक साथ काम करते हैं। दिन के अलग-अलग ब्लॉकों से पूरी तरह मुक्ति।</>
              ) : (
                <><strong>Result:</strong> 3 departments executing work in 1 combined possession. Avoids separate daytime disconnections.</>
              )
            )}
          </span>
        </div>
        <span className={`font-mono font-semibold ${isBaseline ? 'text-red-400' : 'text-cyan-400'}`}>
          {isBaseline
            ? (language === 'hi' ? 'संचालन प्रभाव: 74/100 (गंभीर व्यवधान)' : 'Operational Impact: 74/100 (High Disruption)')
            : (language === 'hi' ? 'कुल प्रभावी कार्य: 3.25 घंटे में 8.75 घंटे का काम (269% उत्पादकता)' : 'Total Effective Work Done: 8.75 Task Hours in 3.25 Block Hours (269% Productivity)')}
        </span>
      </div>
    </div>
  );
};
