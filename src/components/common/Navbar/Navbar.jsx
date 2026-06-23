import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLogout } from '../../../hooks/useAuth';
import { useThemeContext } from '../../../context/ThemeContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { isPremium, membershipType } = useSelector((s) => s.membership);
  const { theme, toggleTheme } = useThemeContext();
  const logout = useLogout();

  return (
    <nav className={styles.nav} aria-label="Primary navigation">
      <Link to="/" className={styles.brand}>DevTinder</Link>

      <div className={styles.actions}>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
        </button>

        {isAuthenticated ? (
          <>
            <span className={styles.greeting}>
              Hi, {user?.firstName}
              {isPremium && (
                <span className={`${styles.premiumBadge} ${styles[`premiumBadge--${membershipType}`]}`}>
                  {membershipType === 'gold' ? '👑 Gold' : '✦ Silver'}
                </span>
              )}
            </span>

            {!isPremium && (
              <Link to="/membership" className={styles.upgradeLink}>⬆ Upgrade</Link>
            )}

            <Link to="/membership"   className={styles.link}>Premium</Link>
            <Link to="/connections"  className={styles.link}>Connections</Link>
            <Link to="/requests"     className={styles.link}>Requests</Link>
            <Link to="/profile"      className={styles.link}>Profile</Link>

            <button
              className={styles.logoutBtn}
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"  className={styles.link}>Login</Link>
            <Link to="/signup" className={styles.link}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
