import { Link } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import styles from './NotFound.module.css';

const NotFound = () => (
  <div className={styles.wrap}>
    <p className={styles.code}>404</p>
    <h1 className={styles.title}>Page Not Found</h1>
    <p className={styles.sub}>The page you're looking for doesn't exist or was moved.</p>
    <Button>
      <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Back to Home</Link>
    </Button>
  </div>
);

export default NotFound;
