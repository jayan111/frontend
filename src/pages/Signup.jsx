import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignup } from '../hooks/useAuth';

const Signup = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', emailId: '', password: '' });
  const { mutate, isPending, error } = useSignup();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form);
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Account</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <input style={styles.input} type="text" placeholder="First Name" value={form.firstName} onChange={set('firstName')} required />
          <input style={styles.input} type="text" placeholder="Last Name" value={form.lastName} onChange={set('lastName')} />
        </div>
        <input style={styles.input} type="email" placeholder="Email" value={form.emailId} onChange={set('emailId')} required />
        <input style={styles.input} type="password" placeholder="Password" value={form.password} onChange={set('password')} required />
        {error && <p style={styles.error}>{error.response?.data || error.message}</p>}
        <button style={styles.btn} type="submit" disabled={isPending}>
          {isPending ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p style={styles.footer}>Already have an account? <Link to="/login" style={styles.link}>Login</Link></p>
    </div>
  );
};

const styles = {
  container: { maxWidth: '400px', margin: '60px auto', background: '#16213e', padding: '32px', borderRadius: '12px' },
  title: { marginBottom: '24px', color: '#e94560' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  row: { display: 'flex', gap: '12px' },
  input: { flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #333', background: '#0f3460', color: '#fff', fontSize: '15px' },
  btn: { padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' },
  error: { color: '#e94560', margin: 0 },
  footer: { marginTop: '16px', color: '#aaa', textAlign: 'center' },
  link: { color: '#e94560' },
};

export default Signup;
