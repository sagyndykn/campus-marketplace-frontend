import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { MarketProvider } from './context/MarketContext';
import Layout from './components/Layout';
import { logout as apiLogout } from './api/auth';

import AuthPage from './pages/auth/AuthPage';
import OtpPage from './pages/auth/OtpPage';
import Index from './pages/Index';
import Wishlist from './pages/Wishlist';
import AddListing from './pages/AddListing';
import Chat from './pages/Chat';
import ChatDialog from './pages/ChatDialog';
import Profile from './pages/Profile';

function AuthFlow({ onLogin }) {
  const [view, setView] = useState('auth');
  const [pendingEmail, setPendingEmail] = useState('');

  const handleOtpSent = (email) => {
    setPendingEmail(email);
    setView('otp');
  };

  const handleOtpSuccess = (res) => {
    onLogin({ email: res.email, role: res.role });
  };

  if (view === 'otp') {
    return <OtpPage email={pendingEmail} onSuccess={handleOtpSuccess} onBack={() => setView('auth')} />;
  }
  return <AuthPage onOtpSent={handleOtpSent} onLogin={onLogin} />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('user');
    if (token && saved) {
      setUser(JSON.parse(saved));
    }
    setChecked(true);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    if (token) apiLogout(token).catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!checked) return null;

  if (!user) {
    return (
      <>
        <AuthFlow onLogin={handleLogin} />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  return (
    <MarketProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/add" element={<AddListing />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:id" element={<ChatDialog />} />
            <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </MarketProvider>
  );
}
