import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Cpu, Layers, Radio } from "lucide-react";

import CommonLoading from "../components/loader/CommonLoading";
import CommunityRightbar from "../components/community/Rightbar";
import CommunityMainSection from "../components/community/MainSection";

const CommunityHome = () => {
  const navigate = useNavigate();
  const { communityName } = useParams();

  const { joinedCommunities } = useSelector((state) => state.community || {});
  const isAuthorized = joinedCommunities?.some(
    ({ name }) => name === communityName
  );

  useEffect(() => {
    if (!isAuthorized && joinedCommunities?.length > 0) {
      navigate("/access-denied");
    }
  }, [isAuthorized, joinedCommunities, navigate, communityName]);

  if (!joinedCommunities) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-v-cyan/20 border-t-v-cyan rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="text-v-cyan animate-pulse" size={32} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Cinematic Background elements for Community */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-v-cyan/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-v-yellow/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1400px] mx-auto px-6 pt-32 pb-32">
        {/* Main Content Hub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8"
        >
          <div className="glass-card p-10 rounded-[48px] border border-white/5 bg-v-ink/40 shadow-2xl backdrop-blur-3xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-v-cyan via-v-yellow to-v-cyan opacity-20" />
            <div className="mb-12 flex items-center justify-between border-b border-white/5 pb-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-v-cyan/10 flex items-center justify-center border border-v-cyan/20">
                  <Radio size={32} className="text-v-cyan animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-v-cyan uppercase tracking-[0.4em] mb-2 block">Active Community</span>
                  <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                    {communityName}<span className="text-v-cyan">.</span>
                  </h1>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Status: Online</span>
                </div>
              </div>
            </div>
            <CommunityMainSection />
          </div>
        </motion.div>

        {/* Tactical Rightbar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4"
        >
          <div className="lg:sticky lg:top-32 space-y-8">
            <div 
              className="glass-card p-8 rounded-[40px] border border-white/5 bg-v-ink/60 shadow-2xl backdrop-blur-3xl relative overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar scroll-smooth overscroll-contain"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/10 rounded-tr-[40px]" />
              <CommunityRightbar />
            </div>

            {/* Technical Footer Indicator */}
            <div className="px-8 py-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Community Status: Active</span>
              </div>
              <Cpu size={14} className="text-white/10" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityHome;
