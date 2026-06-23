import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { isPremium, membershipType } = useSelector((s) => s.membership);
  const logout = useLogout();

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>DevTinder</Link>
      <div style={styles.actions}>
        {isAuthenticated ? (
          <>
            <span style={styles.greeting}>
              Hi, {user?.firstName}
              {isPremium && (
                <span style={{
                  ...styles.crownBadge,
                  color: membershipType === 'gold' ? '#FFD700' : '#C0C0C0',
                }}>
                  {' '}{membershipType === 'gold' ? '👑 Gold' : '✦ Silver'}
                </span>
              )}
            </span>
            {!isPremium && (
              <Link to="/membership" style={styles.upgradeLink}>⬆ Upgrade</Link>
            )}
            <Link to="/membership" style={styles.link}>Premium</Link>
            <Link to="/connections" style={styles.link}>Connections</Link>
            <Link to="/requests" style={styles.link}>Requests</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <button onClick={() => logout.mutate()} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 24px', background: '#1a1a2e', color: '#fff',
  },
  brand: { color: '#e94560', fontWeight: 'bold', fontSize: '20px', textDecoration: 'none' },
  actions: { display: 'flex', gap: '16px', alignItems: 'center' },
  link: { color: '#fff', textDecoration: 'none' },
  greeting: { color: '#aaa' },
  crownBadge: { fontWeight: 'bold', fontSize: '13px' },
  upgradeLink: {
    color: '#FFD700', textDecoration: 'none', fontWeight: 'bold',
    border: '1px solid #FFD700', padding: '3px 10px', borderRadius: '12px', fontSize: '13px',
  },
  btn: {
    background: '#e94560', color: '#fff', border: 'none',
    padding: '6px 14px', borderRadius: '4px', cursor: 'pointer',
  },
};

export default Navbar;
