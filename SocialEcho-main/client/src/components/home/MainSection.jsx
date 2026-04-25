import { memo, useMemo, useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  getPostsAction,
  clearPostsAction,
} from "../../redux/actions/postActions";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Post from "../post/Post";
import { PostSkeleton } from "../shared/Skeleton";
import { Zap, TrendingUp, Users, Radio, ArrowUpRight, Sparkles, MessageCircle } from "lucide-react";

const MemoizedPost = memo(Post);

const SectionHeader = ({ title, subtitle, align = "left", titleColor = "text-white", isGradient = false }) => (
  <div className={`mb-12 ${align === "center" ? "text-center" : "text-left"}`}>
    <motion.h2
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className={`text-4xl md:text-6xl font-black tracking-tighter uppercase mb-3 ${isGradient
        ? "bg-gradient-to-r from-v-cyan via-white to-white/40 bg-clip-text text-transparent"
        : titleColor
        }`}
    >
      {title}
    </motion.h2>
    <p className="text-white/40 text-xs md:text-sm font-black uppercase tracking-[0.4em]">{subtitle}</p>
  </div>
);

const MainSection = ({ userData }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [activeFeed, setActiveFeed] = useState("all");
  const posts = useSelector((state) => state.posts?.posts || []);
  const totalPosts = useSelector((state) => state.posts?.totalPosts || 0);

  const LIMIT = 10;

  useEffect(() => {
    setIsLoading(true);
    dispatch(getPostsAction(LIMIT, 0)).finally(() => {
      setIsLoading(false);
    });

    return () => {
      dispatch(clearPostsAction());
    };
  }, [dispatch, activeFeed]);

  const loadMoreRef = useRef(null);
  const isLoadMoreInView = useInView(loadMoreRef);

  useEffect(() => {
    if (isLoadMoreInView && !isLoading && posts.length < totalPosts) {
      dispatch(getPostsAction(LIMIT, posts.length));
    }
  }, [isLoadMoreInView, isLoading, posts.length, totalPosts, dispatch]);

  const feedTabs = [
    { id: "all", label: "Latest Posts", icon: MessageCircle },
    { id: "following", label: "Following", icon: Users },
    { id: "trending", label: "Trending", icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col space-y-32 pb-32">

      {/* 1. Explore Hub (Bento) */}
      <section className="px-6 max-w-7xl mx-auto w-full pt-12">
        <SectionHeader title="Explore" subtitle="Find communities and see what's trending." />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[500px]">

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="md:col-span-8 glass-card rounded-[48px] p-10 relative overflow-hidden group cursor-pointer border border-white/10"
          >
            <img
              src="/featured_discovery_banner.png"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-v-cyan text-v-ink text-[10px] font-black uppercase tracking-widest rounded-full">Featured</span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">5.2k Posts</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                A New Way <br /> to Connect
              </h3>
              <div className="flex items-center gap-4">
                <button className="px-6 py-3 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest hover:bg-v-cyan transition-colors">View Now</button>
              </div>
            </div>
          </motion.div>

          <div className="md:col-span-4 grid grid-rows-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-[40px] p-8 border border-white/10 relative overflow-hidden group cursor-pointer"
            >
              <img
                src="/trending_communities_banner.png"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:rotate-3 transition-transform duration-700"
                alt=""
              />
              <div className="relative z-10">
                <TrendingUp size={24} className="text-v-red mb-4" />
                <h4 className="text-xl font-black text-white uppercase tracking-tighter">Trending <br /> Now</h4>
                <div className="mt-4 flex items-center text-[10px] font-bold text-v-red uppercase tracking-widest gap-2">
                  View Trending <ArrowUpRight size={14} />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-[40px] p-8 border border-white/10 bg-gradient-to-br from-white/5 to-transparent flex flex-col justify-center items-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-v-cyan group-hover:text-v-ink transition-all">
                <Sparkles size={24} />
              </div>
              <h4 className="text-lg font-black text-white uppercase tracking-tighter">Latest <br /> News</h4>
              <p className="text-[10px] text-white/30 font-bold mt-2 uppercase tracking-widest">Everything is updated</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Feed Container */}
      <section className="max-w-4xl mx-auto w-full px-6">
        {/* Feed Navigator */}
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
          <div className="flex gap-8">
            {feedTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFeed === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeed(tab.id)}
                  className={`flex items-center gap-3 transition-all relative group ${isActive ? "text-white" : "text-white/20 hover:text-white/40"
                    }`}
                >
                  <Icon size={18} className={isActive ? "text-v-cyan" : "opacity-40"} />
                  <span className="text-sm font-black uppercase tracking-widest">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-9 left-0 right-0 h-1 bg-v-cyan rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">12.4k Online</span>
          </div>
        </div>

        {/* The Feed */}
        <div className="space-y-12">
          <AnimatePresence mode="wait">
            {isLoading && posts.length === 0 ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {[1, 2, 3].map((i) => <PostSkeleton key={i} />)}
              </motion.div>
            ) : posts.length > 0 ? (
              <motion.div
                key={activeFeed}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                {posts.map((post, index) => (
                  <MemoizedPost key={post._id} post={post} index={index} />
                ))}
                <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
                  {posts.length < totalPosts && <PostSkeleton />}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 bg-white/[0.01] rounded-[60px] border border-white/5"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Radio size={32} className="text-white/10" />
                </div>
                <p className="text-white/20 font-black uppercase tracking-[0.6em]">No posts found</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 3. Stats Section Reverted to match original style but with new layout */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-v-red/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Connections", value: "1.2M", color: "text-white" },
            { label: "Threads", value: "450k", color: "text-v-red" },
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
