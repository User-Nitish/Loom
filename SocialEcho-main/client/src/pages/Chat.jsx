import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversations, getMessages, sendMessage, receiveMessage } from "../redux/actions/message";
import io from "socket.io-client";
import { Send, User, MessageCircle, Info, Hash, Zap, Search, MoreVertical, Paperclip, Smile, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const socket = io(process.env.REACT_APP_API_URL || "http://localhost:4000");

const Chat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { conversations, activeMessages, loading } = useSelector((state) => state.messages);
  const userData = useSelector((state) => state.auth.userData);
  const user = userData;
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const recipientId = location.state?.recipientId || searchParams.get("recipientId");
    const recipientName = location.state?.recipientName || searchParams.get("name");
    const recipientAvatar = location.state?.recipientAvatar || searchParams.get("avatar");

    if (recipientId) {
      const existingConv = conversations.find(conv =>
        conv.participants.some(p => p._id === recipientId)
      );

      if (existingConv) {
        setSelectedConversation(existingConv);
      } else if (recipientName && !selectedConversation) {
        setSelectedConversation({
          _id: "new",
          participants: [
            { _id: user._id, name: user.name, avatar: user.avatar },
            { _id: recipientId, name: recipientName, avatar: recipientAvatar }
          ],
          virtual: true
        });
      }
    }
  }, [location.state, location.search, conversations, user, selectedConversation]);

  useEffect(() => {
    if (selectedConversation && !selectedConversation.virtual) {
      dispatch(getMessages(selectedConversation._id));
      socket.emit("join_room", selectedConversation._id);
    }
  }, [dispatch, selectedConversation]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (selectedConversation && data.conversationId === selectedConversation._id) {
        dispatch(receiveMessage(data));
      }
    });

    return () => socket.off("receive_message");
  }, [dispatch, selectedConversation]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const recipientId = selectedConversation.participants.find(p => p._id !== user._id)._id;

    dispatch(sendMessage({
      recipientId,
      content: newMessage,
      conversationId: selectedConversation.virtual ? undefined : selectedConversation._id
    })).then((data) => {
      if (selectedConversation.virtual) {
        dispatch(getConversations());
      } else {
        socket.emit("send_message", {
          ...data,
          conversationId: selectedConversation._id
        });
      }
    });

    setNewMessage("");
  };

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants.find(p => p._id !== user._id);
    return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!user) return <div className="p-20 text-center text-white/20 uppercase tracking-[1em] font-black animate-pulse">Synchronizing Data Stream...</div>;

  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[500px] bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-v-cyan/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] bg-v-red/10 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar - Conversations List (Hidden on mobile when chat is selected) */}
      <div className={`${selectedConversation ? "hidden md:flex" : "flex"} w-full md:w-64 lg:w-80 border-r border-white/5 flex-col relative z-10 bg-black/20 backdrop-blur-xl`}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
              <div className="p-2 bg-v-cyan/20 rounded-xl">
                <MessageCircle className="text-v-cyan" size={20} />
              </div>
              Messages
            </h2>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-v-cyan transition-colors" size={14} />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-[11px] font-bold text-white uppercase tracking-widest focus:border-v-cyan/30 focus:bg-white/[0.08] outline-none transition-all placeholder:text-white/10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {selectedConversation?.virtual && !conversations.some(c => c.participants.some(p => p._id === selectedConversation.participants.find(p => p._id !== user._id)._id)) && (
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-4 flex gap-4 cursor-pointer transition-all rounded-3xl border bg-v-cyan text-v-ink border-v-cyan shadow-[0_15px_40px_rgba(27,206,220,0.3)]"
              >
                <div className="relative shrink-0">
                  <img
                    src={selectedConversation.participants.find(p => p._id !== user._id)?.avatar || "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg"}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-v-ink/20"
                    alt=""
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-v-cyan bg-v-ink" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-black uppercase tracking-tighter truncate text-v-ink">
                      {selectedConversation.participants.find(p => p._id !== user._id)?.name}
                    </h4>
                  </div>
                  <p className="text-[10px] font-bold truncate text-v-ink/50 uppercase tracking-widest">
                    New Message...
                  </p>
                </div>
              </motion.div>
            )}

            {filteredConversations.map((conv) => {
              const otherParticipant = conv.participants.find(p => p._id !== user._id);
              const isActive = selectedConversation?._id === conv._id;
              return (
                <motion.div
                  key={conv._id}
                  layout
                  whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 flex gap-4 cursor-pointer transition-all rounded-3xl border ${isActive
                    ? "bg-white/[0.08] border-v-cyan/50 shadow-[0_0_20px_rgba(27,206,220,0.15)] text-white"
                    : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/10"
                    }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={otherParticipant?.avatar || "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg"}
                      className={`w-12 h-12 rounded-2xl object-cover border-2 ${isActive ? "border-v-cyan/30" : "border-white/10"}`}
                      alt=""
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 ${isActive ? "border-v-cyan/20 bg-v-cyan shadow-[0_0_10px_rgba(27,206,220,0.5)]" : "border-black/50 bg-green-500"}`} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-[11px] font-black uppercase tracking-tighter truncate ${isActive ? "text-v-cyan text-glow" : "text-zinc-100 group-hover:text-white"}`}>
                        {otherParticipant?.name}
                      </h4>
                      {conv.updatedAt && (
                        <span className={`text-[8px] font-bold shrink-0 ${isActive ? "text-v-cyan/40" : "text-white/20"}`}>
                          {format(new Date(conv.updatedAt), "HH:mm")}
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] font-medium truncate ${isActive ? "text-white/70" : "text-zinc-400 group-hover:text-zinc-300"}`}>
                      {conv.lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Chat Window */}
      <div className={`${selectedConversation ? "flex" : "hidden md:flex"} flex-1 flex flex-col relative overflow-hidden bg-black/10`}>
        {selectedConversation ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] relative z-10 backdrop-blur-2xl">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 bg-white/5 rounded-xl text-white/40 hover:text-white"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="relative">
                  <img
                    src={selectedConversation.participants.find(p => p._id !== user._id)?.avatar || "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg"}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover border-2 border-white/10 shadow-2xl"
                    alt=""
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 border-2 sm:border-4 border-black/80 shadow-xl" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-widest truncate max-w-[120px] sm:max-w-none">
                    {selectedConversation.participants.find(p => p._id !== user._id)?.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] sm:text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Live</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="hidden sm:flex w-10 h-10 rounded-xl bg-white/5 items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                  <Search size={18} />
                </button>
                <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                  <Info size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 space-y-6 relative z-10">
              {selectedConversation.virtual ? (
                <div className="flex flex-col items-center justify-center h-[60%] opacity-10">
                  <Zap size={64} className="mb-6 text-v-cyan" />
                  <p className="text-xs font-black uppercase tracking-[0.8em]">Start Chat</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeMessages.map((msg, index) => {
                    const isMine = msg.sender._id === user._id || msg.sender === user._id;
                    const showDate = index === 0 || format(new Date(activeMessages[index - 1].createdAt), 'yyyy-MM-dd') !== format(new Date(msg.createdAt), 'yyyy-MM-dd');

                    return (
                      <React.Fragment key={msg._id || index}>
                        {showDate && (
                          <div className="flex justify-center my-8">
                            <span className="text-[8px] sm:text-[9px] font-black text-white/10 uppercase tracking-[0.4em] px-4 py-1 border border-white/5 rounded-lg">
                              {format(new Date(msg.createdAt), "dd MMM yyyy")}
                            </span>
                          </div>
                        )}
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`group relative max-w-[85%] sm:max-w-[80%] p-4 sm:p-5 rounded-[24px] sm:rounded-[28px] ${isMine
                            ? "bg-gradient-to-br from-v-cyan to-v-cyan/80 text-black rounded-tr-none shadow-lg"
                            : "bg-white/[0.05] border border-white/10 text-white rounded-tl-none backdrop-blur-xl"
                            }`}>
                            <p className="text-xs sm:text-[13px] font-medium leading-relaxed tracking-wide select-text">{msg.content}</p>
                            <div className={`flex items-center gap-2 mt-2 ${isMine ? "text-black/40" : "text-white/20"}`}>
                              <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest">
                                {format(new Date(msg.createdAt), "HH:mm")}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={scrollRef} className="h-4" />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 sm:p-6 relative z-10 mt-auto">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 sm:gap-3 bg-white/[0.03] border border-white/10 rounded-full sm:rounded-[32px] p-1.5 sm:p-2 focus-within:border-v-cyan/50 focus-within:bg-white/[0.08] transition-all backdrop-blur-xl">
                  <div className="hidden sm:flex gap-1 ml-2">
                    <button type="button" className="p-2 text-white/20 hover:text-v-cyan transition-colors">
                      <Paperclip size={18} />
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Message..."
                    className="bg-transparent border-none outline-none flex-1 text-white text-xs sm:text-[13px] font-bold px-4 py-2 sm:py-3 placeholder:text-white/10 uppercase tracking-widest"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />

                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-v-cyan text-v-ink rounded-full sm:rounded-[24px] flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 shadow-xl"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-10 sm:p-20 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 sm:w-40 sm:h-40 bg-v-cyan/5 rounded-[40px] sm:rounded-[50px] border border-v-cyan/10 flex items-center justify-center mb-8 sm:mb-12"
            >
              <MessageCircle size={60} className="text-v-cyan" />
            </motion.div>
            <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-[0.4em] sm:tracking-[0.6em] mb-4 sm:mb-6">Select a Chat</h3>
            <p className="text-[9px] sm:text-[10px] text-white/20 font-bold max-w-xs leading-loose uppercase tracking-[0.4em]">
              Choose a conversation to begin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
