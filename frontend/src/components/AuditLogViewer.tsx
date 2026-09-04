import React from 'react';
import { FileCheck } from 'lucide-react';

interface AuditLogViewerProps {
  logs: any[];
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#0b132b] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <FileCheck className="w-6 h-6 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Official Ledger & Approval Audit Trail</h2>
          <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
            CRIS Statutory Compliance
          </span>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          Every candidate plan approval, override, and emergency re-dispatch action is immutably logged with authorized user credentials, role, timestamp, and justification reason.
        </p>
      </div>

      <div className="bg-[#0b132b] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Plan / Context</th>
                <th className="py-2.5 px-3">Authorized By</th>
                <th className="py-2.5 px-3">Official Role</th>
                <th className="py-2.5 px-3">Recorded Justification Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-500 italic">
                    No approval records recorded in this session yet. Approve a candidate plan or trigger emergency re-dispatch.
                  </td>
                </tr>
              ) : (
                logs.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-mono text-slate-400">{log.timestamp?.slice(0, 19).replace('T', ' ')}</td>
                    <td className="py-3 px-3">
                      <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white font-medium">{log.plan_name || log.incident || 'System Event'}</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono">{log.approved_by || 'Control Office Engine'}</td>
                    <td className="py-3 px-3 text-slate-400">{log.role || 'System'}</td>
                    <td className="py-3 px-3 text-slate-300 italic">{log.reason || log.resolution || 'Auto-generated audit trace'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
