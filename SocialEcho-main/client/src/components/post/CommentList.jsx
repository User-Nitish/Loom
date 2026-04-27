import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiOutlineClock, HiOutlineHeart } from "react-icons/hi2";
import formatCreatedAt from "../../utils/timeConverter";

const CommentItem = ({ comment, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative p-6 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300"
    >
      <div className="flex gap-4">
        <Link to={`/user/${comment.user?._id}`} className="shrink-0 relative">
          <div className="absolute inset-0 bg-v-cyan/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          <img
            src={comment.user?.avatar || "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg"}
            alt={comment.user?.name}
            className="relative w-10 h-10 rounded-full object-cover border border-white/10"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Link
                to={`/user/${comment.user?._id}`}
                className="text-xs font-black text-white hover:text-v-cyan transition-colors uppercase tracking-wider"
              >
                {comment.user?.name}
              </Link>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <div className="flex items-center gap-1 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                <HiOutlineClock size={12} />
                {formatCreatedAt(comment.createdAt)}
              </div>
            </div>

            <button className="text-white/10 hover:text-v-red transition-colors p-2">
              <HiOutlineHeart size={16} />
            </button>
          </div>

          <p className="text-sm font-medium text-white/70 leading-relaxed break-words">
            {comment.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const CommentList = ({ comments }) => {
  return (
    <div className="space-y-4 mt-8">
      {comments?.length > 0 ? (
        comments.map((comment, index) => (
          <CommentItem key={comment._id} comment={comment} index={index} />
        ))
      ) : (
        <div className="py-20 text-center">
          <p className="text-xs font-black text-white/10 uppercase tracking-[0.5em]">No comments yet</p>
        </div>
      )}
    </div>
  );
};

export default CommentList;
