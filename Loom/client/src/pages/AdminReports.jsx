import React, { useState, useEffect } from "react";
import { ShieldAlert, CheckCircle, XCircle, ExternalLink, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { API } from "../redux/api/utils";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await API.get("/admin/reports");
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportId, action) => {
    try {
      await API.patch(`/admin/reports/${reportId}`, { status: action });
      setReports(reports.filter(r => r._id !== reportId));
    } catch (error) {
      console.error("Error updating report", error);
    }
  };

  if (loading) return <div className="p-20 text-center text-white/20 uppercase tracking-widest font-black">Accessing secure logs...</div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
          <ShieldAlert size={40} className="text-v-red" />
          Moderation Queue
        </h1>
        <p className="text-white/40 mt-2">Manage reported content and AI-flagged transmissions.</p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white/5 border border-white/5 rounded-[40px] p-20 text-center">
          <CheckCircle size={48} className="text-green-500/20 mx-auto mb-6" />
          <p className="text-white/20 font-black uppercase tracking-[0.6em]">The fabric is clean</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reports.map((report) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row gap-8 items-start md:items-center"
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    report.reason.includes("AI") ? "bg-v-red/10 text-v-red" : "bg-v-yellow/10 text-v-yellow"
                  }`}>
                    {report.reason}
                  </span>
                  <span className="text-[10px] text-white/20 font-bold">
                    {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                  <p className="text-sm text-white/80 italic">"{report.post.content}"</p>
                </div>

                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span className="font-bold">Author: {report.post.user?.name}</span>
                  <span className="w-1 h-1 bg-white/10 rounded-full" />
                  <span className="font-bold text-blue-400">Community: {report.post.community?.name}</span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                <button
                  onClick={() => handleAction(report._id, "resolved")}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-v-red text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-v-red/20"
                >
                  <XCircle size={16} />
                  Remove
                </button>
                <button
                  onClick={() => handleAction(report._id, "dismissed")}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                >
                  <CheckCircle size={16} />
                  Dismiss
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReports;
