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

const BASE_URL = process.env.REACT_APP_API_URL;

const Search = () => {
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
            const { posts, users, community, joinedCommunity } = res.data;
            setPosts(posts);
            setUsers(users);
            setCommunity(community);
            setJoinedCommunity(joinedCommunity);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
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
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-4 w-4 text-white/20 group-focus-within:text-v-cyan transition-colors" />
        </div>
        <motion.input
          type="text"
          id="search"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="SEARCH FREQUENCIES..."
          className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-10 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white placeholder:text-white/10 focus:border-v-cyan/30 focus:bg-black/60 focus:outline-none transition-all"
          aria-label="Search"
          autoComplete="off"
        />
        <AnimatePresence>
          {inputValue !== "" && (
            <motion.button
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={clearValues}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-4 w-4 text-white/20 hover:text-v-red transition-colors" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {inputValue !== "" && (
          <motion.div
            className="absolute top-14 left-0 right-0 md:left-auto md:right-0 md:w-[450px] glass-card rounded-2xl border border-white/10 shadow-2xl max-h-[500px] overflow-y-auto z-50 custom-scrollbar"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={24} className="text-v-cyan animate-spin" />
                <span className="ml-4 text-[10px] font-mono font-black uppercase tracking-[0.3em] text-v-cyan/60">Scanning Signals...</span>
              </div>
            )}

            {/* Results Mapping */}
            <div className="divide-y divide-white/5">
              {/* Posts Results */}
              {posts.length > 0 && (
                <div className="p-4">
                  <div className="px-2 mb-4 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                    Transmissions
                  </div>
                  <div className="space-y-2">
                    {posts.map((post) => (
                      <div
                        key={post._id}
                        onClick={() => {
                          navigate(`/post/${post._id}`);
                          clearValues();
                        }}
                        className="group flex flex-col p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <FileText size={14} className="text-v-cyan/40 group-hover:text-v-cyan transition-colors" />
                          <span className="text-xs font-bold text-white/90 group-hover:text-v-cyan transition-colors truncate">
                            {post.title || "UNTITLED_DATA"}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/30 truncate uppercase tracking-widest mb-3">
                          {post.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold text-white/20 uppercase">
                              IDENT: {post.user.name}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/5" />
                            <span className="text-[9px] font-mono font-bold text-v-cyan/40 uppercase">
                              LOC: {post.community.name}
                            </span>
                          </div>
                          <ExternalLink size={10} className="text-white/10 group-hover:text-v-cyan transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users Results */}
              {users.length > 0 && (
                <div className="p-4">
                  <div className="px-2 mb-4 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                    Identities
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {users.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => {
                          navigate(`/user/${user._id}`);
                          clearValues();
                        }}
                        className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5"
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-lg object-cover border border-white/10 grayscale-[0.5] group-hover:grayscale-0 transition-all"
                        />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <User size={12} className="text-v-cyan/40" />
                            <span className="text-xs font-black text-white/80 group-hover:text-v-cyan truncate uppercase tracking-tighter">
                              {user.name}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-white/20 truncate uppercase">{user.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Community Results */}
              {(community || joinedCommunity) && (
                <div className="p-4">
                  <div className="px-2 mb-4 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                    Territories
                  </div>
                  
                  {community && (
                    <div className="group p-4 rounded-xl bg-v-cyan/5 border border-v-cyan/20 mb-2">
                      <div className="flex items-start gap-4">
                        <img
                          src={community.banner}
                          alt={community.name}
                          className="h-12 w-12 rounded-xl object-cover border border-v-cyan/30"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-v-cyan" />
                              <span className="text-xs font-black text-v-cyan uppercase tracking-widest">{community.name}</span>
                            </div>
                            {!community.isMember && (
                              <button
                                className="px-3 py-1 bg-v-cyan text-v-ink text-[9px] font-black uppercase rounded-lg hover:scale-105 active:scale-95 transition-transform"
                                onClick={() => toggleModal(true)}
                              >
                                Join
                              </button>
                            )}
                          </div>
                          <p className="text-[10px] text-white/40 line-clamp-2 uppercase tracking-tight">
                            {community.description}
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
                      }}
                      className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5"
                    >
                      <img
                        src={joinedCommunity.banner}
                        alt={joinedCommunity.name}
                        className="h-12 w-12 rounded-xl object-cover border border-white/10 grayscale-[0.5] group-hover:grayscale-0 transition-all"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Users size={14} className="text-v-cyan/40 group-hover:text-v-cyan" />
                          <span className="text-xs font-black text-white/80 group-hover:text-v-cyan uppercase tracking-widest">
                            {joinedCommunity.name}
                          </span>
                          <span className="text-[8px] font-mono font-black bg-v-cyan/20 text-v-cyan px-1.5 py-0.5 rounded border border-v-cyan/30 uppercase">Member</span>
                        </div>
                        <p className="text-[10px] text-white/30 truncate uppercase tracking-tight">
                          {joinedCommunity.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* No Results */}
            {!loading && posts.length === 0 && users.length === 0 && !community && !joinedCommunity && (
              <div className="text-center py-16">
                <SearchIcon className="h-12 w-12 text-white/5 mx-auto mb-4" />
                <p className="text-[10px] font-mono font-black text-white/20 uppercase tracking-[0.3em]">No valid frequencies detected</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
;
