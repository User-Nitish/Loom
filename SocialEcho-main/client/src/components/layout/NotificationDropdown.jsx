import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications, markAllRead, markRead } from "../../redux/actions/notification";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Bell, Check, Trash2 } from "lucide-react";

const NotificationDropdown = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (isOpen) {
      dispatch(getNotifications());
    }
  }, [dispatch, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Bell size={18} className="text-blue-400" />
          Notifications
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={() => dispatch(markAllRead())}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => dispatch(markRead(notification._id))}
              className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer transition-colors relative ${
                !notification.isRead ? "bg-blue-600/5" : ""
              }`}
            >
              <div className="flex gap-3">
                <img
                  src={notification.sender?.avatar || "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg"}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm text-slate-200">
                    <span className="font-bold text-white">{notification.sender?.name}</span>{" "}
                    {notification.type === "like" && "liked your post"}
                    {notification.type === "comment" && "commented on your post"}
                    {notification.type === "follow" && "started following you"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-3 text-center bg-slate-800/20">
        <button className="text-xs text-slate-400 hover:text-white transition-colors">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
