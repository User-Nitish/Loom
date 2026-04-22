import { memo, useMemo, useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  getPostsAction,
  clearPostsAction,
} from "../../redux/actions/postActions";
import { useSelector, useDispatch } from "react-redux";
import Post from "../post/Post";
import CommonLoading from "../loader/CommonLoading";
import Home from "../../assets/home.jpg";

const MemoizedPost = memo(Post);

const LoadMoreButton = ({ onClick, isLoading }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <motion.button
        className="btn-accent w-full my-8 group relative overflow-hidden"
        onClick={onClick}
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative z-10">
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Loading more posts...
            </span>
          ) : (
            "Load More Posts"
          )}
        </span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-accent-600 to-accent-400"
          initial={{ x: "-100%" }}
          whileHover={{ x: "0%" }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </motion.div>
  );
};

const EmptyState = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });
  
  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center justify-center py-20 px-6 min-h-[60vh]"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="relative mb-8">
        <motion.div
          className="absolute inset-0 bg-secondary-900/40 blur-3xl rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="relative glass-card rounded-2xl p-8 border border-secondary-500/30 bg-neutral-600/20 backdrop-blur-md"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div 
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary-500/40 to-secondary-900/50 flex items-center justify-center border border-secondary-500/30 shadow-[0_0_25px_rgba(189,9,39,0.35)]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <svg className="w-12 h-12 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </motion.div>
          <motion.h3 
            className="text-2xl font-semibold text-neutral-100 mb-3 text-center font-display"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            No posts yet
          </motion.h3>
          <motion.p 
            className="text-neutral-400 text-center max-w-md mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Join communities and start sharing to see posts in your feed. Your social journey begins here.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              className="btn-accent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Explore Communities
            </motion.button>
            <motion.button
              className="btn-ghost"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Create Post
            </motion.button>
          </div>
        </motion.div>
      </div>
      <motion.img
        src={Home}
        alt="No posts illustration"
        className="w-full max-w-2xl max-h-80 object-contain mx-auto opacity-80 rounded-[2rem]"
        loading="lazy"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={isInView ? { opacity: 0.8, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
};

const ScrollAnimatedPost = ({ post, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <MemoizedPost post={post} index={index} />
    </motion.div>
  );
};

const MainSection = ({ userData }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const posts = useSelector((state) => state.posts?.posts);
  const totalPosts = useSelector((state) => state.posts?.totalPosts);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const isFooterInView = useInView(footerRef, { once: true, margin: "-100px" });

  const LIMIT = 10;

  useEffect(() => {
    if (userData) {
      dispatch(getPostsAction(LIMIT, 0)).finally(() => {
        setIsLoading(false);
      });
    }

    return () => {
      dispatch(clearPostsAction());
    };
  }, [userData, dispatch, LIMIT]);

  const handleLoadMore = useCallback(() => {
    setIsLoadMoreLoading(true);
    dispatch(getPostsAction(LIMIT, posts.length)).finally(() => {
      setIsLoadMoreLoading(false);
    });
  }, [dispatch, LIMIT, posts.length]);

  const memoizedPosts = useMemo(() => {
    return posts.map((post, index) => (
      <ScrollAnimatedPost key={post._id} post={post} index={index} />
    ));
  }, [posts]);

  if (isLoading) {
    return (
      <motion.div
        className="flex justify-center items-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          <div className="relative inline-flex">
            <motion.div
              className="w-16 h-16 border-4 border-neutral-800 border-t-accent-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 w-12 h-12 border-4 border-neutral-900 border-b-accent-400 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="mt-4 text-neutral-400 text-sm">Loading your feed...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="space-y-6 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header Section - Scroll Triggered */}
        <motion.div
          ref={headerRef}
          className="text-center py-8 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gradient mb-4 font-display"
            initial={{ opacity: 0, y: -30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Your Feed
          </motion.h1>
          <motion.p 
            className="text-neutral-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover what's happening in your communities
          </motion.p>
        </motion.div>

        {/* Posts Grid - Each post animates when scrolled into view */}
        <div className="space-y-6">
          {memoizedPosts}
        </div>

        {/* Load More Button - Scroll Triggered */}
        {posts.length > 0 && posts.length < totalPosts && (
          <LoadMoreButton
            onClick={handleLoadMore}
            isLoading={isLoadMoreLoading}
          />
        )}

        {/* Empty State - Scroll Triggered */}
        {posts.length === 0 && <EmptyState />}

        {/* Footer Stats */}
        {posts.length > 0 && (
          <motion.div
            ref={footerRef}
            className="rounded-xl p-8 mt-12 text-center bg-white/5 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={isFooterInView ? { opacity: 1, y: 0 } : {}}
          >
            <div className="flex items-center justify-center gap-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-v-yellow">{posts.length}</div>
                <div className="text-sm text-white/40 mt-1">Posts</div>
              </div>
              {totalPosts && (
                <>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-v-cyan">{totalPosts}</div>
                    <div className="text-sm text-white/40 mt-1">Total Available</div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Simple Discovery Section */}
        <section className="py-20 border-t border-white/5">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Explore More</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Trending", desc: "See what's hot in the community right now." },
              { title: "New Communities", desc: "Discover fresh spaces to share your thoughts." },
              { title: "Saved Posts", desc: "Revisit the conversations you cared about most." }
            ].map((item, i) => (
              <div 
                key={i}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Decorative Spacer */}
        <div className="h-40" />

      </motion.div>
    </AnimatePresence>
  );
};

export default MainSection;
