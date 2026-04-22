import { useState } from "react";
import JoinModal from "../modals/JoinModal";
import placeholder from "../../assets/placeholder.png";
import { MdOutlineGroupAdd } from "react-icons/md";
import { motion } from "framer-motion";

const CommunityCard = ({ community }) => {
  const [joinModalVisibility, setJoinModalVisibility] = useState({});

  const toggleJoinModal = (communityId, visible) => {
    setJoinModalVisibility((prev) => ({
      ...prev,
      [communityId]: visible,
    }));
  };

  return (
    <motion.div 
      className="glass-card p-6 rounded-[32px] border border-white/5 bg-v-ink/40 shadow-xl group relative overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-v-cyan/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              className="w-16 h-16 rounded-3xl object-cover border-2 border-v-cyan/20 group-hover:border-v-cyan/50 transition-colors shadow-lg"
              src={community.banner || placeholder}
              alt="community banner"
              loading="lazy"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-v-cyan rounded-full border-4 border-v-ink flex items-center justify-center p-0.5" />
          </div>
          <div>
            <h4 className="text-xl font-black text-white tracking-tight uppercase line-clamp-1 group-hover:text-v-cyan transition-colors">
              {community.name}
            </h4>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
              {community.members.length} Active Nodes
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-white/5">
          <div className="flex -space-x-3 overflow-hidden opacity-50">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-v-ink bg-white/5" />
            ))}
          </div>

          <motion.button
            onClick={() => toggleJoinModal(community._id, true)}
            className="flex items-center gap-2 px-5 py-3 bg-v-cyan/10 border border-v-cyan/30 rounded-2xl text-v-cyan hover:bg-v-cyan hover:text-v-ink transition-all group/btn shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdOutlineGroupAdd className="text-xl group-hover/btn:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Connect</span>
          </motion.button>
        </div>

        <JoinModal
          show={joinModalVisibility[community._id] || false}
          onClose={() => toggleJoinModal(community._id, false)}
          community={community}
        />
      </div>
    </motion.div>
  );
};

export default CommunityCard;
