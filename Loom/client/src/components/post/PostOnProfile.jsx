import { useNavigate, useLocation } from "react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { HiOutlineChatBubbleLeftRight, HiOutlineHeart, HiOutlineArrowUpRight } from "react-icons/hi2";
import formatCreatedAt from "../../utils/timeConverter";

const PostOnProfile = ({ post }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { content, fileUrl, community, createdAt, comments, likes, isMember } = post;

  const isImageFile = useMemo(() => {
    const validExtensions = [".jpg", ".png", ".jpeg", ".gif", ".webp", ".svg"];
    const fileExtension = fileUrl?.slice(fileUrl.lastIndexOf("."));
    return validExtensions.includes(fileExtension);
  }, [fileUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass-card rounded-[32px] p-6 mb-4 border border-white/5 bg-[#0d0d0d]/40 backdrop-blur-xl group cursor-pointer transition-all duration-500 hover:border-white/10 ${
        !isMember && "opacity-50 pointer-events-none"
      }`}
      onClick={() => {
        if (isMember) {
          navigate(`/my/post/${post._id}`, {
            state: { from: location.pathname },
          });
        }
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-v-yellow/10 text-v-yellow">
             <span className="text-[10px] font-black uppercase tracking-widest">{community.name}</span>
          </div>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
            {formatCreatedAt(createdAt)}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-white/5 text-white/20 group-hover:text-v-cyan group-hover:bg-v-cyan/10 transition-all">
          <HiOutlineArrowUpRight size={18} />
        </div>
      </div>

      <div className="mb-4">
        {content && (
          <p className="text-base font-medium text-white/80 leading-relaxed mb-4 line-clamp-3">
            {content}
          </p>
        )}
        
        {fileUrl && (
          <div className="relative rounded-2xl overflow-hidden bg-black/20 border border-white/5">
            {isImageFile ? (
              <img
                className="w-full h-auto max-h-[400px] object-contain group-hover:scale-105 transition-transform duration-700"
                src={fileUrl}
                alt={content}
                loading="lazy"
              />
            ) : (
              <video
                className="w-full h-48 object-cover"
                src={fileUrl}
                controls={false}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-white/30 group-hover:text-v-cyan transition-colors">
          <HiOutlineChatBubbleLeftRight size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">{comments.length}</span>
        </div>
        <div className="flex items-center gap-2 text-white/30 group-hover:text-v-red transition-colors">
          <HiOutlineHeart size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">{likes.length}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PostOnProfile;
