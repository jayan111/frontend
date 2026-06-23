import { createContext, useCallback, useContext, useState } from 'react';
import styles from './NotificationContext.module.css';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <div className={styles.container} role="region" aria-label="Notifications">
          {toasts.map((t) => (
            <button
              key={t.id}
              className={`${styles.toast} ${styles[t.type]}`}
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
            >
              {t.message}
            </button>
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be inside NotificationProvider');
  return ctx;
};
