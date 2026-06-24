import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { chatAPI } from '../../services/api';
import { socket } from '../../utils/socket';
import { useNotification } from '../../context/NotificationContext';
import Loader from '../../components/common/Loader/Loader';
import styles from './Chat.module.css';

/* ── Helpers ── */
const fmt = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const dateLabel = (iso) => {
  const d = new Date(iso);
  const today = new Date();
  const yest = new Date(today);
  yest.setDate(yest.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yest.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
};

const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
const sid = (m) => (typeof m.senderId === 'object' ? m.senderId._id : m.senderId);

/* ── Avatar shown on the last message of each received group ── */
const MsgAvatar = ({ user, visible }) => {
  if (!visible) return <div className={styles.msgAvatarWrap} />;
  if (user?.photoUrl) {
    return (
      <div className={styles.msgAvatarWrap}>
        <img src={user.photoUrl} alt={user.firstName} className={styles.msgAvatar} />
      </div>
    );
  }
  return (
    <div className={styles.msgAvatarWrap}>
      <div className={styles.msgAvatarFallback}>
        {(user?.firstName?.[0] ?? '?').toUpperCase()}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────── */
const Chat = () => {
  const { targetUserId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector((s) => s.auth.user);
  const { showToast } = useNotification();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [targetUser, setTargetUser] = useState(state?.user ?? null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  /* Load history */
  useEffect(() => {
    (async () => {
      try {
        const res = await chatAPI.getHistory(targetUserId);
        const d = res.data;
        // API returns { data: [...] }
        const msgs = d.data ?? d.messages ?? (Array.isArray(d) ? d : []);
        setMessages(msgs);
        const tu = d.targetUser ?? d.receiver ?? d.user;
        if (tu) setTargetUser((p) => p ?? tu);
      } catch (err) {
        if (err.response?.status === 403) setIsForbidden(true);
        else showToast('Failed to load chat history', 'error');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [targetUserId, showToast]);

  /* Socket */
  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('joinRoom', { targetUserId });
    });
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('receiveMessage', (msg) => setMessages((p) => [...p, msg]));
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receiveMessage');
      socket.disconnect();
    };
  }, [targetUserId]);

  /* Auto-scroll on new messages */
  useEffect(() => {
    if (shouldAutoScroll.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  /* Jump to bottom on initial load */
  useEffect(() => {
    if (!isLoading) bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [isLoading]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    shouldAutoScroll.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }, []);

  const autoResize = useCallback((el) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  const handleChange = (e) => {
    setInput(e.target.value);
    autoResize(e.target);
  };

  const sendMessage = useCallback(
    (e) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || !isConnected || isSending || isForbidden) return;
      setIsSending(true);
      socket.emit('sendMessage', { targetUserId, message: text }, (ack) => {
        setIsSending(false);
        if (ack?.error) showToast(ack.error, 'error');
      });
      setInput('');
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
        inputRef.current.focus();
      }
    },
    [input, isConnected, isSending, isForbidden, targetUserId, showToast]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  if (isLoading) return <Loader size="lg" fullscreen />;

  const displayName = targetUser
    ? `${targetUser.firstName} ${targetUser.lastName ?? ''}`.trim()
    : 'Chat';

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {targetUser?.photoUrl ? (
          <img src={targetUser.photoUrl} alt={displayName} className={styles.headerAvatar} />
        ) : (
          <div className={styles.headerAvatarFallback}>
            {(targetUser?.firstName?.[0] ?? '?').toUpperCase()}
          </div>
        )}

        <div className={styles.headerMeta}>
          <span className={styles.headerName}>{displayName}</span>
          <span className={`${styles.headerStatus} ${isConnected ? styles.online : ''}`}>
            <span className={styles.statusDot} />
            {isConnected ? 'Online' : 'Connecting…'}
          </span>
        </div>
      </header>

      {/* ── Messages ── */}
      <div className={styles.messages} ref={scrollRef} onScroll={handleScroll}>

        {messages.length === 0 && !isForbidden && (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>💬</span>
            <p>No messages yet — say hello!</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const senderId = sid(msg);
          const isMine = senderId === currentUser?._id;
          const prev = messages[i - 1];
          const next = messages[i + 1];
          const showDate = !prev || !sameDay(prev.createdAt, msg.createdAt);
          const isGroupStart = !prev || sid(prev) !== senderId || showDate;
          const isGroupEnd =
            !next || sid(next) !== senderId || !sameDay(msg.createdAt, next.createdAt);

          /* Flatten the corner that connects to an adjacent bubble in the same group */
          const rMine = isMine
            ? `18px 18px ${isGroupEnd ? '4px' : '18px'} 18px`
            : undefined;
          const rTheirs = !isMine
            ? `18px 18px 18px ${isGroupEnd ? '4px' : '18px'}`
            : undefined;

          return (
            <div key={msg._id ?? i}>
              {showDate && (
                <div className={styles.dateDivider}>
                  <span>{dateLabel(msg.createdAt)}</span>
                </div>
              )}

              <div
                className={`${styles.row} ${isMine ? styles.rowMine : styles.rowTheirs}`}
                style={{ marginTop: isGroupStart ? '12px' : '3px' }}
              >
                {/* Avatar only for received messages */}
                {!isMine && <MsgAvatar user={targetUser} visible={isGroupEnd} />}

                <div
                  className={`${styles.bubbleWrap} ${
                    isMine ? styles.bubbleWrapMine : styles.bubbleWrapTheirs
                  }`}
                >
                  <div
                    className={`${styles.bubble} ${
                      isMine ? styles.bubbleMine : styles.bubbleTheirs
                    }`}
                    style={{ borderRadius: isMine ? rMine : rTheirs }}
                  >
                    <p className={styles.bubbleText}>{msg.message}</p>
                  </div>

                  {isGroupEnd && msg.createdAt && (
                    <span
                      className={`${styles.timeStamp} ${
                        isMine ? styles.timeStampMine : styles.timeStampTheirs
                      }`}
                    >
                      {fmt(msg.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} style={{ height: 4 }} />
      </div>

      {/* ── 403 banner ── */}
      {isForbidden && (
        <div className={styles.forbiddenBanner}>
          🔒 You are not connected with this user. Send a connection request first.
        </div>
      )}

      {/* ── Input ── */}
      <form className={styles.inputArea} onSubmit={sendMessage}>
        <div className={styles.inputWrap}>
          <textarea
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isForbidden ? 'Not connected — cannot send messages' : 'Type a message…'
            }
            disabled={isForbidden}
            rows={1}
            maxLength={1000}
          />
        </div>
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={!input.trim() || !isConnected || isForbidden || isSending}
          aria-label="Send"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="currentColor" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;
