import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PhotoProvider, PhotoView } from "react-photo-view";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineTrash,
  HiOutlineHeart,
  HiOutlineArrowUpRight,
  HiOutlineEllipsisHorizontal
} from "react-icons/hi2";
import DeleteModal from "../modals/DeleteModal";
import Like from "./Like";
import Save from "./Save";
import "react-photo-view/dist/react-photo-view.css";
import Tooltip from "../shared/Tooltip";
import { Pencil, Bookmark } from "lucide-react";
import formatCreatedAt from "../../utils/timeConverter";

const Post = ({ post, index = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.auth?.userData);

  const { content, fileUrl, fileType, user, community, createdAt, comments } = post;

  const [showModal, setShowModal] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const toggleModal = (value) => {
    setShowModal(value);
  };

  const staggerDelay = index * 0.05;

  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={postVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="glass-card rounded-[40px] p-8 mb-8 group border border-white/5 bg-[#0d0d0d]/40 backdrop-blur-2xl hover:border-white/10 transition-all duration-500"
      onClick={(e) => {
        if (!e.target.closest('button') && !e.target.closest('a')) {
          navigate(`/post/${post._id}`, {
            state: { from: location.pathname },
          });
        }
      }}
    >
      {/* Header Container */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            to={userData._id === user._id ? "/profile" : `/user/${user._id}`}
            className="relative shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-v-cyan/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              className="relative w-14 h-14 rounded-full object-cover border-2 border-white/5"
              src={user.avatar || "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg"}
              alt={user.name}
              onLoad={() => setIsImageLoading(false)}
            />
          </Link>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={userData._id === user._id ? "/profile" : `/user/${user._id}`}
                className="text-sm font-black text-white hover:text-v-cyan transition-colors uppercase tracking-wider"
                onClick={(e) => e.stopPropagation()}
              >
                {user.name}
              </Link>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <Link
                to={`/community/${community.name}`}
                className="text-[10px] font-black text-v-yellow hover:text-white transition-all uppercase tracking-[0.2em]"
                onClick={(e) => e.stopPropagation()}
              >
                {community.name}
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-white/20 uppercase tracking-widest">
              {formatCreatedAt(createdAt)}
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {userData?._id === post.user._id && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); }}
                className="p-2.5 rounded-2xl text-white/20 hover:text-v-cyan hover:bg-v-cyan/10 transition-all"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleModal(true); }}
                className="p-2.5 rounded-2xl text-white/20 hover:text-v-red hover:bg-v-red/10 transition-all"
              >
                <HiOutlineTrash size={18} />
              </button>
            </>
          )}
          <button className="p-2.5 rounded-2xl text-white/20 hover:text-white hover:bg-white/5 transition-all">
            <HiOutlineEllipsisHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-8 relative">
        <p className="text-lg font-medium text-white/90 leading-relaxed tracking-tight">
          {content}
        </p>
      </div>

      {/* Media */}
      {fileUrl && (
        <div className="relative rounded-[32px] overflow-hidden bg-black/20 border border-white/5 mb-8">
          {fileType === "image" ? (
            <PhotoProvider>
              <PhotoView src={fileUrl}>
                <div className="relative group/media cursor-zoom-in">
                  <img
                    src={fileUrl}
                    alt={content}
                    className="w-full h-auto max-h-[800px] object-contain transition-transform duration-700 group-hover/media:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity duration-300" />
                </div>
              </PhotoView>
            </PhotoProvider>
          ) : (
            <video
              className="w-full max-h-[600px] object-cover"
              src={fileUrl}
              controls
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}

      {/* Actions Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <div className="flex items-center gap-6">
          <Like post={post} />

          <button
            className="flex items-center gap-3 py-2.5 px-4 rounded-2xl bg-white/[0.03] text-white/40 hover:text-v-cyan hover:bg-v-cyan/5 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/post/${post._id}`, { state: { from: location.pathname } });
            }}
          >
            <HiOutlineChatBubbleLeftRight size={20} />
            <span className="text-xs font-black uppercase tracking-widest">{comments.length}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Save postId={post._id} />
          <button 
            className="flex items-center gap-2 p-3 rounded-2xl bg-v-cyan/10 text-v-cyan hover:bg-v-cyan hover:text-black transition-all"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/post/${post._id}`);
            }}
          >
            <HiOutlineArrowUpRight size={20} />
          </button>
        </div>
      </div>

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
