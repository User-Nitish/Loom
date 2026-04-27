import { useState, useEffect } from "react";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  likePostAction,
  unlikePostAction,
} from "../../redux/actions/postActions";

const Like = ({ post }) => {
  const dispatch = useDispatch();
  const { _id, likes } = post;
  const userData = useSelector((state) => state.auth?.userData);

  const [likeState, setLikeState] = useState({
    liked: post.likes.includes(userData?._id),
    localLikes: likes.length,
  });

  useEffect(() => {
    setLikeState({
      liked: post.likes.includes(userData?._id),
      localLikes: post.likes.length,
    });
  }, [post.likes, userData?._id]);

  const toggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userData) return;

    const currentlyLiked = likeState.liked;
    const optimisticLikes = currentlyLiked
      ? likeState.localLikes - 1
      : likeState.localLikes + 1;

    setLikeState({
      liked: !currentlyLiked,
      localLikes: optimisticLikes,
    });

    try {
      if (currentlyLiked) {
        dispatch(unlikePostAction(_id));
      } else {
        dispatch(likePostAction(_id));
      }
    } catch (error) {
      // Revert on error
      setLikeState({
        liked: currentlyLiked,
        localLikes: likeState.localLikes,
      });
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleLike}
      className={`flex items-center gap-2.5 py-2.5 px-4 rounded-2xl transition-all duration-300 ${
        likeState.liked 
          ? 'bg-v-red/10 text-v-red shadow-[0_0_20px_rgba(250,38,38,0.2)]' 
          : 'bg-white/[0.03] text-white/40 hover:text-v-red hover:bg-v-red/5'
      }`}
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          {likeState.liked ? (
            <motion.div
              key="liked"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <HiHeart className="text-2xl fill-current" />
            </motion.div>
          ) : (
            <motion.div
              key="unliked"
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <HiOutlineHeart className="text-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="text-xs font-black uppercase tracking-widest">
        {likeState.localLikes}
      </span>
    </motion.button>
  );
};

export default Like;
