import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversations, getMessages, sendMessage, receiveMessage } from "../redux/actions/message";
import io from "socket.io-client";
import { Send, User, MessageCircle, Info, Hash, Zap, Search } from "lucide-react";
import { format } from "date-fns/format";
import { motion, AnimatePresence } from "framer-motion";

const socket = io(process.env.REACT_APP_API_URL || "http://localhost:4000");

const Chat = () => {
  const dispatch = useDispatch();
  const { conversations, activeMessages, loading } = useSelector((state) => state.messages);
  const userData = useSelector((state) => state.auth.userData);
  const user = userData;
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  useEffect(() => {
    if (selectedConversation) {
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
      conversationId: selectedConversation._id
    })).then((data) => {
      socket.emit("send_message", {
        ...data,
        conversationId: selectedConversation._id
      });
    });

    setNewMessage("");
  };

  if (!user) return <div className="p-20 text-center text-white/20 uppercase tracking-widest font-black">Syncing messages...</div>;

  return (
    <div className="flex h-[calc(100vh-160px)] bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative group">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-white/5 flex flex-col relative z-10 bg-white/[0.01]">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-2 uppercase tracking-tighter">
              <MessageCircle className="text-v-cyan" size={24} />
              Messages
            </h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
            <input 
              type="text" 
              placeholder="Search chats..."
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[10px] font-bold text-white uppercase tracking-widest focus:border-v-cyan/30 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {conversations.map((conv) => {
            const otherParticipant = conv.participants.find(p => p._id !== user._id);
            const isActive = selectedConversation?._id === conv._id;
            return (
              <motion.div
                key={conv._id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 flex gap-4 cursor-pointer transition-all rounded-[24px] border ${
                  isActive 
                    ? "bg-v-cyan text-v-ink border-v-cyan shadow-[0_10px_30px_rgba(27,206,220,0.2)]" 
                    : "bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="relative">
                  <img
                    src={otherParticipant?.avatar || "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg"}
                    className={`w-12 h-12 rounded-2xl object-cover border-2 ${isActive ? "border-v-ink/20" : "border-white/10"}`}
                    alt=""
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 ${isActive ? "border-v-cyan bg-v-ink" : "border-slate-900 bg-green-500"}`} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-xs font-black uppercase tracking-tighter truncate ${isActive ? "text-v-ink" : "text-white"}`}>
                      {otherParticipant?.name}
                    </h4>
                    <span className={`text-[8px] font-bold ${isActive ? "text-v-ink/40" : "text-white/20"}`}>
                      {format(new Date(conv.updatedAt), "HH:mm")}
                    </span>
                  </div>
                  <p className={`text-[10px] font-medium truncate ${isActive ? "text-v-ink/60" : "text-white/30"}`}>
                    {conv.lastMessage?.content || "No transmissions yet..."}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-v-cyan/5 blur-[120px] rounded-full -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-v-red/5 blur-[120px] rounded-full -ml-64 -mb-64" />
        </div>

        {selectedConversation ? (
          <>
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] relative z-10 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedConversation.participants.find(p => p._id !== user._id)?.avatar || "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg"}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white/10"
                    alt=""
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-4 border-slate-900 shadow-xl" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">
                    {selectedConversation.participants.find(p => p._id !== user._id)?.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                <Info size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6 relative z-10">
              <div className="flex justify-center mb-8">
                <span className="px-4 py-1 bg-white/5 rounded-full text-[9px] font-black text-white/20 uppercase tracking-[0.4em] border border-white/5">
                  End-to-End Encrypted
                </span>
              </div>

              {activeMessages.map((msg, index) => {
                const isMine = msg.sender._id === user._id || msg.sender === user._id;
                return (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: isMine ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`group relative max-w-[70%] p-5 rounded-[28px] ${
                      isMine 
                        ? "bg-v-cyan text-v-ink rounded-tr-none shadow-[0_15px_35px_rgba(27,206,220,0.2)]" 
                        : "bg-white/5 border border-white/5 text-white rounded-tl-none backdrop-blur-md"
                    }`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                      <div className={`flex items-center gap-2 mt-2 ${isMine ? "text-v-ink/40" : "text-white/20"}`}>
                        <span className="text-[9px] font-black uppercase tracking-tighter">
                          {format(new Date(msg.createdAt), "HH:mm")}
                        </span>
                        {isMine && <Zap size={10} className="text-v-ink/20" />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-8 relative z-10">
              <div className="flex gap-4 bg-white/5 border border-white/10 rounded-[28px] p-2 focus-within:border-v-cyan/50 focus-within:bg-white/[0.08] transition-all group shadow-inner">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="bg-transparent border-none outline-none flex-1 text-white text-sm font-medium px-4"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 bg-v-cyan text-v-ink rounded-[20px] flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-v-cyan/20"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-20">
            <div className="w-32 h-32 bg-v-cyan/10 rounded-[40px] border border-v-cyan/20 flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 bg-v-cyan/20 blur-3xl animate-pulse rounded-full" />
              <MessageCircle size={64} className="text-v-cyan relative z-10" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-[0.4em] mb-4">No Chat Selected</h3>
            <p className="text-sm text-white/20 font-medium text-center max-w-xs leading-relaxed capitalize">
              Select a conversation from the left to start messaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
