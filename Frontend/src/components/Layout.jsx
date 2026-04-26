import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SupportModal from './SupportModal';
import { supportAPI } from '../services/api';
import toast from 'react-hot-toast';

const Layout = ({ children, user, setUser }) => {
  const [showSupport, setShowSupport] = useState(false);
  const [unread, setUnread] = useState(0);

  const isUser = user?.role === 'user';
  const isVendor = user?.role === 'vendor';

  useEffect(() => {
    if (!user || (!isUser && !isVendor)) return;

    const tsKey = isVendor ? 'vendor_support_ts' : 'user_support_ts';
    const checkUnread = async () => {
      try {
        const res = await supportAPI.getMyTickets();
        const responded = res.data.filter(t => t.response);

        // get latest updated_at among responded tickets
        const latestTs = responded.length > 0
          ? Math.max(...responded.map(t => new Date(t.updated_at).getTime()))
          : 0;

        const prevTs = parseInt(localStorage.getItem(tsKey) || '0');

        if (latestTs > prevTs) {
          toast(msg, { icon: '🔔', duration: 6000, id: 'support-reply' });
          setUnread(responded.length);
        }
      } catch {}
    };

    checkUnread();
    const interval = setInterval(checkUnread, 30000);
    window.addEventListener('focus', checkUnread);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkUnread);
    };
  }, [user]);

  const handleOpen = async () => {
    setShowSupport(true);
    try {
      const res = await supportAPI.getMyTickets();
      const tsKey = isVendor ? 'vendor_support_ts' : 'user_support_ts';
      const responded = res.data.filter(t => t.response);
      const latestTs = responded.length > 0
        ? Math.max(...responded.map(t => new Date(t.updated_at).getTime()))
        : Date.now();
      localStorage.setItem(tsKey, latestTs);
      setUnread(0);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} setUser={setUser} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />

      {(isUser || isVendor) && (
        <>
          <div className="fixed bottom-6 right-6 z-50">
            <span className="relative inline-block">
              {unread > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center z-10">
                  {unread}
                </span>
              )}
              <button
                onClick={handleOpen}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 px-4 py-3 font-semibold text-sm"
              >
                <span className="text-lg">🎧</span>
                Support
              </button>
            </span>
          </div>

          {showSupport && (
            <SupportModal onClose={() => setShowSupport(false)} role={user.role} />
          )}
        </>
      )}
    </div>
  );
};

export default Layout;
