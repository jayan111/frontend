import styles from './Button.module.css';

/**
 * Reusable Button
 * @param {'primary'|'secondary'|'danger'|'ghost'|'gold'|'silver'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} fullWidth
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.full : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
};

export default Button;
