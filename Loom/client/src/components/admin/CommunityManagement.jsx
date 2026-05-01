import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCommunitiesAction,
  getModeratorsAction,
  addModeratorAction,
  removeModeratorAction,
  getCommunityAction,
} from "../../redux/actions/adminActions";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";

const CommunityManagement = () => {
  const dispatch = useDispatch();
  const communities = useSelector((state) => state.admin?.communities);
  const moderators = useSelector((state) => state.admin?.moderators);
  const community = useSelector((state) => state.admin?.community);

  useEffect(() => {
    dispatch(getCommunitiesAction());
    dispatch(getModeratorsAction());
  }, [dispatch]);

  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedCommunityData, setSelectedCommunityData] = useState(null);
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [newModerator, setNewModerator] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingCommunity, setIsChangingCommunity] = useState(false);

  const handleCommunitySelect = async (community) => {
    setSelectedCommunity(community);
    setIsChangingCommunity(true);
    await dispatch(getCommunityAction(community._id));
    setIsChangingCommunity(false);
  };

  useEffect(() => {
    setSelectedCommunityData(community);
  }, [community]);

  const handleModeratorSelect = (moderator) => {
    setSelectedModerator(moderator);
  };

  const handleRemoveModerator = async (moderator) => {
    setIsUpdating(true);
    await dispatch(
      removeModeratorAction(selectedCommunityData._id, moderator._id)
    );
    await dispatch(getCommunityAction(selectedCommunityData._id));
    await dispatch(getModeratorsAction());
    setIsUpdating(false);
  };

  const handleAddModerator = async () => {
    setIsUpdating(true);
    await dispatch(addModeratorAction(selectedCommunityData._id, newModerator));
    await dispatch(getCommunityAction(selectedCommunityData._id));
    await dispatch(getModeratorsAction());
    setNewModerator("");
    setIsUpdating(false);
  };

  if (!communities || !moderators) {
    return (
      <div className="flex items-center justify-center py-20 text-v-cyan font-black uppercase tracking-[0.4em] animate-pulse">
        Loading_Communities...
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto mt-8 min-h-[70vh] text-white selection:bg-v-cyan/30">
      {/* Left Column - Directory */}
      <div className="flex flex-col w-full lg:w-1/3 glass-card !bg-black/40 border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <h1 className="text-xl font-black uppercase tracking-tighter font-display">
            Community List
          </h1>
          <p className="text-v-cyan text-[10px] font-black uppercase tracking-[0.4em] mt-1">
            Browse All Communities
          </p>
        </div>
        <div className="flex flex-col overflow-y-auto custom-scrollbar max-h-[60vh]">
          {communities.map((community) => (
            <div
              key={community._id}
              className={`p-4 cursor-pointer transition-all border-b border-white/5 flex items-center group ${
                selectedCommunity?._id === community._id 
                  ? "bg-v-cyan/10 border-l-4 border-l-v-cyan pl-6" 
                  : "hover:bg-white/[0.03] pl-4"
              }`}
              onClick={() => handleCommunitySelect(community)}
            >
              <img
                src={community.banner}
                alt={community.name}
                className="w-10 h-10 rounded-xl object-cover border border-white/10 group-hover:border-v-cyan/50 transition-colors"
              />
              <div className="ml-4 overflow-hidden">
                <span className={`block text-sm font-bold truncate ${
                  selectedCommunity?._id === community._id ? "text-v-cyan" : "text-white/70"
                }`}>
                  {community.name}
                </span>
                <span className="text-[10px] font-mono text-white/20 uppercase">
                  ID: {community._id.slice(-8)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Terminal Details */}
      <div className="flex flex-col w-full lg:w-2/3 glass-card !bg-black/60 border border-white/5 shadow-2xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-v-red via-v-orange to-v-yellow opacity-40" />
        
        {isChangingCommunity ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <span className="animate-spin w-8 h-8 border-4 border-v-cyan/30 border-t-v-cyan rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-v-cyan italic animate-pulse">Loading_Details...</span>
          </div>
        ) : selectedCommunityData ? (
          <>
            <div className="flex flex-col md:flex-row md:items-end gap-6 border-b border-white/5 pb-8 mb-8">
              <div className="space-y-2 flex-1">
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase font-display italic">
                  {selectedCommunityData.name}
                </h1>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-v-cyan text-[10px] font-black uppercase tracking-widest bg-v-cyan/10 px-2 py-1 rounded">Moderators: {selectedCommunityData.moderatorCount}</span>
                    <span className="text-v-yellow text-[10px] font-black uppercase tracking-widest bg-v-yellow/10 px-2 py-1 rounded">Members: {selectedCommunityData.memberCount}</span>
                  </div>
                </div>
              </div>
              {isUpdating && (
                <div className="px-4 py-2 bg-v-yellow/10 border border-v-yellow/30 text-v-yellow text-[10px] font-black uppercase tracking-widest animate-pulse rounded-lg">
                  Applying Changes...
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Moderators list */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-1 bg-v-red rounded-full" />
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">Current Moderators</h2>
                </div>
                
                {selectedCommunityData.moderators?.length === 0 ? (
                  <p className="text-sm italic text-white/20 px-4">No operators assigned to this node.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedCommunityData.moderators?.map((moderator) => (
                      <div
                        key={moderator._id}
                        className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center group/row hover:bg-white/[0.05] transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img src={moderator.avatar} className="w-8 h-8 rounded-lg" alt="" />
                          <span className="font-bold text-white/80 group-hover/row:text-white transition-colors">{moderator.name}</span>
                        </div>
                        <button
                          disabled={isUpdating}
                          className="w-full sm:w-auto px-4 py-2 bg-v-red/10 border border-v-red/20 text-v-red text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-v-red hover:text-white transition-all shadow-lg active:scale-95"
                          onClick={() => handleRemoveModerator(moderator)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add moderator form */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-1 bg-v-cyan rounded-full" />
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">Add New Moderator</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <select
                      className="w-full bg-black/40 border border-white/5 text-white text-xs font-mono font-bold rounded-xl p-4 focus:border-v-cyan/50 outline-none appearance-none cursor-pointer"
                      value={newModerator}
                      onChange={(e) => setNewModerator(e.target.value)}
                    >
                      <option value="" className="bg-v-ink italic text-white/30">SELECT_POTENTIAL_OPERATOR</option>
                      {moderators?.map((moderator) => (
                        <option key={moderator._id} value={moderator._id} className="bg-v-ink">
                          {moderator.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    disabled={
                      !newModerator ||
                      isUpdating ||
                      selectedCommunityData.moderators?.find(
                        (moderator) => moderator._id === newModerator
                      )
                    }
                    className="w-full py-4 bg-v-cyan text-v-ink font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-v-yellow hover:scale-105 transition-all shadow-[0_10px_30px_rgba(27,206,220,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddModerator}
                  >
                    Assign Moderator
                  </button>
                  {newModerator && selectedCommunityData.moderators?.find(
                    (moderator) => moderator._id === newModerator
                  ) && (
                    <p className="text-[10px] text-v-red font-bold uppercase text-center">Node already possesses priority access</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-20">
            <div className="w-20 h-20 border-4 border-white/5 border-dashed rounded-full mb-6 animate-spin-slow flex items-center justify-center">
               <div className="w-10 h-10 bg-v-red/10 rounded-full animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-white/20 tracking-[0.3em] uppercase italic">
              Select a Community
            </h3>
            <p className="text-[10px] text-white/10 font-black uppercase tracking-widest mt-4 max-w-xs">
              Choose a community from the list to manage its settings and moderators.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityManagement;
