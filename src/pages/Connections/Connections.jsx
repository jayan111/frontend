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
