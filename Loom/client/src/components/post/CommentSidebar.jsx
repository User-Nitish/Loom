import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChatBubbleLeftRight, HiOutlineClock } from "react-icons/hi2";
import formatCreatedAt from "../../utils/timeConverter";

const CommentSidebar = ({ comments }) => {
  const [commentsPerPage, setCommentsPerPage] = useState(10);

  const currentComments = comments.slice(0, commentsPerPage);

  const handleLoadMore = () => {
    setCommentsPerPage((prev) => prev + 10);
  };

  return (
    <div className="lg:col-span-1 hidden lg:block sticky top-32 h-[calc(100vh-160px)] flex flex-col">
      <div className="glass-card rounded-[32px] border border-white/10 overflow-hidden flex flex-col h-full bg-[#0a0a0a]/40 backdrop-blur-xl">
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-v-cyan/10 text-v-cyan">
              <HiOutlineChatBubbleLeftRight size={20} />
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">
              Recent Activity
            </h2>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {currentComments.length > 0 ? (
              currentComments.map((comment, idx) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-v-cyan/30 hover:bg-v-cyan/5 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <Link to={`/user/${comment.user?._id}`} className="shrink-0 relative">
                      <div className="absolute inset-0 bg-v-cyan/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img
                        src={comment.user?.avatar || "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg"}
                        alt={comment.user?.name}
                        className="relative w-8 h-8 rounded-full object-cover border border-white/10"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <Link 
                          to={`/user/${comment.user?._id}`}
                          className="text-[11px] font-black text-white hover:text-v-cyan transition-colors truncate pr-2 uppercase tracking-wider"
                        >
                          {comment.user?.name}
                        </Link>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-white/20 whitespace-nowrap">
                          <HiOutlineClock size={10} />
                          {formatCreatedAt(comment.createdAt)}
                        </div>
                      </div>
                      <p className="text-[11px] text-white/60 leading-relaxed line-clamp-3 font-medium">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center px-6">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-4">
                  <HiOutlineChatBubbleLeftRight className="text-white/10 text-xl" />
                </div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                  Silence in the void
                </p>
              </div>
            )}
          </AnimatePresence>

          {currentComments.length < comments.length && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl border border-white/5 bg-white/[0.02] text-[10px] font-black text-white/40 uppercase tracking-[0.2em] hover:text-v-cyan hover:bg-v-cyan/5 hover:border-v-cyan/20 transition-all duration-300 mt-2"
              onClick={handleLoadMore}
            >
              Load More Comments
            </motion.button>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <p className="text-[9px] font-black text-white/10 text-center uppercase tracking-[0.3em]">
            {comments.length} Comments Found
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentSidebar;
