import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useProfile } from '../hooks/useAuth';

const Profile = () => {
  const { isLoading } = useProfile();
  const user = useSelector((s) => s.auth.user);
  const { isPremium, membershipType } = useSelector((s) => s.membership);

  if (isLoading) return <p style={styles.msg}>Loading profile…</p>;
  if (!user) return <p style={styles.msg}>Not logged in.</p>;

  return (
    <div style={wrap}>
      <div style={styles.container}>
        <div style={styles.header}>
          <img src={user.photoUrl} alt={user.firstName} style={styles.photo} />
          <div style={styles.info}>
            <h2 style={styles.name}>
              {user.firstName} {user.lastName}
              {isPremium && (
                <span style={{
                  ...styles.premiumBadge,
                  color: membershipType === 'gold' ? '#111' : '#111',
                  background: membershipType === 'gold' ? '#FFD700' : '#C0C0C0',
                }}>
                  {membershipType === 'gold' ? '👑 Gold' : '✦ Silver'}
                </span>
              )}
            </h2>
            <p style={styles.email}>{user.emailId}</p>

            {user.age && <p style={styles.field}><b>Age:</b> {user.age}</p>}
            {user.gender && (
              <p style={styles.field}>
                <b>Gender:</b>{' '}
                <span style={{ textTransform: 'capitalize' }}>{user.gender}</span>
              </p>
            )}
            {user.about && <p style={styles.field}><b>About:</b> {user.about}</p>}

            {user.skills?.length > 0 && (
              <div style={{ marginTop: '4px' }}>
                <b style={{ color: '#ccc' }}>Skills:</b>
                <div style={styles.skills}>
                  {user.skills.map((s) => (
                    <span key={s} style={styles.skill}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={styles.actions}>
          <Link to="/edit" style={styles.editBtn}>Edit Profile</Link>
          {!isPremium && (
            <Link to="/membership" style={styles.upgradeBtn}>⬆ Upgrade to Premium</Link>
          )}
        </div>
      </div>
    </div>
  );
};

const wrap = {
  minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '40px 20px', background: '#0f0f23',
};

const styles = {
  container: {
    background: '#16213e', padding: '32px', borderRadius: '12px',
    maxWidth: '700px', width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
  },
  header: { display: 'flex', gap: '28px', flexWrap: 'wrap' },
  photo: { width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 },
  info: { flex: 1, minWidth: '200px' },
  name: { color: '#e94560', margin: '0 0 4px', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  premiumBadge: {
    fontSize: '12px', fontWeight: 'bold', padding: '3px 10px',
    borderRadius: '12px', lineHeight: 1.6,
  },
  email: { color: '#aaa', margin: '0 0 14px', fontSize: '14px' },
  field: { color: '#ccc', margin: '0 0 8px', fontSize: '14px' },
  skills: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' },
  skill: { background: '#0f3460', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', color: '#fff' },
  actions: { display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' },
  editBtn: {
    background: '#e94560', color: '#fff', textDecoration: 'none',
    padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px',
  },
  upgradeBtn: {
    background: 'transparent', color: '#FFD700', textDecoration: 'none',
    padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px',
    border: '1px solid #FFD700',
  },
  msg: { color: '#aaa', textAlign: 'center', marginTop: '60px' },
};

export default Profile;
