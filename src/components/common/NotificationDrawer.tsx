import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCheck, Bell, AlertTriangle, FileText, CheckCircle2, Trash2 } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { 
    isNotificationOpen, 
    setIsNotificationOpen, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    setSelectedProjectId,
    setSelectedComplaintId,
    setActiveTab
  } = useApp();

  if (!isNotificationOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    setIsNotificationOpen(false);

    if (notif.category === 'project' && notif.linkId) {
      setSelectedProjectId(notif.linkId);
      setActiveTab('project-detail');
    } else if (notif.category === 'complaint' && notif.linkId) {
      setSelectedComplaintId(notif.linkId);
      setActiveTab('issues');
    } else if (notif.category === 'waste') {
      setActiveTab('waste');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications Drawer"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Civic Notifications</h2>
              <p className="text-xs text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-emerald-50 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck size={14} />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Bell size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => {
              let Icon = Bell;
              let iconColor = 'text-slate-500 bg-slate-100';

              if (notif.category === 'complaint') {
                Icon = AlertTriangle;
                iconColor = 'text-amber-600 bg-amber-50';
              } else if (notif.category === 'project') {
                Icon = FileText;
                iconColor = 'text-emerald-600 bg-emerald-50';
              } else if (notif.category === 'waste') {
                Icon = Trash2;
                iconColor = 'text-orange-600 bg-orange-50';
              }

              return (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`w-full text-left p-4 rounded-lg transition-colors flex items-start gap-3.5 hover:bg-slate-50 relative ${
                    !notif.isRead ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 absolute top-4 left-2" />
                  )}

                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconColor} ml-1`}>
                    <Icon size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h3 className={`text-sm ${!notif.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'} truncate`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs text-slate-400 shrink-0 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.targetDistrict && (
                      <span className="inline-block mt-2 text-xs font-medium text-slate-500">
                        District: {notif.targetDistrict}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 text-center text-xs text-slate-500">
          Showing real-time simulated city alert stream for Karachi.
        </div>
      </div>
    </div>
  );
};
