import { useEffect } from "react";
import { getNotJoinedCommunitiesAction } from "../redux/actions/communityActions";
import { getPostsAction } from "../redux/actions/postActions";
import { useDispatch, useSelector } from "react-redux";
import CommonLoading from "../components/loader/CommonLoading";
import CommunityCard from "../components/community/CommunityCard";
import Post from "../components/post/Post";
import SectionHeader from "../components/shared/SectionHeader";
import { motion } from "framer-motion";
import { memo } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const MemoizedPost = memo(Post);

const AllCommunities = () => {
  const dispatch = useDispatch();

  const notJoinedCommunities = useSelector(
    (state) => state.community?.notJoinedCommunities
  );

  const posts = useSelector((state) => state.posts?.posts || []);

  useEffect(() => {
    dispatch(getNotJoinedCommunitiesAction());
    dispatch(getPostsAction(10, 0)); // Fetch latest posts for explore
  }, [dispatch]);

  if (!notJoinedCommunities) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-20 max-w-6xl mx-auto px-4">
      {/* 1. Community Discovery */}
      <section>
        <div className="flex justify-between items-end">
          <SectionHeader 
            title="Discover" 
            subtitle="Spaces that resonate with your frequencies." 
          />
          <Link
            to="/communities/create"
            className="mb-12 flex items-center gap-2 px-6 py-3 bg-v-cyan text-v-ink rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-v-cyan/20"
          >
            <Plus size={16} />
            Launch Community
          </Link>
        </div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {notJoinedCommunities?.map((community, index) => (
            <CommunityCard key={community._id} community={community} />
          ))}
        </motion.div>
      </section>

      {/* 2. Global Feed (The User's Request) */}
      <section>
        <SectionHeader 
          title="The Pulse" 
          subtitle="Trending transmissions across the network." 
        />
        <div className="space-y-12 mt-12">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post, index) => (
                <MemoizedPost key={post._id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-[40px] p-24 text-center border border-white/5 bg-white/[0.01]">
              <p className="text-white/20 font-black uppercase tracking-[0.6em]">The fabric is quiet...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AllCommunities;
