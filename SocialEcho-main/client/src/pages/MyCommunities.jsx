import { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getJoinedCommunitiesAction } from "../redux/actions/communityActions";
import JoinedCommunityCard from "../components/community/JoinedCommunityCard";
import CommonLoading from "../components/loader/CommonLoading";
import { motion } from "framer-motion";

const MyCommunities = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const joinedCommunities = useSelector(
    (state) => state.community?.joinedCommunities
  );

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getJoinedCommunitiesAction());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const communityCards = useMemo(() => {
    if (!joinedCommunities) {
      return null;
    }
    return joinedCommunities.map((community, index) => (
      <JoinedCommunityCard key={community._id} community={community} index={index} />
    ));
  }, [joinedCommunities]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <motion.div
        className="text-left pt-6 pb-2 border-b border-white/5"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2 font-display">
          My Worlds
        </h1>
        <div className="flex items-center gap-3">
          <div className="w-12 h-1 bg-v-cyan rounded-full" />
          <p className="text-white/30 text-xs font-black uppercase tracking-widest">
            Established Territory
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {communityCards}
      </div>
      
      {joinedCommunities?.length === 0 && (
        <div className="glass-card rounded-[40px] p-20 text-center border border-white/5 bg-v-ink/40">
           <p className="text-white/30 text-xs font-black uppercase tracking-[0.3em]">
            No territories established. Discover new communities to begin.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyCommunities;
