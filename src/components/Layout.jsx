import Navbar from './Navbar';

const Layout = ({ children }) => (
  <div style={{ minHeight: '100vh', background: '#0f0f1a', color: '#fff' }}>
    <Navbar />
    <main style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 16px' }}>
      {children}
    </main>
  </div>
);

export default Layout;
