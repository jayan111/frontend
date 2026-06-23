import { useSendRequest } from '../../../hooks/useFeed';
import styles from './UserCard.module.css';

const UserCard = ({ user }) => {
  const { mutate, isPending } = useSendRequest();
  const tier = user.membershipType?.toLowerCase();

  return (
    <article className={styles.card}>
      <div className={styles.photoWrap}>
        <img src={user.photoUrl} alt={`${user.firstName} ${user.lastName}`} className={styles.photo} />
        {user.isPremium && tier && (
          <span className={`${styles.premiumOverlay} ${styles[`premiumOverlay--${tier}`]}`}>
            {tier === 'gold' ? '👑 Gold' : '✦ Silver'}
          </span>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{user.firstName} {user.lastName}</h3>
          {user.isPremium && tier && (
            <span className={`${styles.memberBadge} ${styles[`memberBadge--${tier}`]}`}>
              {tier === 'gold' ? '👑' : '✦'} {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </span>
          )}
        </div>

        {user.age && user.gender && (
          <p className={styles.meta}>{user.age} · {user.gender}</p>
        )}
        {user.about && <p className={styles.about}>{user.about}</p>}
        {user.skills?.length > 0 && (
          <div className={styles.skills}>
            {user.skills.map((s) => <span key={s} className={styles.skill}>{s}</span>)}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          disabled={isPending}
          className={`${styles.btn} ${styles.btnIgnore}`}
          onClick={() => mutate({ status: 'ignored', toUserId: user._id })}
        >
          Ignore
        </button>
        <button
          disabled={isPending}
          className={`${styles.btn} ${styles.btnInterested}`}
          onClick={() => mutate({ status: 'interested', toUserId: user._id })}
        >
          Interested
        </button>
      </div>
    </article>
  );
};

export default UserCard;
