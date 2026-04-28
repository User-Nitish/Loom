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
    <div className="relative overflow-visible">
      {/* Cinematic Banner Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden z-0 pointer-events-none">
        <div
          className="w-full h-full bg-cover bg-center opacity-30 grayscale blur-[2px]"
          style={{ backgroundImage: `url('/bundle.jpeg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-v-ink/80 to-v-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(34,211,238,0.15),transparent_70%)]" />
      </div>

      {/* Cinematic Background elements for Community */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-v-cyan/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-v-yellow/5 blur-[120px] rounded-full" />
      </div>

      {/* Main Content Hub - Plugs into PrivateRoute Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full"
      >
        <div className="glass-card p-6 md:p-10 rounded-[48px] border border-white/5 bg-v-ink/40 shadow-2xl backdrop-blur-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-v-cyan via-v-yellow to-v-cyan opacity-20" />
          <div className="mb-12 flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-8 gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-v-cyan/10 flex items-center justify-center border border-v-cyan/20 shrink-0">
                <Radio size={32} className="text-v-cyan animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black text-v-cyan uppercase tracking-[0.4em] mb-2 block italic">Active Community</span>
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                  {communityName}<span className="text-v-cyan">.</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Status: Online</span>
              </div>
            </div>
          </div>
          <CommunityMainSection />
        </div>
      </motion.div>
    </div>
  );
};

export default CommunityHome;
