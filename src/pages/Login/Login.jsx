import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout/AuthLayout';
import Button from '../../components/common/Button/Button';
import styles from './Login.module.css';

const Login = () => {
  const [form, setForm] = useState({ emailId: '', password: '' });
  const { mutate, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <AuthLayout>
      <h2 className={styles.title}>Welcome back</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="emailId">Email</label>
          <input
            id="emailId"
            className={styles.input}
            type="email"
            placeholder="you@example.com"
            value={form.emailId}
            onChange={(e) => setForm({ ...form, emailId: e.target.value })}
            required
            autoComplete="email"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Password</label>
          <input
            id="password"
            className={styles.input}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            autoComplete="current-password"
          />
        </div>
        {error && <p className={styles.error}>{error.response?.data || error.message}</p>}
        <Button type="submit" disabled={isPending} fullWidth>
          {isPending ? 'Logging in…' : 'Login'}
        </Button>
      </form>
      <p className={styles.footer}>
        Don't have an account?{' '}
        <Link to="/signup" className={styles.footerLink}>Sign up</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
