import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineArrowUpRight } from "react-icons/hi2";

const JoinedCommunityCard = ({ community, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link 
        to={`/community/${community.name}`} 
        className="group relative flex flex-col md:flex-row items-center gap-6 glass-card p-6 rounded-[32px] border border-white/5 bg-v-ink/40 hover:bg-v-ink/60 transition-all overflow-hidden"
      >
        {/* Glow Decor */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-v-cyan/5 rounded-full blur-3xl group-hover:bg-v-cyan/10 transition-all pointer-events-none" />

        <div className="relative w-full md:w-48 h-32 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
          <img 
            className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" 
            src={community.banner} 
            alt={community.name} 
            loading="lazy" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-v-ink/60 to-transparent opacity-60" />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-black text-white tracking-tighter uppercase mb-2 group-hover:text-v-cyan transition-colors">
            {community.name}
          </h3>
          <div className="flex items-center justify-center md:justify-start gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-v-cyan shadow-[0_0_8px_rgba(27,206,220,0.8)] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                  {community.members.length} Core Nodes
                </span>
             </div>
             <div className="w-px h-3 bg-white/10 hidden md:block" />
             <span className="text-[10px] font-black uppercase tracking-widest text-v-cyan/60 hidden md:block">
               Established
             </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 text-white/20 group-hover:bg-v-cyan group-hover:text-v-ink transition-all">
          <HiOutlineArrowUpRight className="text-2xl" />
        </div>
      </Link>
    </motion.div>
  );
};

export default JoinedCommunityCard;
