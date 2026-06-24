import { Link } from 'react-router-dom';
import { useConnections } from '../../hooks/useConnections';
import Loader from '../../components/common/Loader/Loader';
import styles from './Connections.module.css';

const ConnectionCard = ({ user }) => {
  const tier = user.membershipType?.toLowerCase();
  return (
    <div className={styles.card}>
      <img src={user.photoUrl} alt={`${user.firstName} ${user.lastName}`} className={styles.photo} />
      <div className={styles.info}>
        <h3 className={styles.name}>
          {user.firstName} {user.lastName}
          {user.isPremium && tier && (
            <span className={`${styles.badge} ${styles[`badge--${tier}`]}`}>
              {tier === 'gold' ? '👑' : '✦'} {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </span>
          )}
        </h3>
        {user.age && user.gender && <p className={styles.meta}>{user.age} · {user.gender}</p>}
        {user.about && <p className={styles.about}>{user.about}</p>}
        {user.skills?.length > 0 && (
          <div className={styles.skills}>
            {user.skills.map((s) => <span key={s} className={styles.skill}>{s}</span>)}
          </div>
        )}
      </div>
      <div className={styles.actions}>
        <Link to={`/chat/${user._id}`} state={{ user }} className={styles.chatBtn}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Chat
        </Link>
      </div>
    </div>
  );
};

const Connections = () => {
  const { data: connections, isLoading, isError } = useConnections();

  return (
    <div className={styles.wrap}>
      <h1 className={styles.heading}>My Connections</h1>

      {isLoading && <Loader size="lg" />}
      {isError   && <p className={styles.err}>Failed to load connections.</p>}

      {!isLoading && !isError && connections?.length === 0 && (
        <p className={styles.empty}>No connections yet — explore the feed!</p>
      )}

      {connections?.length > 0 && (
        <div className={styles.grid}>
          {connections.map((u) => <ConnectionCard key={u._id} user={u} />)}
        </div>
      )}
    </div>
  );
};

export default Connections;
