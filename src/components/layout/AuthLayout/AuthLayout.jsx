import { Link } from 'react-router-dom';
import styles from './AuthLayout.module.css';

const AuthLayout = ({ children }) => (
  <div className={styles.wrap}>
    <div className={styles.card}>
      <Link to="/" className={styles.brand}>DevTinder</Link>
      {children}
    </div>
  </div>
);

export default AuthLayout;
