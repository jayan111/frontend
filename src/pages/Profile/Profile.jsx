import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useProfile } from '../../hooks/useAuth';
import Loader from '../../components/common/Loader/Loader';
import Button from '../../components/common/Button/Button';
import styles from './Profile.module.css';

const Profile = () => {
  const { isLoading } = useProfile();
  const user = useSelector((s) => s.auth.user);
  const { isPremium, membershipType } = useSelector((s) => s.membership);
  const tier = membershipType?.toLowerCase();

  if (isLoading) return <Loader size="lg" fullscreen />;
  if (!user) return <p className={styles.msg}>Not logged in.</p>;

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img src={user.photoUrl} alt={user.firstName} className={styles.photo} />
          <div className={styles.info}>
            <div className={styles.nameRow}>
              <h2 className={styles.name}>{user.firstName} {user.lastName}</h2>
              {isPremium && tier && (
                <span className={`${styles.premiumBadge} ${styles[`premiumBadge--${tier}`]}`}>
                  {tier === 'gold' ? '👑 Gold' : '✦ Silver'}
                </span>
              )}
            </div>
            <p className={styles.email}>{user.emailId}</p>
            {user.age && <p className={styles.field}><b>Age:</b> {user.age}</p>}
            {user.gender && (
              <p className={styles.field} style={{ textTransform: 'capitalize' }}>
                <b>Gender:</b> {user.gender}
              </p>
            )}
            {user.about && <p className={styles.field}><b>About:</b> {user.about}</p>}
            {user.skills?.length > 0 && (
              <div>
                <b style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Skills:</b>
                <div className={styles.skills}>
                  {user.skills.map((s) => <span key={s} className={styles.skill}>{s}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <Button as={Link} to="/edit" onClick={() => {}}>
            <Link to="/edit" style={{ color: 'inherit', textDecoration: 'none' }}>Edit Profile</Link>
          </Button>
          {!isPremium && (
            <Button variant="ghost">
              <Link to="/membership" style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>⬆ Upgrade to Premium</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
