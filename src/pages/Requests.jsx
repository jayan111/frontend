import { useReceivedRequests, useReviewRequest } from '../hooks/useConnections';

const MembershipBadge = ({ membershipType }) => {
  if (!membershipType) return null;
  const isGold = membershipType.toLowerCase() === 'gold';
  return (
    <span style={{
      background: isGold ? '#FFD700' : '#C0C0C0',
      color: '#111', fontSize: '11px', fontWeight: 'bold',
      padding: '2px 8px', borderRadius: '10px', marginLeft: '6px',
    }}>
      {isGold ? '👑 Gold' : '✦ Silver'}
    </span>
  );
};

const RequestCard = ({ request, onReview, isPending }) => {
  const { fromUserId: user } = request;

  return (
    <div style={styles.card}>
      <img src={user.photoUrl} alt={user.firstName} style={styles.photo} />
      <div style={styles.info}>
        <h3 style={styles.name}>
          {user.firstName} {user.lastName}
          {user.isPremium && <MembershipBadge membershipType={user.membershipType} />}
        </h3>
        {user.age && user.gender && (
          <p style={styles.meta}>{user.age} · {user.gender}</p>
        )}
        {user.about && <p style={styles.about}>{user.about}</p>}
        {user.skills?.length > 0 && (
          <div style={styles.skills}>
            {user.skills.map((s) => (
              <span key={s} style={styles.skill}>{s}</span>
            ))}
          </div>
        )}
      </div>
      <div style={styles.actions}>
        <button
          disabled={isPending}
          onClick={() => onReview('rejected', request._id)}
          style={{ ...styles.btn, background: '#555' }}
        >
          Reject
        </button>
        <button
          disabled={isPending}
          onClick={() => onReview('accepted', request._id)}
          style={{ ...styles.btn, background: '#4caf50' }}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

const Requests = () => {
  const { data: requests, isLoading, isError } = useReceivedRequests();
  const review = useReviewRequest();

  const handleReview = (status, requestId) => {
    review.mutate({ status, requestId });
  };

  return (
    <div style={styles.wrap}>
      <h1 style={styles.heading}>Connection Requests</h1>

      {isLoading && <p style={styles.muted}>Loading requests…</p>}
      {isError && <p style={styles.err}>Failed to load requests.</p>}

      {!isLoading && !isError && requests?.length === 0 && (
        <p style={styles.muted}>No pending requests right now.</p>
      )}

      {requests?.length > 0 && (
        <div style={styles.grid}>
          {requests.map((req) => (
            <RequestCard
              key={req._id}
              request={req}
              onReview={handleReview}
              isPending={review.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrap: {
    minHeight: '80vh', padding: '40px 24px',
    background: '#0f0f23', color: '#fff',
  },
  heading: { fontSize: '28px', margin: '0 0 32px', textAlign: 'center' },
  muted: { color: '#aaa', textAlign: 'center', marginTop: '40px' },
  err: { color: '#e94560', textAlign: 'center', marginTop: '40px' },
  grid: {
    display: 'flex', flexWrap: 'wrap', gap: '20px',
    justifyContent: 'center', maxWidth: '1100px', margin: '0 auto',
  },
  card: {
    background: '#16213e', borderRadius: '12px', overflow: 'hidden',
    width: '280px', boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    display: 'flex', flexDirection: 'column',
  },
  photo: { width: '100%', height: '180px', objectFit: 'cover' },
  info: { padding: '14px', flex: 1 },
  name: { margin: '0 0 4px', fontSize: '17px' },
  meta: { margin: '0 0 6px', color: '#aaa', fontSize: '13px' },
  about: { margin: '0 0 10px', fontSize: '13px', color: '#ccc', lineHeight: 1.4 },
  skills: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  skill: {
    background: '#0f3460', padding: '2px 10px',
    borderRadius: '20px', fontSize: '11px',
  },
  actions: { display: 'flex', gap: '8px', padding: '0 14px 14px' },
  btn: {
    flex: 1, padding: '9px', border: 'none', borderRadius: '6px',
    color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
  },
};

export default Requests;
