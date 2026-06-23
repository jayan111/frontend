import styles from './Loader.module.css';

/**
 * Spinner or skeleton loader
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} fullscreen
 * @param {'spinner'|'skeleton'} type
 * @param {{ width, height }} skeletonProps - used when type='skeleton'
 */
const Loader = ({ size = 'md', fullscreen = false, type = 'spinner', skeletonProps }) => {
  if (type === 'skeleton') {
    return (
      <div
        className={styles.skeleton}
        style={{ width: skeletonProps?.width ?? '100%', height: skeletonProps?.height ?? 20 }}
        role="presentation"
        aria-hidden
      />
    );
  }

  return (
    <div className={`${styles.wrap} ${fullscreen ? styles['wrap--fullscreen'] : ''}`} role="status">
      <span className={`${styles.spinner} ${styles[`spinner--${size}`]}`} aria-label="Loading" />
    </div>
  );
};

export default Loader;
