
import React, { useState, useEffect } from 'react';
import { AppUser, Notification } from '../types';
import { api } from '../services/api';

interface LayoutProps {
  user: AppUser | null;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (user) {
      const load = async () => {
        const data = await api.getNotifications(user.id);
        setNotifications(data);
      };
      load();
      const interval = setInterval(load, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRead = async (id: string) => {
    await api.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => window.location.reload()}>
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 group-hover:rotate-6 transition-transform duration-500">
                <span className="text-white font-black text-3xl">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">CampusConnect</span>
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-1.5 opacity-80">University Nexus</span>
              </div>
            </div>

            {user && (
              <div className="flex items-center space-x-6">
                {/* Notification Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifs(!showNotifs)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all relative group"
                  >
                    <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifs && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowNotifs(false)}></div>
                      <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-20 animate-in slide-in-from-top-4 duration-300">
                        <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                          <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Inbox</h4>
                          <span className="text-[10px] font-bold text-slate-400">{notifications.length} Messages</span>
                        </div>
                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                          {notifications.length === 0 ? (
                            <div className="p-10 text-center text-slate-300 text-sm italic">Clear sky! No notifications.</div>
                          ) : (
                            notifications.map(n => (
                              <div 
                                key={n.id} 
                                onClick={() => handleRead(n.id)}
                                className={`p-5 border-b border-slate-50 cursor-pointer transition-colors ${n.read ? 'bg-white opacity-60' : 'bg-indigo-50/30 hover:bg-indigo-50'}`}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <h5 className="font-bold text-sm text-slate-900">{n.title}</h5>
                                  {!n.read && <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>}
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed mb-2">{n.message}</p>
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="text-right hidden sm:block">
                  <p className="text-base font-black text-slate-900 tracking-tight leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">{user.role}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="px-6 py-2.5 text-[10px] font-black text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all uppercase tracking-widest border border-slate-100"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 py-16 bg-[#fcfdfe]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">C</div>
              <span className="font-black tracking-tighter text-slate-900 text-lg">CampusConnect v5.0</span>
            </div>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em]">
              &copy; {new Date().getFullYear()} AI-Enhanced Smart Campus
            </p>
            <div className="flex space-x-8">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors">Documentation</span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors">Safety Protocols</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
