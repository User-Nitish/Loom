import { memo, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  getComPostsAction,
  clearCommunityPostsAction,
} from "../../redux/actions/postActions";
import PostForm from "../form/PostForm";
import Post from "../post/Post";
import FollowingUsersPosts from "./FollowingUsersPosts";
import CommonLoading from "../loader/CommonLoading";
import { MessageSquare, Users, Zap, Loader2 } from "lucide-react";

const MemoizedPost = memo(Post);

const MainSection = () => {
  const dispatch = useDispatch();

  const communityData = useSelector((state) => state.community?.communityData);
  const communityPosts = useSelector((state) => state.posts?.communityPosts);

  const totalCommunityPosts = useSelector(
    (state) => state.posts?.totalCommunityPosts
  );

  const [activeTab, setActiveTab] = useState("All posts");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const LIMIT = 10;

  const postError = useSelector((state) => state.posts?.postError);

  useEffect(() => {
    const fetchInitialPosts = async () => {
      if (communityData?._id) {
        dispatch(getComPostsAction(communityData._id, LIMIT, 0)).finally(() => {
          setIsLoading(false);
        });
      }
    };

    fetchInitialPosts();

    return () => {
      dispatch(clearCommunityPostsAction());
    };
  }, [dispatch, communityData]);

  const handleLoadMore = () => {
    if (
      !isLoadMoreLoading &&
      communityPosts.length > 0 &&
      communityPosts.length < totalCommunityPosts
    ) {
      setIsLoadMoreLoading(true);
      dispatch(
        getComPostsAction(communityData._id, LIMIT, communityPosts.length)
      ).finally(() => {
        setIsLoadMoreLoading(false);
      });
    }
  };

  const memoizedCommunityPosts = useMemo(() => {
    return communityPosts?.map((post, index) => (
      <motion.div
        key={post._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <MemoizedPost post={post} />
      </motion.div>
    ));
  }, [communityPosts]);

  const tabs = [
    { id: "All posts", label: "Posts", icon: MessageSquare },
    { id: "You're following", label: "Following", icon: Users },
  ];

  if (isLoading || !communityData || !communityPosts) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-v-cyan/10 border-t-v-cyan rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-v-cyan animate-pulse">
            <Zap size={24} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Premium Tab System */}
      <div className="flex items-center gap-10 mb-12 border-b border-white/5 pb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 transition-all relative group ${
              activeTab === tab.id ? "text-white" : "text-white/20 hover:text-white/40"
            }`}
          >
            <tab.icon size={18} className={activeTab === tab.id ? "text-v-cyan" : "opacity-40"} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeCommunityTab"
                className="absolute -bottom-[33px] left-0 right-0 h-0.5 bg-v-cyan shadow-[0_0_10px_#22d3ee]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-12">
        <AnimatePresence mode="wait">
          {activeTab === "All posts" && (
            <motion.div
              key="all-posts"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-12"
            >
              <div className="mb-16">
                <PostForm
                  communityId={communityData._id}
                  communityName={communityData.name}
                />
              </div>

              {postError && (
                <div className="text-v-red bg-v-red/5 border border-v-red/20 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center mb-8">
                  System_Error: {postError}
                </div>
              )}

              <div className="space-y-12">
                {memoizedCommunityPosts}
              </div>

              {communityPosts.length < totalCommunityPosts && (
                <div className="pt-12 flex justify-center">
                  <button
                    className="group relative flex items-center gap-4 px-12 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                    onClick={handleLoadMore}
                    disabled={isLoadMoreLoading}
                  >
                    {isLoadMoreLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-v-cyan" />
                        <span>Fetching_Data...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={16} className="group-hover:text-v-yellow transition-colors" />
                        <span>Post</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "You're following" && (
            <motion.div
              key="following"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <FollowingUsersPosts communityData={communityData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainSection;
