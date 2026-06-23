import { useSendRequest } from '../hooks/useFeed';

const MembershipBadge = ({ membershipType }) => {
  if (!membershipType) return null;
  const isGold = membershipType.toLowerCase() === 'gold';
  return (
    <span style={{
      display: 'inline-block',
      background: isGold ? '#FFD700' : '#C0C0C0',
      color: '#111',
      fontSize: '11px',
      fontWeight: 'bold',
      padding: '2px 8px',
      borderRadius: '10px',
      marginLeft: '8px',
      verticalAlign: 'middle',
    }}>
      {isGold ? '👑 Gold' : '✦ Silver'}
    </span>
  );
};

const UserCard = ({ user }) => {
  const { mutate, isPending } = useSendRequest();

  return (
    <div style={styles.card}>
      <div style={styles.photoWrap}>
        <img src={user.photoUrl} alt={user.firstName} style={styles.photo} />
        {user.isPremium && (
          <div style={{
            ...styles.premiumOverlay,
            background: user.membershipType?.toLowerCase() === 'gold' ? '#FFD700' : '#C0C0C0',
          }}>
            {user.membershipType?.toLowerCase() === 'gold' ? '👑 Gold' : '✦ Silver'}
          </div>
        )}
      </div>
      <div style={styles.info}>
        <h3 style={styles.name}>
          {user.firstName} {user.lastName}
          {user.isPremium && <MembershipBadge membershipType={user.membershipType} />}
        </h3>
        {user.age && user.gender && <p style={styles.meta}>{user.age} · {user.gender}</p>}
        <p style={styles.about}>{user.about}</p>
        {user.skills?.length > 0 && (
          <div style={styles.skills}>
            {user.skills.map((s) => <span key={s} style={styles.skill}>{s}</span>)}
          </div>
        )}
      </div>
      <div style={styles.actions}>
        <button
          disabled={isPending}
          onClick={() => mutate({ status: 'ignored', toUserId: user._id })}
          style={{ ...styles.btn, background: '#555' }}
        >
          Ignore
        </button>
        <button
          disabled={isPending}
          onClick={() => mutate({ status: 'interested', toUserId: user._id })}
          style={{ ...styles.btn, background: '#e94560' }}
        >
          Interested
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: '#16213e', borderRadius: '12px', overflow: 'hidden',
    width: '320px', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  },
  photoWrap: { position: 'relative' },
  photo: { width: '100%', height: '220px', objectFit: 'cover', display: 'block' },
  premiumOverlay: {
    position: 'absolute', top: '10px', right: '10px',
    color: '#111', fontWeight: 'bold', fontSize: '12px',
    padding: '3px 10px', borderRadius: '12px',
  },
  info: { padding: '16px' },
  name: { margin: '0 0 4px', fontSize: '20px' },
  meta: { margin: '0 0 8px', color: '#aaa', fontSize: '14px' },
  about: { margin: '0 0 12px', fontSize: '14px', color: '#ccc' },
  skills: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  skill: { background: '#0f3460', padding: '2px 10px', borderRadius: '20px', fontSize: '12px' },
  actions: { display: 'flex', gap: '8px', padding: '0 16px 16px' },
  btn: {
    flex: 1, padding: '10px', border: 'none', borderRadius: '6px',
    color: '#fff', cursor: 'pointer', fontWeight: 'bold',
  },
};

export default UserCard;
