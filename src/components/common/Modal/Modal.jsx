import { useEffect } from 'react';
import styles from './Modal.module.css';

const Modal = ({ title, children, onClose, closeOnOverlay = true }) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleOverlay = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlay} role="dialog" aria-modal="true">
      <div className={styles.box}>
        {onClose && (
          <button className={styles.close} onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        )}
        {title && <h3 className={styles.title}>{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
