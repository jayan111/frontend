import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';

const Login = () => {
  const [form, setForm] = useState({ emailId: '', password: '' });
  const { mutate, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={form.emailId}
          onChange={(e) => setForm({ ...form, emailId: e.target.value })}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <p style={styles.error}>{error.response?.data || error.message}</p>}
        <button style={styles.btn} type="submit" disabled={isPending}>
          {isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={styles.footer}>Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link></p>
    </div>
  );
};

const styles = {
  container: { maxWidth: '400px', margin: '60px auto', background: '#16213e', padding: '32px', borderRadius: '12px' },
  title: { marginBottom: '24px', color: '#e94560' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #333', background: '#0f3460', color: '#fff', fontSize: '15px' },
  btn: { padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' },
  error: { color: '#e94560', margin: 0 },
  footer: { marginTop: '16px', color: '#aaa', textAlign: 'center' },
  link: { color: '#e94560' },
};

export default Login;
