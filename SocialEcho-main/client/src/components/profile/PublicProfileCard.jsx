import { memo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, ChevronRight, User } from "lucide-react";
import { motion } from "framer-motion";

const PublicProfileCard = ({ user }) => {
  const followingSince = new Date(user.followingSince).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`/user/${user._id}`}
        className="relative block group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-v-cyan/5 to-v-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative glass-card p-6 rounded-[32px] border border-white/5 bg-v-ink/40 shadow-2xl backdrop-blur-3xl transition-all duration-300 group-hover:border-v-cyan/30">
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/5 rounded-tr-[32px] group-hover:border-v-cyan/20 transition-colors" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/5 rounded-bl-[32px] group-hover:border-v-cyan/20 transition-colors" />

          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-v-cyan/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 p-1 bg-white/[0.02]">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-black text-lg text-white uppercase tracking-wider truncate group-hover:text-v-cyan transition-colors">
                  {user.name}
                </h2>
                <div className="w-1.5 h-1.5 rounded-full bg-v-cyan animate-pulse" />
              </div>
              
              <div className="flex items-center gap-2 text-white/30">
                <MapPin size={14} className="text-v-cyan/60" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] truncate">
                  {user.location || "Sector Unknown"}
                </span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20 group-hover:text-v-cyan group-hover:border-v-cyan/30 transition-all">
              <ChevronRight size={20} />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/[0.03] text-white/20">
                <Calendar size={12} />
              </div>
              <div>
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-0.5">Following Since</p>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{followingSince}</p>
              </div>
            </div>
            
            <div className="px-3 py-1.5 rounded-lg bg-v-cyan/5 border border-v-cyan/10">
              <span className="text-[8px] font-black text-v-cyan uppercase tracking-widest flex items-center gap-2">
                <User size={10} />
                Profile
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default memo(PublicProfileCard);
