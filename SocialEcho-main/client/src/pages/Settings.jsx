import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserAction, deleteAccountAction } from "../redux/actions/userActions";
import { User, Shield, Trash2, Bell, Smartphone, ChevronRight, Heart, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Settings = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const user = userData;
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateUserAction(user._id, formData));
  };

  const handleDelete = () => {
    if (window.confirm("ARE YOU SURE? This will permanently delete all your posts, comments, and media from S3. This cannot be undone.")) {
      dispatch(deleteAccountAction(user._id));
    }
  };

  if (!user) return <div className="p-20 text-center text-white/20 uppercase tracking-widest font-black">Connecting to the fabric...</div>;

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security & Devices", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "danger", label: "Danger Zone", icon: Trash2, color: "text-red-400" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <tab.icon size={18} className={tab.color} />
              {tab.label}
              {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#0a0a0a]/98 backdrop-blur-[40px] border border-white/10 rounded-3xl p-8 shadow-2xl">
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="text-xl font-bold text-white mb-6">Profile Settings</h3>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="flex items-center gap-6 mb-8">
                  <img src={user.avatar} className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10" alt="" />
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs transition-all border border-white/5">
                    Change Avatar
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-slate-400 outline-none cursor-not-allowed"
                    value={formData.email}
                    disabled
                  />
                </div>
                <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20">
                  Save Changes
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h3 className="text-xl font-bold text-white">Security & Devices</h3>
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center">
                  <Smartphone className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Context-Based Auth</h4>
                  <p className="text-xs text-slate-400">Your account is protected by location and device tracking.</p>
                </div>
                <span className="ml-auto px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-md uppercase">Active</span>
              </div>
              <button onClick={() => window.location.href='/devices-locations'} className="text-sm text-blue-400 hover:underline">
                View all login activity
              </button>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Signal Matrix</h3>
                <div className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black rounded-md uppercase border border-amber-500/20">
                  Secure-Link
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: "likes", label: "Impact Events", desc: "When your data receives positive reinforcement", icon: Heart, color: "text-orange-500" },
                  { id: "comments", label: "Signal Bursts", desc: "Incoming text-based interactions", icon: MessageCircle, color: "text-amber-500" },
                  { id: "followers", label: "Network Growth", desc: "New nodes connecting to your stream", icon: User, color: "text-yellow-500" },
                  { id: "mentions", label: "Direct Ping", desc: "When you are targeted in external logs", icon: Sparkles, color: "text-zinc-400" }
                ].map((item) => (
                  <div key={item.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/5`}>
                        <item.icon size={18} className={item.color} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-zinc-100 uppercase tracking-widest">{item.label}</h4>
                        <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-tight">{item.desc}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-10 h-5 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#0c0c0c] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 after:shadow-lg"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-4 p-4 bg-white/[0.01] border border-white/5 rounded-xl flex gap-4">
                <Bell className="text-zinc-600 shrink-0" size={18} />
                <p className="text-[10px] text-zinc-500 leading-relaxed font-black uppercase tracking-tighter">
                  Warning: Signal modifications are local to this terminal. Global relay settings available in core console.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "danger" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h3 className="text-xl font-black text-orange-600 uppercase tracking-tighter">Terminal Termination</h3>
              <div className="p-6 border border-orange-600/20 bg-orange-600/5 rounded-2xl">
                <h4 className="text-xs font-black text-zinc-100 mb-2 uppercase tracking-widest">Delete Sequence</h4>
                <p className="text-[10px] text-zinc-500 mb-6 font-black uppercase leading-relaxed tracking-tighter">
                  Initiating this command will permanently purge your data nodes from the network. This action is irreversible.
                </p>
                <button 
                  onClick={handleDelete}
                  className="px-6 py-2 bg-orange-600/10 hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-600/20 rounded-lg text-[10px] font-black transition-all shadow-lg shadow-orange-600/20 uppercase tracking-widest"
                >
                  Confirm Full Purge
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
