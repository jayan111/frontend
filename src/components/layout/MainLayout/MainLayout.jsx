import Navbar from '../../common/Navbar/Navbar';
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => (
  <div className={styles.root}>
    <Navbar />
    <main className={styles.main}>{children}</main>
  </div>
);

export default MainLayout;
