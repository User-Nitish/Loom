import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications, markAllRead, markRead } from "../../redux/actions/notification";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, Heart, MessageCircle, UserPlus, Info, CheckCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NotificationDropdown = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (isOpen) {
      dispatch(getNotifications());
    }
  }, [dispatch, isOpen]);

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart size={14} className="text-orange-500 fill-orange-500/20" />;
      case "comment":
        return <MessageCircle size={14} className="text-amber-400" />;
      case "follow":
        return <UserPlus size={14} className="text-yellow-400" />;
      default:
        return <Info size={14} className="text-zinc-400" />;
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "follow":
        return "started following you";
      default:
        return "interacted with you";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-[88px] md:top-full md:bottom-auto left-4 right-4 md:absolute md:right-0 md:left-auto md:mt-3 md:w-[400px] bg-[#0a0a0a] z-[110] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,1)] border border-white/10 rounded-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#111111]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell size={20} className="text-amber-500" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 border-2 border-[#0c0c0c] rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  )}
                </div>
                <h3 className="text-zinc-100 font-black tracking-[0.2em] uppercase text-[10px]">Tactical Feed</h3>
                {unreadCount > 0 && (
                  <span className="bg-amber-500 text-[#0c0c0c] text-[10px] font-black px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                    {unreadCount}
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={() => dispatch(markAllRead())}
                  className="group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-zinc-500 hover:text-amber-500 transition-all duration-300"
                >
                  <CheckCircle size={12} className="group-hover:scale-110 transition-transform" />
                  Clear Data
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-20 px-8 flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                    <Sparkles className="text-white/10" size={32} />
                  </div>
                  <div>
                    <p className="text-zinc-400 font-medium text-xs uppercase tracking-widest font-black">Zero Activity</p>
                    <p className="text-zinc-600 text-[10px] mt-1">Standby for incoming signals.</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((notification, index) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      key={notification._id}
                      onClick={() => {
                        dispatch(markRead(notification._id));
                      }}
                      className={`group p-4 flex gap-4 hover:bg-white/[0.04] cursor-pointer transition-all relative border-b border-white/[0.02] last:border-0 ${!notification.isRead ? "bg-amber-500/[0.03]" : ""
                        }`}
                    >
                      {!notification.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-amber-500" />
                      )}

                      <div className="relative shrink-0">
                        <img
                          src={notification.sender?.avatar || "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg"}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all border border-white/5"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded bg-[#0c0c0c] border border-white/10 flex items-center justify-center shadow-lg">
                          {getIcon(notification.type)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-zinc-200 leading-relaxed">
                          <span className="font-bold text-white group-hover:text-amber-500 transition-colors uppercase tracking-tight">
                            {notification.sender?.name}
                          </span>{" "}
                          <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                            {getNotificationText(notification)}
                          </span>
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>

                      {!notification.isRead && (
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shadow-[0_0_8px_rgba(245,158,11,1)]" />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/5 bg-white/[0.01] flex justify-center">
              <button className="w-full py-2 px-4 rounded border border-white/5 text-[10px] font-black text-zinc-400 hover:bg-white/5 hover:text-amber-500 transition-all duration-300 tracking-widest uppercase">
                Access All Channels
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

  );
};

export default NotificationDropdown;


