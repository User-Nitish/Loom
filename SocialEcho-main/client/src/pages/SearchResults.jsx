import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { Search as SearchIcon, Users, MessageSquare, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState({ users: [], posts: [], community: null, joinedCommunity: null });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const profile = JSON.parse(localStorage.getItem("profile"));
        const { data } = await axios.get(`http://localhost:4000/search?q=${query}`, {
          headers: { Authorization: `Bearer ${profile.accessToken}` }
        });
        setResults(data);
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 flex items-center gap-3 uppercase tracking-tighter">
          <SearchIcon className="text-v-cyan" size={24} />
          Results for "{query}"
        </h1>
        <div className="flex gap-2 sm:gap-4 mt-6 border-b border-white/5 overflow-x-auto no-scrollbar-mobile pb-1">
          {["all", "people", "posts", "communities"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-all relative capitalize ${
                activeTab === tab ? "text-blue-400" : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="searchTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {/* People Section */}
          {(activeTab === "all" || activeTab === "people") && results.users.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Users size={18} className="text-blue-400" />
                People
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.users.map((user) => (
                  <div key={user._id} className="relative group/card">
                    <Link
                      to={`/user/${user._id}`}
                      className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-all block"
                    >
                      <img src={user.avatar} className="w-12 h-12 rounded-full object-cover" alt="" />
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = `/chat?recipientId=${user._id}&name=${user.name}&avatar=${user.avatar}`;
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/5 text-white/20 opacity-0 group-hover/card:opacity-100 hover:text-v-cyan hover:bg-v-cyan/10 transition-all z-10"
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Communities Section */}
          {(activeTab === "all" || activeTab === "communities") && (results.community || results.joinedCommunity) && (
            <section>
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Globe size={18} className="text-green-400" />
                Communities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[results.joinedCommunity, results.community].filter(Boolean).map((com) => (
                  <Link
                    to={`/community/${com.name}`}
                    key={com._id}
                    className="group relative h-48 rounded-3xl overflow-hidden border border-white/5"
                  >
                    <img src={com.banner} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
                      <h4 className="text-xl font-bold text-white">{com.name}</h4>
                      <p className="text-xs text-slate-300 line-clamp-1 mt-1">{com.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Posts Section */}
          {(activeTab === "all" || activeTab === "posts") && results.posts.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare size={18} className="text-purple-400" />
                Posts
              </h2>
              <div className="space-y-4">
                {results.posts.map((post) => (
                  <Link
                    to={`/post/${post._id}`}
                    key={post._id}
                    className="p-6 bg-slate-900/40 border border-white/5 rounded-3xl flex items-center justify-between hover:bg-white/5 transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <img src={post.user.avatar} className="w-5 h-5 rounded-full" alt="" />
                        <span className="text-xs font-bold text-white">{post.user.name}</span>
                        <span className="text-[10px] text-slate-500">in</span>
                        <span className="text-xs font-bold text-blue-400">{post.community.name}</span>
                      </div>
                      <p className="text-sm text-slate-300">{post.content}</p>
                    </div>
                    <ArrowRight size={18} className="text-slate-600 group-hover:text-white" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {!results.users.length && !results.posts.length && !results.community && !results.joinedCommunity && (
            <div className="text-center py-20">
              <p className="text-slate-500">No results found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
