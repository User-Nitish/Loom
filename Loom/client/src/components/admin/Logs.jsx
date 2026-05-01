import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getLogsAction,
  deleteLogsAction,
} from "../../redux/actions/adminActions";
import CurrentTime from "../shared/CurrentTime";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import CommonLoading from "../loader/CommonLoading";
import { FcRefresh } from "react-icons/fc";

const Logs = () => {
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const dispatch = useDispatch();
  const logs = useSelector((state) => state.admin?.logs);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      await dispatch(getLogsAction());
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    try {
      setClearing(true);
      await dispatch(deleteLogsAction());
    } finally {
      setClearing(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await fetchLogs();
    } catch (error) { }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs?.length]);

  if (loading || !logs) {
    return (
      <div className="flex items-center justify-center mt-5">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-8 w-full max-w-6xl mx-auto overflow-visible px-4 sm:px-0">
      <div className="glass-card !bg-black/60 border border-white/5 shadow-2xl p-4 sm:p-8 w-full relative group z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-v-red via-v-orange to-v-yellow opacity-50 z-40" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase font-display">
              Activity Logs
            </h1>
            <p className="text-v-red text-[10px] font-black uppercase tracking-[0.4em]">
              Administrator View
            </p>
          </div>
          <div className="w-full sm:w-auto flex justify-between sm:justify-end items-center gap-4">
            <CurrentTime />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-white/5 pb-4 gap-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">
            {`Total Logs: ${logs.length} activities found`}
          </div>

          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors group-hover:rotate-180 duration-500"
            >
              <FcRefresh className="text-xl" />
            </button>
            <button
              className={`flex-1 sm:flex-none bg-v-red text-white text-[10px] font-black uppercase tracking-widest py-2.5 px-6 rounded-xl hover:scale-105 transition-all shadow-[0_10px_20px_rgba(250,38,38,0.2)] ${clearing ? "opacity-50 cursor-not-allowed" : ""
                } ${logs.length === 0 ? "hidden" : ""}`}
              onClick={handleCleanup}
              disabled={clearing || logs.length === 0}
            >
              {clearing ? (
                <ButtonLoadingSpinner loadingText="Wiping..." />
              ) : (
                "Clear Logs"
              )}
            </button>
          </div>
        </div>

        {!loading ? (
          logs.length === 0 ? (
            <div className="text-white/20 text-center py-20 font-black uppercase tracking-widest italic">
              No activity logs found.
            </div>
          ) : (
            <div className="w-full">
              {/* Desktop Table Header - Hidden on Mobile */}
              <div className="hidden md:grid grid-cols-5 gap-6 items-center border-b border-white/5 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                <p className="text-center">Time</p>
                <p>Activity</p>
                <p>User Account</p>
                <p>Status</p>
                <p>Log Details</p>
              </div>

              {/* Logs List */}
              <div className="space-y-4 md:space-y-0">
                {logs.map((log) => (
                  <div key={log._id}>
                    {/* Desktop View Row */}
                    <div className="hidden md:grid grid-cols-5 gap-6 items-center border-b border-white/5 py-5 text-sm group/row hover:bg-white/[0.02] transition-colors">
                      <div className="flex flex-col justify-center items-center text-center font-mono space-y-1">
                        <p className="text-white font-bold">{log.relativeTimestamp}</p>
                        <p className="text-[10px] text-white/30">{log.formattedTimestamp}</p>
                      </div>
                      <div className="font-medium text-white/90">
                        <span className={`uppercase font-black text-[10px] mr-2 ${log.level === "error" ? "text-v-red" :
                            log.level === "warn" ? "text-v-orange" : "text-v-cyan"
                          }`}>
                          {log.type}:
                        </span>
                        <span className="italic leading-relaxed">{log.message}</span>
                      </div>
                      <p className="font-mono text-xs text-white/50">{log.email}</p>
                      <div>
                        <span
                          className={`inline-block w-full text-center py-1 rounded-md text-[10px] font-black uppercase tracking-widest border transition-colors ${log.level === "error"
                              ? "bg-v-red/10 border-v-red/30 text-v-red shadow-[0_0_10px_rgba(250,38,38,0.1)]"
                              : log.level === "warn"
                                ? "bg-v-orange/10 border-v-orange/30 text-v-orange"
                                : "bg-v-cyan/10 border-v-cyan/30 text-v-cyan"
                            }`}
                        >
                          {log.level}
                        </span>
                      </div>
                      <div>
                        <ul className="space-y-1">
                          {log.contextData &&
                            Object.entries(log.contextData).map(
                              ([key, value]) => (
                                <li key={key} className="text-[10px] font-mono flex items-start gap-2">
                                  <span className="text-v-cyan/50 font-black uppercase tracking-tighter shrink-0">
                                    {key}:
                                  </span>
                                  <span className="text-white/40 truncate hover:text-white/90 transition-colors cursor-help" title={value}>
                                    {value}
                                  </span>
                                </li>
                              )
                            )}
                        </ul>
                      </div>
                    </div>

                    {/* Mobile View Card */}
                    <div className="md:hidden bg-white/[0.03] border border-white/10 p-5 rounded-2xl space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-white font-mono text-xs font-black uppercase">{log.relativeTimestamp}</p>
                          <p className="text-[9px] text-white/30 uppercase tracking-widest">{log.formattedTimestamp}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                          log.level === 'error' ? 'bg-v-red/20 border-v-red/40 text-v-red' : 
                          log.level === 'warn' ? 'bg-v-orange/10 border-v-orange/30 text-v-orange' : 'bg-v-cyan/10 border-v-cyan/30 text-v-cyan'
                        }`}>
                          {log.level}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-v-cyan uppercase tracking-widest">{log.type}</div>
                        <p className="text-sm text-white/90 italic">{log.message}</p>
                      </div>
                      <div className="pt-3 border-t border-white/5 text-[10px] text-white/40 font-mono truncate">
                        User: {log.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center text-[10px] font-black uppercase tracking-widest text-white/20 mt-6 pt-4 border-t border-white/5 italic pb-4">
                Logs are automatically cleared every 7 days
              </div>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Logs;
