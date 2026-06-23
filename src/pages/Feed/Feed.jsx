import { useSelector } from 'react-redux';
import { useFeed } from '../../hooks/useFeed';
import UserCard from '../../components/features/UserCard/UserCard';
import Loader from '../../components/common/Loader/Loader';
import styles from './Feed.module.css';

const Feed = () => {
  const { isLoading } = useFeed();
  const users = useSelector((s) => s.feed.users);

  if (isLoading) return <Loader size="lg" fullscreen />;

  return (
    <div className={styles.wrap}>
      <h1 className={styles.heading}>Discover Developers</h1>
      {users.length === 0 ? (
        <p className={styles.empty}>No more developers to show. Check back later!</p>
      ) : (
        <div className={styles.grid}>
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
