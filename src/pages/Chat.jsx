import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Loader, ChevronRight, Search, X } from 'lucide-react';
import { getConversations, startConversation, searchUsers } from '../api/chat';
import { toast } from 'sonner';

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export default function Chat() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // search state
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [starting, setStarting] = useState(null); // userId being opened
  const debounceRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    getConversations()
      .then(setConversations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchUsers(query.trim());
        setSearchResults(results);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleOpenChat = async (user) => {
    setStarting(user.id);
    try {
      const conv = await startConversation(user.id);
      navigate(`/chat/${conv.id}`, {
        state: { otherUserId: conv.otherUserId, otherUserName: conv.otherUserName },
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setStarting(null);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
  };

  const showSearch = query.trim().length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24 md:pb-8">
      <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>Сообщения</h1>

      {/* Search bar */}
      <div className="relative mb-4" ref={searchRef}>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ border: '1.5px solid var(--border)', backgroundColor: '#f8fafc' }}>
          <Search size={16} style={{ color: '#9ca3af', flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по имени или email..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text)' }}
          />
          {query && (
            <button onClick={clearSearch} className="p-0.5 rounded-full hover:bg-gray-200 transition-colors">
              <X size={14} style={{ color: '#9ca3af' }} />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {showSearch && (
          <div className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {searching ? (
              <div className="flex items-center justify-center py-6">
                <Loader size={20} className="animate-spin" style={{ color: 'var(--primary)' }} />
              </div>
            ) : searchResults.length === 0 ? (
              <p className="text-center text-sm py-5" style={{ color: '#9ca3af' }}>
                Пользователи не найдены
              </p>
            ) : (
              searchResults.map((user, i) => {
                const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
                const isStarting = starting === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleOpenChat(user)}
                    disabled={isStarting}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left disabled:opacity-60"
                    style={{ borderBottom: i < searchResults.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} className="w-10 h-10 rounded-full object-cover shrink-0" alt="" />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ backgroundColor: 'var(--primary)' }}>
                        {name[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{name}</p>
                      <p className="text-xs truncate" style={{ color: '#9ca3af' }}>{user.email}</p>
                    </div>
                    {isStarting ? (
                      <Loader size={16} className="animate-spin shrink-0" style={{ color: 'var(--primary)' }} />
                    ) : (
                      <span className="text-xs px-2.5 py-1 rounded-full shrink-0 font-medium"
                        style={{ backgroundColor: 'var(--bg-light)', color: 'var(--primary)' }}>
                        Написать
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Conversations list */}
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: 'var(--bg-light)' }}>
            <MessageCircle size={28} style={{ color: 'var(--primary)' }} />
          </div>
          <p className="font-bold text-base mb-1" style={{ color: 'var(--primary)' }}>Сообщений пока нет</p>
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            Найдите пользователя выше или нажмите «Написать» на объявлении
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {conversations.map((conv, i) => (
            <button
              key={conv.id}
              onClick={() => navigate(`/chat/${conv.id}`, { state: { otherUserId: conv.otherUserId, otherUserName: conv.otherUserName } })}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              style={{ borderBottom: i < conversations.length - 1 ? '1px solid #f3f4f6' : 'none' }}
            >
              <div className="shrink-0 relative">
                {conv.otherUserAvatarUrl ? (
                  <img src={conv.otherUserAvatarUrl} className="w-11 h-11 rounded-full object-cover" alt="" />
                ) : (
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: 'var(--primary)' }}>
                    {(conv.otherUserName || '?')[0].toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>
                    {conv.otherUserName}
                  </p>
                  <span className="text-xs shrink-0 ml-2" style={{ color: '#9ca3af' }}>
                    {formatTime(conv.lastMessageAt)}
                  </span>
                </div>
                <p className="text-xs truncate" style={{ color: '#9ca3af' }}>
                  {conv.listingTitle && (
                    <span className="font-medium" style={{ color: 'var(--primary)' }}>
                      {conv.listingTitle} · {' '}
                    </span>
                  )}
                  {conv.lastMessage || 'Нет сообщений'}
                </p>
              </div>

              <ChevronRight size={16} style={{ color: '#d1d5db', flexShrink: 0 }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
