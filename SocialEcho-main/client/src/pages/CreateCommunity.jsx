import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createCommunityAction } from "../redux/actions/communityActions";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, Globe, Lock, Shield, Image as ImageIcon, Sparkles, Send } from "lucide-react";

const CreateCommunity = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    privacy: "public",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("privacy", formData.privacy);
    if (image) data.append("image", image);

    dispatch(createCommunityAction(data, navigate));
  };

  return (
    <div className="min-h-[80vh] py-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        
        {/* Left: Form */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-v-cyan/10 border border-v-cyan/20 text-v-cyan text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <Sparkles size={12} />
              New Community
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              Create <span className="text-v-cyan block">Community</span>
            </h1>
            <p className="text-white/40 mt-6 text-lg max-w-md leading-relaxed">
              Build a place where people can connect and share their ideas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-4">Community Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center text-white/20 group-focus-within:text-v-cyan transition-colors">
                  <Users size={18} />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Graphic Designers"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-[24px] py-4 pl-16 pr-8 text-white font-bold focus:border-v-cyan/30 focus:bg-white/[0.06] outline-none transition-all shadow-inner"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-4">Description</label>
              <textarea
                placeholder="What is this community about?"
                className="w-full bg-white/[0.03] border border-white/5 rounded-[32px] py-6 px-8 text-white font-bold focus:border-v-cyan/30 focus:bg-white/[0.06] outline-none transition-all min-h-[160px] resize-none shadow-inner"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-4">Visibility</label>
                <select
                  className="w-full bg-white/[0.03] border border-white/5 rounded-[24px] py-4 px-8 text-white font-bold focus:border-v-cyan/30 outline-none appearance-none cursor-pointer"
                  value={formData.privacy}
                  onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
                >
                  <option value="public" className="bg-slate-900">Public</option>
                  <option value="private" className="bg-slate-900">Private</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-4">Photo</label>
                <label className="w-full flex items-center justify-center gap-3 bg-v-cyan text-v-ink border border-v-cyan rounded-[24px] py-4 px-8 font-black text-[10px] uppercase tracking-widest cursor-pointer hover:scale-[1.02] transition-all shadow-lg shadow-v-cyan/20">
                  <ImageIcon size={14} />
                  {image ? "Uploaded" : "Upload Banner"}
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black rounded-[32px] py-6 font-black uppercase tracking-[0.4em] text-xs mt-8 hover:bg-v-cyan hover:text-v-ink hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-white/5 flex items-center justify-center gap-3"
            >
              Create Community
              <Send size={16} />
            </button>
          </form>
        </motion.div>

        {/* Right: Live Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 sticky top-24"
        >
          <div className="mb-6 flex items-center gap-4 text-white/20">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Preview</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <div className="relative group overflow-hidden rounded-[48px] bg-slate-900/40 border border-white/10 p-2 shadow-[0_50px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
            {/* Mock Community Card */}
            <div className="relative h-64 rounded-[40px] overflow-hidden bg-white/5">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/5">
                  <ImageIcon size={64} className="mb-4" />
                  <span className="font-black uppercase tracking-widest text-[10px]">Add a cover photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-v-cyan animate-pulse" />
                  <span className="text-[10px] font-black text-v-cyan uppercase tracking-widest">
                    {formData.privacy}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter truncate">
                  {formData.name || "Community Name"}
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <p className="text-white/40 text-sm leading-relaxed min-h-[60px]">
                {formData.description || "Enter a description for your new community here."}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-xl border-2 border-slate-900 bg-white/5 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-xl border-2 border-slate-900 bg-v-cyan text-v-ink flex items-center justify-center text-[10px] font-black">
                    +0
                  </div>
                </div>
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 pointer-events-none">
                  Syncing...
                </button>
              </div>
            </div>

            {/* Atmosphere Overlays */}
            <div className="absolute top-0 right-0 p-8">
              <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/20">
                <Shield size={20} />
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-v-cyan/5 border border-v-cyan/10 rounded-[32px] flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-v-cyan/10 flex items-center justify-center text-v-cyan">
              <Globe size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Public Community</p>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Everyone on the platform will be able to see and join your community.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateCommunity;
