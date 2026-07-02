import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAllRead } from '../../store/slices/notificationSlice';

const NotificationsDropdown = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(s => s.notifications);

  return (
    <div className="w-80 bg-white rounded-2xl shadow-xl border p-2">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <p className="font-bold">Notifications</p>
        <button onClick={() => dispatch(markAllRead())} className="text-xs text-slate-500">Mark all read</button>
      </div>
      <div className="max-h-64 overflow-y-auto p-2">
        {notifications.length === 0 && <p className="text-xs text-slate-400">No notifications</p>}
        {notifications.map((n, i) => (
          <div key={i} className={`p-2 rounded-xl ${!n.isRead ? 'bg-emerald-50' : ''}`}>
            <p className="text-sm font-semibold">{n.title || 'Notification'}</p>
            <p className="text-xs text-slate-500">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsDropdown;