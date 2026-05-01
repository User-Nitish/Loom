import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import debounce from "lodash/debounce";
import JoinModal from "../modals/JoinModal";
import { 
  Search as SearchIcon, 
  X, 
  User, 
  FileText, 
  Users, 
  Loader2,
  ExternalLink
} from "lucide-react";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const Search = ({ onClose }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [community, setCommunity] = useState(null);
  const [joinedCommunity, setJoinedCommunity] = useState(null);
  const [loading, setLoading] = useState(false);
  const accessToken = JSON.parse(localStorage.getItem("profile"))?.accessToken;
  
  const setInitialValue = () => {
    setUsers([]);
    setPosts([]);
    setCommunity(null);
    setJoinedCommunity(null);
    setLoading(false);
  };

  const debouncedHandleSearch = useMemo(
    () =>
      debounce((q) => {
        setLoading(true);
        const encodedQuery = encodeURIComponent(q);
        axios
          .get(`${BASE_URL}/search?q=${encodedQuery}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            const data = res.data || {};
            setPosts(data.posts || []);
            setUsers(data.users || []);
            setCommunity(data.community || null);
            setJoinedCommunity(data.joinedCommunity || null);
            setLoading(false);
          })
          .catch(() => {
            setInitialValue();
          });
      }, 800),
    [accessToken]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setInitialValue();
      return;
    }

    debouncedHandleSearch(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue)}`);
      onClose && onClose();
    }
  };

  const clearValues = () => {
    setInitialValue();
    setInputValue("");
  };

  useEffect(() => {
    return () => {
      setInitialValue();
    };
  }, []);

  const [joinModalVisibility, setJoinModalVisibility] = useState(false);
  const toggleModal = () => {
    setJoinModalVisibility((prev) => !prev);
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-white/20 group-focus-within:text-v-yellow transition-colors" />
        </div>
        <input
          type="text"
          id="search"
          autoFocus
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search the fabric..."
          className="w-full bg-white/[0.03] border border-white/10 rounded-[28px] py-4 pl-14 pr-12 text-sm font-medium text-white placeholder:text-white/20 focus:border-white/40 focus:bg-white/[0.08] focus:outline-none transition-all shadow-inner"
          aria-label="Search"
          autoComplete="off"
        />
        <AnimatePresence>
          {inputValue !== "" && (
            <motion.button
              className="absolute inset-y-0 right-0 pr-6 flex items-center"
              onClick={clearValues}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <X className="h-4 w-4 text-white/20 hover:text-v-red transition-colors" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {inputValue !== "" && (
          <motion.div
            className="mt-4 max-h-[500px] overflow-y-auto custom-scrollbar"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <Loader2 size={24} className="text-v-yellow animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Weaving results...</span>
              </div>
            )}

            {/* Results Mapping */}
            <div className="space-y-2">
              {/* Posts Results */}
              {posts.length > 0 && (
                <div className="p-4">
                  <div className="px-2 mb-6 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                    Threads
                  </div>
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post?._id}
                        onClick={() => {
                          navigate(`/post/${post?._id}`);
                          clearValues();
                          onClose && onClose();
                        }}
                        className="group flex flex-col p-5 rounded-3xl hover:bg-white/[0.03] cursor-pointer transition-all border border-transparent hover:border-white/5"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <FileText size={14} className="text-white/40 group-hover:text-white transition-colors" />
                          <span className="text-sm font-bold text-white/90 group-hover:text-white transition-colors truncate">
                            {post?.title || "Shared Echo"}
                          </span>
                        </div>
                        <p className="text-xs text-white/40 line-clamp-2 leading-relaxed mb-4">
                          {post?.content}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-white/40 uppercase">
                              {post.user?.name || "Unknown"}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                              {post.community?.name || "Global"}
                            </span>
                          </div>
                          <ExternalLink size={12} className="text-white/10 group-hover:text-white transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users Results */}
              {users.length > 0 && (
                <div className="p-4">
                  <div className="px-2 mb-6 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                    Weavers
                  </div>
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div
                        key={user?._id}
                        onClick={() => {
                          navigate(`/user/${user?._id}`);
                          clearValues();
                          onClose && onClose();
                        }}
                        className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-all border border-transparent hover:border-white/5"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={user?.avatar}
                            alt={user?.name}
                            className="h-10 w-10 rounded-full object-cover border border-white/10 grayscale hover:grayscale-0 transition-all"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">
                              {user?.name}
                            </span>
                            <span className="text-[10px] text-white/20 font-medium">{user?.email}</span>
                          </div>
                        </div>
                        <User size={14} className="text-white/10 group-hover:text-white transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Community Results */}
              {(community || joinedCommunity) && (
                <div className="p-4">
                  <div className="px-2 mb-6 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                    Nodes
                  </div>
                  
                  {community && (
                    <div className="group p-5 rounded-3xl bg-white/5 border border-white/10 mb-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={community?.banner}
                          alt={community?.name}
                          className="h-14 w-14 rounded-2xl object-cover border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-white/40" />
                              <span className="text-sm font-bold text-white uppercase tracking-widest">{community?.name}</span>
                            </div>
                            {!community?.isMember && (
                              <button
                                className="px-4 py-1.5 bg-white text-v-ink text-[10px] font-black uppercase rounded-full hover:scale-105 active:scale-95 transition-transform"
                                onClick={() => toggleModal(true)}
                              >
                                Join
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                            {community?.description}
                          </p>
                        </div>
                      </div>
                      <JoinModal
                        show={joinModalVisibility}
                        onClose={() => {
                          toggleModal(false);
                          setCommunity(null);
                        }}
                        community={community}
                      />
                    </div>
                  )}

                  {joinedCommunity && (
                    <div
                      onClick={() => {
                        navigate(`/community/${joinedCommunity.name}`);
                        clearValues();
                        onClose && onClose();
                      }}
                      className="group flex items-center gap-4 p-5 rounded-3xl hover:bg-white/[0.03] cursor-pointer transition-all border border-transparent hover:border-white/5"
                    >
                      <img
                        src={joinedCommunity?.banner}
                        alt={joinedCommunity?.name}
                        className="h-14 w-14 rounded-2xl object-cover border border-white/10 grayscale hover:grayscale-0 transition-all"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <Users size={14} className="text-white/20 group-hover:text-white transition-colors" />
                          <span className="text-sm font-bold text-white group-hover:text-white transition-colors uppercase tracking-widest">
                            {joinedCommunity?.name}
                          </span>
                          <span className="text-[9px] font-black bg-white/10 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Member</span>
                        </div>
                        <p className="text-xs text-white/40 truncate">
                          {joinedCommunity?.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* No Results */}
            {!loading && posts.length === 0 && users.length === 0 && !community && !joinedCommunity && (
              <div className="text-center py-20">
                <SearchIcon className="h-12 w-12 text-white/5 mx-auto mb-6" />
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">No resonances found</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
