import { useState, useEffect } from "react";
import {
  addCommentAction,
  getPostAction,
  getComPostsAction,
  getOwnPostAction,
  clearCommentFailAction,
} from "../../redux/actions/postActions";
import { useDispatch, useSelector } from "react-redux";
import InappropriatePost from "../modals/InappropriatePostModal";
import { motion } from "framer-motion";
import { HiOutlinePaperAirplane } from "react-icons/hi2";

const CommentForm = ({ communityId, postId }) => {
  const dispatch = useDispatch();
  const [showInappropriateContentModal, setShowInappropriateContentModal] =
    useState(false);

  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newComment = {
      content,
      postId,
    };
    try {
      setIsLoading(true);
      await dispatch(addCommentAction(postId, newComment));
      await dispatch(getPostAction(postId));
      await dispatch(getOwnPostAction(postId));

      setIsLoading(false);
      setContent("");

      await dispatch(getComPostsAction(communityId));
    } finally {
      setIsLoading(false);
    }
  };

  const isCommentInappropriate = useSelector(
    (state) => state.posts?.isCommentInappropriate
  );

  useEffect(() => {
    if (isCommentInappropriate) {
      setShowInappropriateContentModal(true);
    }
  }, [isCommentInappropriate]);

  return (
    <div className="relative">
      <InappropriatePost
        closeInappropriateContentModal={() => {
          setShowInappropriateContentModal(false);
          dispatch(clearCommentFailAction());
        }}
        showInappropriateContentModal={showInappropriateContentModal}
        contentType={"comment"}
      />

      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/[0.05] focus-within:border-v-cyan/50 focus-within:bg-v-cyan/10 transition-all duration-500 shadow-2xl">
          <textarea
            className="w-full px-8 py-6 bg-transparent text-white placeholder:text-white/40 focus:outline-none resize-none text-base font-medium min-h-[140px]"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
            required
            placeholder="Write a comment..."
          />
          
          <div className="absolute bottom-4 right-4 flex items-center gap-4">
             <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">
               {content.length} / 500
             </span>
             
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-v-cyan text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(27,206,220,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
               type="submit"
               disabled={isLoading || !content.trim()}
             >
               {isLoading ? (
                 <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
               ) : (
                 <>
                   Post Comment <HiOutlinePaperAirplane size={14} className="rotate-45" />
                 </>
               )}
             </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
