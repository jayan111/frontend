import { useSelector } from 'react-redux';
import { useProfile } from '../hooks/useAuth';

const Profile = () => {
  const { isLoading } = useProfile();
  const user = useSelector((s) => s.auth.user);

  if (isLoading) return <p style={styles.msg}>Loading profile...</p>;
  if (!user) return <p style={styles.msg}>Not logged in.</p>;

  return (
    <div style={styles.container}>
      <img src={user.photoUrl} alt={user.firstName} style={styles.photo} />
      <div style={styles.info}>
        <h2 style={styles.name}>{user.firstName} {user.lastName}</h2>
        <p style={styles.email}>{user.emailId}</p>
        {user.age && <p style={styles.field}><b>Age:</b> {user.age}</p>}
        {user.gender && <p style={styles.field}><b>Gender:</b> {user.gender}</p>}
        <p style={styles.field}><b>About:</b> {user.about}</p>
        {user.skills?.length > 0 && (
          <div>
            <b>Skills:</b>
            <div style={styles.skills}>
              {user.skills.map((s) => <span key={s} style={styles.skill}>{s}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', gap: '32px', background: '#16213e', padding: '32px', borderRadius: '12px', maxWidth: '700px' },
  photo: { width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover' },
  info: { flex: 1 },
  name: { color: '#e94560', marginBottom: '4px' },
  email: { color: '#aaa', marginBottom: '16px' },
  field: { marginBottom: '8px', color: '#ccc' },
  skills: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' },
  skill: { background: '#0f3460', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', color: '#fff' },
  msg: { color: '#aaa', textAlign: 'center', marginTop: '60px' },
};

export default Profile;
