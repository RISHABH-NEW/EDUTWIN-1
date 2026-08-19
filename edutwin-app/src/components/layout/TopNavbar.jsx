import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SearchModal from '../search/SearchModal';

export default function TopNavbar({ onMenuToggle }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { notifications, markNotificationRead } = useApp();
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const typeColors = {
    success: 'bg-emerald-500',
    info: 'bg-primary-500',
    achievement: 'bg-amber-500',
    warning: 'bg-orange-500',
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-surface-200/60">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          {/* Left: Menu button (mobile) */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-surface-100 text-surface-500 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Center: Search (desktop) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface-50 border border-surface-200
              rounded-xl text-sm text-surface-400 hover:bg-surface-100 hover:border-surface-300
              transition-all duration-200 min-w-[280px]"
          >
            <Search className="w-4 h-4" />
            <span>Search topics, subjects, features...</span>
            <kbd className="ml-auto text-[10px] px-1.5 py-0.5 bg-surface-200 text-surface-500 rounded font-mono">
              Ctrl+K
            </kbd>
          </button>

          <div className="flex items-center gap-2">
            {/* Search (mobile) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-surface-100 text-surface-500 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl hover:bg-surface-100 text-surface-500 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px]
                    rounded-full flex items-center justify-center font-bold animate-scale-in">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-elevated
                  border border-surface-200/80 overflow-hidden animate-scale-in z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100">
                    <h3 className="text-sm font-semibold text-surface-900">Notifications</h3>
                    <button
                      onClick={() => {
                        notifications.forEach(n => markNotificationRead(n.id));
                      }}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-surface-400">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-surface-50 cursor-pointer
                            transition-colors border-b border-surface-50 last:border-0
                            ${!notif.read ? 'bg-primary-50/30' : ''}`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${typeColors[notif.type] || 'bg-surface-300'}`} />
                          <div className="min-w-0">
                            <p className={`text-sm leading-snug ${!notif.read ? 'text-surface-800 font-medium' : 'text-surface-600'}`}>
                              {notif.text}
                            </p>
                            <p className="text-xs text-surface-400 mt-0.5">{notif.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
