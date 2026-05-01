import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("admin"));
      const { data } = await axios.get("http://localhost:4000/admin/reports", {
        headers: { Authorization: `Bearer ${adminData.accessToken}` }
      });
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportId, action) => {
    try {
      const adminData = JSON.parse(localStorage.getItem("admin"));
      await axios.patch(`http://localhost:4000/admin/reports/${reportId}`, 
        { status: action },
        { headers: { Authorization: `Bearer ${adminData.accessToken}` }}
      );
      setReports(reports.filter(r => r._id !== reportId));
    } catch (error) {
      console.error("Error updating report", error);
    }
  };

  if (loading) return <div className="p-20 text-center text-white/20 uppercase tracking-widest font-black">Accessing secure logs...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">Moderation Queue</h2>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Review flagged transmissions</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-20 text-center">
          <CheckCircle size={48} className="text-v-cyan/20 mx-auto mb-6" />
          <p className="text-white/20 font-black uppercase tracking-[0.6em]">The fabric is clean</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reports.map((report) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    report.reason.includes("AI") ? "bg-v-red/10 text-v-red" : "bg-v-yellow/10 text-v-yellow"
                  }`}>
                    {report.reason}
                  </span>
                  <span className="text-[9px] text-white/20 font-bold uppercase tracking-tighter">
                    {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                <p className="text-sm text-white/80 font-medium line-clamp-2">"{report.post.content}"</p>

                <div className="flex items-center gap-3 text-[10px] text-white/30 uppercase tracking-widest">
                  <span className="font-bold">Author: {report.post.user?.name}</span>
                  <span className="w-1 h-1 bg-white/10 rounded-full" />
                  <span className="font-bold text-v-cyan/60">Node: {report.post.community?.name}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(report._id, "resolved")}
                  className="px-6 py-2.5 bg-v-red text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-v-red/20"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleAction(report._id, "dismissed")}
                  className="px-6 py-2.5 bg-white/5 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
                >
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

export default Reports;
