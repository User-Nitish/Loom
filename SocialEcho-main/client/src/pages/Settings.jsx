import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserAction, deleteAccountAction } from "../redux/actions/userActions";
import { User, Shield, Trash2, Bell, Smartphone, ChevronRight } from "lucide-react";
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
        <div className="flex-1 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
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

          {activeTab === "danger" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
              <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-2xl">
                <h4 className="text-sm font-bold text-white mb-2">Delete Account</h4>
                <p className="text-xs text-slate-400 mb-6">
                  Once you delete your account, there is no going back. All your media will be wiped from our AWS storage.
                </p>
                <button 
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-600/20"
                >
                  Delete My Account Permanently
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
