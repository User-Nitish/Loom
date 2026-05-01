import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFollowingUsersAction } from "../redux/actions/userActions";
import PublicProfileCard from "../components/profile/PublicProfileCard";
import CommonLoading from "../components/loader/CommonLoading";
import noFollow from "../assets/nofollow.jpg";
import { motion } from "framer-motion";
import { User } from "lucide-react";

const Following = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const followingUsers = useSelector((state) => state.user?.followingUsers);

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      setLoading(true);
      await dispatch(getFollowingUsersAction());
      setLoading(false);
    };

    fetchFollowingUsers();
  }, [dispatch]);

  return (
    <div className="space-y-12 pb-24">
      {/* Cinematic Header Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative pt-12 pb-8 border-b border-white/5 px-4 md:px-8"
      >
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-v-yellow/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-2xl bg-v-yellow/10 text-v-yellow border border-v-yellow/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
            <User size={24} />
          </div>
          <span className="text-[10px] font-black text-v-yellow uppercase tracking-[0.5em]">Network_Nodes</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
          Following<span className="text-v-yellow">.</span>
        </h1>
        <p className="text-white/30 text-xs font-black uppercase tracking-[0.4em]">
          Active frequencies and synchronized user nodes
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <CommonLoading />
        </div>
      ) : (
        <div className="px-4 md:px-8">
          {followingUsers?.length > 0 ? (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
            >
              {followingUsers.map((user) => (
                <PublicProfileCard key={user._id} user={user} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 flex justify-center items-center flex-col glass-card rounded-[48px] border border-white/5 bg-white/[0.01]"
            >
              <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center mb-8 border border-white/5">
                <User size={32} className="text-white/10" />
              </div>
              <p className="text-white/40 text-xl font-medium mb-10 uppercase tracking-[0.2em] text-sm">
                The frequency is silent. You're not following anyone.
              </p>
              <div className="max-w-sm w-full relative group">
                <div className="absolute inset-0 bg-v-cyan/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src={noFollow} alt="no followers" className="relative w-full opacity-20 rounded-3xl grayscale transition-all duration-700 group-hover:opacity-40 group-hover:grayscale-0" />
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default Following;
