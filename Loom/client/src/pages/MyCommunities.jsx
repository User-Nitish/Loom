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
    <div className="space-y-12 pb-24">
      {/* Cinematic Header Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative pt-12 pb-8 border-b border-white/5 px-4 md:px-8"
      >
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-v-teal/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-2xl bg-v-teal/10 text-v-teal border border-v-teal/20 shadow-[0_0_20px_rgba(20,184,166,0.1)]">
            <div className="w-6 h-6 border-2 border-v-teal rounded-lg flex items-center justify-center p-1">
               <div className="w-full h-full bg-v-teal rounded-sm" />
            </div>
          </div>
          <span className="text-[10px] font-black text-v-teal uppercase tracking-[0.5em]">Established_Territory</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
          Territories<span className="text-v-teal">.</span>
        </h1>
        <p className="text-white/30 text-xs font-black uppercase tracking-[0.4em]">
          Secured community nodes and established social frequencies
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-8">
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
