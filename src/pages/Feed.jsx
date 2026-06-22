import { useSelector } from 'react-redux';
import { useFeed } from '../hooks/useFeed';
import UserCard from '../components/UserCard';

const Feed = () => {
  const { isLoading, error } = useFeed();
  const users = useSelector((s) => s.feed.users);

  if (isLoading) return <p style={styles.msg}>Loading feed...</p>;
  if (error) return <p style={styles.error}>Failed to load feed.</p>;
  if (!users.length) return <p style={styles.msg}>No more users to show!</p>;

  return (
    <div>
      <h2 style={styles.title}>Discover People</h2>
      <div style={styles.grid}>
        {users.map((user) => <UserCard key={user._id} user={user} />)}
      </div>
    </div>
  );
};

const styles = {
  title: { marginBottom: '24px', color: '#e94560' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '24px' },
  msg: { color: '#aaa', textAlign: 'center', marginTop: '60px' },
  error: { color: '#e94560', textAlign: 'center', marginTop: '60px' },
};

export default Feed;
