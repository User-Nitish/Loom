import { memo, useMemo, useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  getPostsAction,
  clearPostsAction,
} from "../../redux/actions/postActions";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Post from "../post/Post";
import CommonLoading from "../loader/CommonLoading";

const MemoizedPost = memo(Post);

const SectionHeader = ({ title, subtitle, align = "left", titleColor = "text-white", isGradient = false }) => (
  <div className={`mb-12 ${align === "center" ? "text-center" : "text-left"}`}>
    <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase mb-3 ${isGradient
      ? "bg-gradient-to-r from-v-red via-v-red to-white/40 bg-clip-text text-transparent"
      : titleColor
      }`}>
      {title}
    </h2>
    <p className="text-white/70 text-sm md:text-base font-medium tracking-wide">{subtitle}</p>
    {align === "center" && <div className="w-24 h-1 bg-v-yellow mx-auto mt-6 rounded-full" />}
  </div>
);

const MainSection = ({ userData }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const posts = useSelector((state) => state.posts?.posts || []);
  const totalPosts = useSelector((state) => state.posts?.totalPosts || 0);

  const LIMIT = 10;

  useEffect(() => {
    dispatch(getPostsAction(LIMIT, 0)).finally(() => {
      setIsLoading(false);
    });

    return () => {
      dispatch(clearPostsAction());
    };
  }, [dispatch]);

  if (isLoading) return <div className="flex justify-center py-20"><CommonLoading /></div>;

  return (
    <div className="flex flex-col">

      {/* 1. Featured / Bento Discovery (Start Directly Here) */}
      <section className="py-32 px-6 max-w-7xl mx-auto w-full">
        <SectionHeader title="Discovery" subtitle="Handpicked spaces and trending echoes." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -10 }} className="md:col-span-2 glass-card rounded-[40px] p-10 min-h-[400px] flex flex-col justify-end border border-white/10 group relative overflow-hidden">
            <div className="absolute top-10 right-10 w-16 h-16 rounded-full bg-v-yellow/10 border border-v-yellow/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-v-yellow animate-pulse" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-4">The future of <br />connection.</h3>
            <p className="text-white/40 max-w-sm">Explore how niche communities are reclaiming the digital landscape from algorithmic noise.</p>
          </motion.div>
          <div className="space-y-6">
            <div className="glass-card rounded-[40px] p-8 border border-white/10">
              <p className="text-xs font-bold text-white/20 uppercase tracking-widest mb-4">Trending</p>
              <div className="space-y-3">
                <p className="text-lg font-bold text-white hover:text-v-yellow cursor-pointer">#Web3Design</p>
                <p className="text-lg font-bold text-white hover:text-v-yellow cursor-pointer">#Minimalism</p>
                <p className="text-lg font-bold text-white hover:text-v-yellow cursor-pointer">#CreativeFocus</p>
              </div>
            </div>
            <div className="glass-card rounded-[40px] p-8 border border-white/10 bg-v-yellow group cursor-pointer">
              <h3 className="text-2xl font-bold text-v-ink mb-2">Join Loom</h3>
              <p className="text-v-ink/60 text-sm font-medium">Start your own community node today.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Explore Communities Hub */}
      <section className="mx-6 py-24 px-6 bg-black/55 backdrop-blur-[70px] border border-white/5 relative overflow-hidden rounded-[80px]">
        <div className="absolute inset-0 bg-gradient-to-br from-v-yellow/10 to-transparent pointer-events-none opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            title="Explore Communities"
            subtitle="Discover niche spaces where you belong."
            align="center"
            isGradient={true}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              "Architecture", "Coding", "Music", "Philosophy",
              "Art", "Science", "Gaming", "Travel"
            ].map((tag, i) => (
              <Link
                key={i}
                to="/communities"
                className="bg-black/40 backdrop-blur-[40px] p-8 rounded-[48px] border border-white/10 text-center hover:bg-black/60 transition-all group duration-500 shadow-xl hover:scale-105"
              >
                <p className="text-base font-bold text-white group-hover:text-v-yellow transition-colors tracking-tight">{tag}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Platform Pulse / Stats */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-v-yellow/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Connections", value: "1.2M", color: "text-white" },
            { label: "Threads", value: "450k", color: "text-v-yellow" },
            { label: "Nodes", value: "24k", color: "text-white" },
            { label: "Echos", value: "12k", color: "text-white" },
          ].map((stat, i) => (
            <div key={i}>
              <p className={`text-4xl md:text-5xl font-black mb-2 ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Latest Activity Feed */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="Latest Activity"
            subtitle="Real-time updates from across the Loom network."
          />

          <div className="space-y-8 mt-16">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MemoizedPost post={post} index={index} />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-24 bg-white/5 rounded-[40px] border border-white/5">
                <p className="text-white/20 font-medium text-xl italic tracking-wide">
                  The feed is quiet... for now.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.6em]">
          Loom &copy; 2026 / Zero Noise / Full Focus
        </p>
      </footer>
    </div>
  );
};

export default MainSection;
