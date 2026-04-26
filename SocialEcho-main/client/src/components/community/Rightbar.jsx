import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LeaveModal from "../modals/LeaveModal";
import { getCommunityAction } from "../../redux/actions/communityActions";
import placeholder from "../../assets/placeholder.png";
import CommonLoading from "../loader/CommonLoading";
import { motion } from "framer-motion";
import { Users, Shield, LogOut, Info, List, Radio } from "lucide-react";

import {
  useBannerLoading,
  useIsModeratorUpdated,
} from "../../hooks/useCommunityData";

const Rightbar = () => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const dispatch = useDispatch();
  const { communityName } = useParams();

  const toggleLeaveModal = useCallback(() => {
    setShowLeaveModal((prevState) => !prevState);
  }, []);

  useEffect(() => {
    dispatch(getCommunityAction(communityName));
  }, [dispatch, communityName]);

  const communityData = useSelector((state) => state.community?.communityData);

  const isModeratorOfThisCommunity = useSelector(
    (state) => state.auth?.isModeratorOfThisCommunity
  );

  const { name, description, members, rules, banner } = useMemo(
    () => communityData || {},
    [communityData]
  );

  const bannerLoaded = useBannerLoading(banner);

  if (!communityData) {
    return (
      <div className="flex justify-center py-20">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8">
      {/* 1. Community Header Card */}
      <div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">{name}</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 px-4 py-2 bg-v-cyan/10 border border-v-cyan/20 rounded-full">
            <Users size={14} className="text-v-cyan" />
            <span className="text-[10px] font-black text-v-cyan uppercase tracking-widest">
              {members?.length || 0} Members
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/20">
             <Info size={14} />
          </div>
        </div>
      </div>

      {/* 2. Banner Preview */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-v-cyan to-v-yellow opacity-20 blur-lg rounded-2xl group-hover:opacity-40 transition-opacity" />
        <img
          src={bannerLoaded ? banner : placeholder}
          alt="community banner"
          className="relative w-full h-48 rounded-2xl object-cover border border-white/10"
          onError={(e) => {
            e.target.src = placeholder;
          }}
        />
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-v-ink/80 backdrop-blur-md rounded-lg border border-white/10 text-[8px] font-black text-white/40 uppercase tracking-widest">
           Community Preview
        </div>
      </div>

      {/* 3. Description */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-v-cyan opacity-20" />
        <h3 className="text-sm text-white/70 leading-relaxed font-medium italic">
          "{description || "No community description available."}"
        </h3>
      </div>

      {/* 4. Actions */}
      <div className="flex flex-col gap-4">
        {isModeratorOfThisCommunity ? (
          <Link
            to={`/community/${communityName}/moderator`}
            className="flex items-center justify-center gap-3 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-v-cyan hover:text-v-ink transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            <Shield size={14} />
            Manage Community
          </Link>
        ) : (
          <button
            onClick={toggleLeaveModal}
            className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-v-red/10 hover:text-v-red hover:border-v-red/30 transition-all active:scale-95 group"
          >
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
            Leave Community
          </button>
        )}
        <LeaveModal
          show={showLeaveModal}
          toggle={toggleLeaveModal}
          communityName={communityName}
        />
      </div>

      {/* 5. Rules Matrix */}
      {rules && rules.length > 0 && (
        <div className="pt-8 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6">
             <List size={14} className="text-v-yellow" />
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Community Rules</span>
          </div>
          <ul className="flex flex-col gap-4">
            {rules.map((rule, i) => (
              <motion.li 
                key={rule._id} 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 bg-white/[0.01] rounded-2xl border border-white/[0.03] group hover:border-v-yellow/20 transition-all cursor-default"
              >
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-v-yellow group-hover:bg-v-yellow group-hover:text-v-ink transition-all">
                   {i + 1}
                </div>
                <span className="text-[11px] text-white/60 font-medium leading-relaxed group-hover:text-white transition-colors">
                   {rule.rule}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Rightbar;
