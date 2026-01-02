import React from "react";
import { Clock, ChevronRight } from "lucide-react";

const getPosition = (s) =>
  s.position || s.designation || s.role || "Faculty Member";

const StaffCard = ({ s, onClick }) => (
  <div
    onClick={onClick}
    className="group relative bg-white dark:bg-[#181a25] hover:bg-slate-50 dark:hover:bg-[#1c1f2e] rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-indigo-500/10 active:scale-95 lg:active:scale-100"
  >
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

    <div className="flex items-start justify-between mb-6">
      <div className="relative shrink-0">
        <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-slate-100 dark:ring-white/10 group-hover:ring-indigo-500/50 transition-all shadow-lg bg-slate-100 dark:bg-slate-800">
          {s.photo ? (
            <img
              src={s.photo}
              alt={s.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-900 flex items-center justify-center text-xl font-bold text-slate-500 dark:text-white">
              {s.name ? s.name[0] : "?"}
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white dark:bg-[#181a25] rounded-full flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        </div>
      </div>

      <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase shadow-sm">
        {s.department}
      </span>
    </div>

    <div className="space-y-1 mb-6 min-w-0">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
        {s.name}
      </h3>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">
        {getPosition(s)}
      </p>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
      <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
        <Clock size={14} /> <span>Active</span>
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
        <ChevronRight size={16} />
      </div>
    </div>
  </div>
);

export default StaffCard;
