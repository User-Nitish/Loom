import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PhotoProvider, PhotoView } from "react-photo-view";
import {
  HiOutlineChatBubbleOvalLeft,
  HiOutlineArchiveBox,
  HiOutlineHeart,
  HiOutlineShare,
} from "react-icons/hi2";
import DeleteModal from "../modals/DeleteModal";
import Like from "./Like";
import "react-photo-view/dist/react-photo-view.css";
import Tooltip from "../shared/Tooltip";

const postColors = [
  { bg: "bg-v-maroon/10", border: "border-v-maroon/20", shadow: "rgba(62,21,21,0.2)" },
  { bg: "bg-v-brick/10", border: "border-v-brick/20", shadow: "rgba(125,22,22,0.2)" },
  { bg: "bg-v-red/10", border: "border-v-red/20", shadow: "rgba(250,38,38,0.2)" },
  { bg: "bg-v-cyan/10", border: "border-v-cyan/20", shadow: "rgba(27,206,220,0.2)" },
  { bg: "bg-v-teal/10", border: "border-v-teal/20", shadow: "rgba(65,126,140,0.2)" },
  { bg: "bg-v-orange/10", border: "border-v-orange/20", shadow: "rgba(250,154,23,0.2)" },
  { bg: "bg-v-yellow/10", border: "border-v-yellow/20", shadow: "rgba(250,219,23,0.2)" },
];

const Post = ({ post, index = 0 }) => {
  const colorIndex = index % postColors.length;
  const colors = postColors[colorIndex];
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.auth?.userData);

  const { content, fileUrl, fileType, user, community, createdAt, comments } =
    post;

  const [showModal, setShowModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const toggleModal = (value) => {
    setShowModal(value);
  };

  const staggerDelay = index * 0.05;

  const postVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        delay: staggerDelay,
      },
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={postVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
      className={`glass-card rounded-[32px] p-6 mb-6 group cursor-pointer border-2 ${colors.bg} ${colors.border}`}
      style={{ boxShadow: `0 10px 40px -10px ${colors.shadow}` }}
      onClick={(e) => {
        if (!e.target.closest('button') && !e.target.closest('a')) {
          navigate(`/post/${post._id}`, {
            state: { from: location.pathname },
          });
        }
      }}
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-accent-500/20 rounded-full blur-md" />
            <img
              className="relative w-12 h-12 rounded-full object-cover border-2 border-neutral-800"
              src={user.avatar}
              alt={user.name}
              loading="lazy"
              onLoad={() => setIsImageLoading(false)}
            />
            {isImageLoading && (
              <div className="absolute inset-0 bg-neutral-800 rounded-full animate-pulse" />
            )}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {userData._id === user._id ? (
                <Link
                  to="/profile"
                  className="font-bold text-v-cyan hover:text-v-yellow transition-colors truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {user.name}
                </Link>
              ) : (
                <Link
                  to={`/user/${user._id}`}
                  className="font-bold text-v-cyan hover:text-v-yellow transition-colors truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {user.name}
                </Link>
              )}
              <span className="text-neutral-600">·</span>              <Link
                to={`/community/${community.name}`}
                className="px-2 py-0.5 rounded-lg bg-v-yellow text-v-ink text-[10px] font-bold hover:scale-105 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                {community.name}
              </Link>
            </div>
            <p className="text-[10px] font-medium text-white/30 mt-1">
              {new Date(createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })} · {new Date(createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        
        {/* Post Actions */}
        <div className="flex items-center gap-2">
          {userData?._id === post.user._id && (
            <Tooltip text="Delete post">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleModal(true);
                }}
                className="p-2 rounded-xl text-white/20 hover:text-v-red hover:bg-white/5 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <HiOutlineArchiveBox className="text-xl" />
              </motion.button>
            </Tooltip>
          )}
          <Tooltip text="Share post">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                // Implement share functionality
              }}
              className="p-2 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <HiOutlineShare className="text-xl" />
            </motion.button>
          </Tooltip>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-6">
        <p className="text-white/90 leading-relaxed text-base font-medium">
          {content}
        </p>
      </div>

      {/* Media Content */}
      {fileUrl && (
        <div className="mt-4 -mx-6 mb-6">
          {fileType === "image" ? (
            <PhotoProvider
              overlayRender={() => (
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md text-white p-6 border-t border-white/10">
                  <p className="text-base font-bold">{user.name}</p>
                  <p className="text-xs text-white/50">{community.name}</p>
                </div>
              )}
            >
              <PhotoView src={fileUrl}>
                <motion.div
                  className="relative overflow-hidden rounded-2xl cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={fileUrl}
                    alt={content}
                    loading="lazy"
                    className="w-full max-h-[600px] object-cover"
                  />
                </motion.div>
              </PhotoView>
            </PhotoProvider>
          ) : (
            <motion.div
              className="relative overflow-hidden rounded-2xl shadow-2xl"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <video
                className="w-full max-h-[600px] object-cover"
                src={fileUrl}
                controls
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </div>
      )}

      {/* Post Footer */}
      <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-6">
          <Like post={post} />

          <motion.button
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/post/${post._id}`, {
                state: { from: location.pathname },
              });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HiOutlineChatBubbleOvalLeft className="text-2xl" />
            <span className="text-xs font-medium">{comments.length} Comments</span>
          </motion.button>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            className={`p-3 rounded-xl transition-all duration-300 ${
              isLiked
                ? 'text-v-red bg-v-red/10 shadow-[0_0_20px_rgba(250,38,38,0.2)]'
                : 'text-white/20 hover:text-v-red hover:bg-v-red/10'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <HiOutlineHeart className={`text-2xl ${isLiked ? 'fill-current shadow-v-red' : ''}`} />
          </motion.button>
        </div>
      </div>>

      {/* Delete Modal */}
      <AnimatePresence>
        {showModal && (
          <DeleteModal
            showModal={showModal}
            postId={post._id}
            onClose={() => toggleModal(false)}
            prevPath={location.pathname}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Post;
