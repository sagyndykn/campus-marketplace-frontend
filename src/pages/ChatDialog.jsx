import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChevronLeft, Send, Loader, Paperclip, X, Play } from 'lucide-react';
import { getMessages, getPresence, getWsUrl, uploadChatMedia } from '../api/chat';
import { toast } from 'sonner';

function formatTime(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatLastSeen(isoString) {
  if (!isoString) return 'не в сети';
  const d = new Date(isoString);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `был(а) сегодня в ${time}`;
  if (isYesterday) return `был(а) вчера в ${time}`;
  return `был(а) ${d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} в ${time}`;
}

function isVideo(url) {
  return /\.(mp4|mov|webm|avi)(\?|$)/i.test(url);
}

function MediaItem({ url }) {
  const [open, setOpen] = useState(false);

  if (isVideo(url)) {
    return (
      <video
        src={url}
        controls
        className="rounded-xl max-w-full"
        style={{ maxHeight: 240, display: 'block' }}
      />
    );
  }

  return (
    <>
      <img
        src={url}
        alt=""
        className="rounded-xl max-w-full cursor-pointer object-cover"
        style={{ maxHeight: 240, display: 'block' }}
        onClick={() => setOpen(true)}
      />
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setOpen(false)}
        >
          <img src={url} alt="" className="max-w-[90vw] max-h-[90vh] rounded-xl" />
          <button
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-1.5"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
      )}
    </>
  );
}

export default function ChatDialog() {
  const { id: conversationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { otherUserId, otherUserName } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [presence, setPresence] = useState(null);

  const [mediaPreview, setMediaPreview] = useState(null);
  const fileInputRef = useRef(null);

  const clientRef = useRef(null);
  const bottomRef = useRef(null);
  const myId = JSON.parse(localStorage.getItem('user') || '{}').id;

  useEffect(() => {
    getMessages(conversationId)
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [conversationId]);

  useEffect(() => {
    if (otherUserId) {
      getPresence(otherUserId).then(setPresence).catch(console.error);
    }
  }, [otherUserId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const wsUrl = getWsUrl();
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/conversation/${conversationId}`, (frame) => {
          const msg = JSON.parse(frame.body);
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, { ...msg, mine: msg.senderId === myId }];
          });
        });
        if (otherUserId) {
          client.subscribe(`/topic/presence/${otherUserId}`, (frame) => {
            setPresence(JSON.parse(frame.body));
          });
        }
      },
    });
    client.activate();
    clientRef.current = client;
    return () => { client.deactivate(); };
  }, [conversationId, otherUserId, myId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const localUrl = URL.createObjectURL(file);
    setMediaPreview({ file, localUrl, url: null, uploading: true });

    try {
      const { url } = await uploadChatMedia(file);
      setMediaPreview((prev) => prev ? { ...prev, url, uploading: false } : null);
    } catch (err) {
      toast.error(err.message);
      setMediaPreview(null);
      URL.revokeObjectURL(localUrl);
    }
  };

  const removeMedia = () => {
    if (mediaPreview?.localUrl) URL.revokeObjectURL(mediaPreview.localUrl);
    setMediaPreview(null);
  };

  const handleSend = () => {
    const content = text.trim();
    const hasMedia = mediaPreview?.url;
    if ((!content && !hasMedia) || !clientRef.current?.connected) return;
    if (mediaPreview?.uploading) {
      toast.error('Подождите, файл ещё загружается');
      return;
    }

    clientRef.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({
        conversationId,
        content: content || null,
        mediaUrls: hasMedia ? [mediaPreview.url] : [],
      }),
    });

    setText('');
    if (mediaPreview?.localUrl) URL.revokeObjectURL(mediaPreview.localUrl);
    setMediaPreview(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const presenceLabel = presence
    ? presence.online ? 'В сети' : formatLastSeen(presence.lastSeenAt)
    : '...';
  const presenceDot = presence?.online ? '#10b981' : '#d1d5db';

  const canSend = (text.trim() || mediaPreview?.url) && !mediaPreview?.uploading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-64px)]">
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <button onClick={() => navigate('/chat')}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronLeft size={20} style={{ color: 'var(--text)' }} />
        </button>
        <div className="flex-1 min-w-0">
          {otherUserName && (
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
              {otherUserName}
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: presenceDot }} />
            <span className="text-xs" style={{ color: presence?.online ? '#10b981' : 'var(--text-muted, #6b7280)' }}>
              {presenceLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2" style={{ backgroundColor: '#f8fafc' }}>
        {messages.length === 0 && (
          <p className="text-center text-sm py-8" style={{ color: '#9ca3af' }}>
            Начните диалог — напишите первое сообщение
          </p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}>
            {!msg.mine && (
              <div className="w-7 h-7 rounded-full shrink-0 mr-2 self-end">
                {msg.senderAvatarUrl ? (
                  <img src={msg.senderAvatarUrl} className="w-full h-full rounded-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: 'var(--primary)' }}>
                    {(msg.senderName || '?')[0].toUpperCase()}
                  </div>
                )}
              </div>
            )}
            <div className="max-w-[75%]">
              {msg.mediaUrls?.length > 0 && (
                <div className="mb-1 space-y-1">
                  {msg.mediaUrls.map((url, i) => (
                    <MediaItem key={i} url={url} />
                  ))}
                </div>
              )}
              {msg.content && (
                <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.mine ? 'rounded-br-sm' : 'rounded-bl-sm bg-white border border-gray-200'
                }`}
                  style={msg.mine ? { backgroundColor: 'var(--primary)', color: '#fff' } : { color: 'var(--text)' }}>
                  {msg.content}
                </div>
              )}
              <p className={`text-[10px] mt-1 ${msg.mine ? 'text-right' : 'text-left'}`}
                style={{ color: '#9ca3af' }}>
                {formatTime(msg.sentAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {mediaPreview && (
        <div className="px-4 pt-3 bg-white border-t border-gray-100 shrink-0">
          <div className="relative inline-block">
            {isVideo(mediaPreview.file?.name || '') ? (
              <div className="w-20 h-20 rounded-xl bg-gray-200 flex items-center justify-center">
                <Play size={24} style={{ color: '#6b7280' }} />
              </div>
            ) : (
              <img
                src={mediaPreview.localUrl}
                alt=""
                className="w-20 h-20 rounded-xl object-cover"
              />
            )}
            {mediaPreview.uploading && (
              <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center">
                <Loader size={18} className="animate-spin text-white" />
              </div>
            )}
            <button
              onClick={removeMedia}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-700 text-white flex items-center justify-center"
            >
              <X size={11} />
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-3 bg-white border-t border-gray-200 shrink-0 flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all hover:bg-gray-100"
          style={{ border: '1.5px solid var(--border)' }}
        >
          <Paperclip size={17} style={{ color: '#6b7280' }} />
        </button>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Сообщение..."
          rows={1}
          className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
          style={{
            border: '1.5px solid var(--border)',
            maxHeight: 120,
            color: 'var(--text)',
            backgroundColor: '#f8fafc',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 transition-all disabled:opacity-40"
          style={{ backgroundColor: 'var(--primary)' }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
