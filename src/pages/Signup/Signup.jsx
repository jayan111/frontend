import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignup } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout/AuthLayout';
import Button from '../../components/common/Button/Button';
import styles from './Signup.module.css';

const Signup = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', emailId: '', password: '' });
  const { mutate, isPending, error } = useSignup();

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <AuthLayout>
      <h2 className={styles.title}>Create account</h2>
      <form onSubmit={(e) => { e.preventDefault(); mutate(form); }} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="firstName">First name</label>
            <input id="firstName" className={styles.input} type="text" placeholder="Jane" value={form.firstName} onChange={set('firstName')} required autoComplete="given-name" />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="lastName">Last name</label>
            <input id="lastName" className={styles.input} type="text" placeholder="Doe" value={form.lastName} onChange={set('lastName')} autoComplete="family-name" />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="signupEmail">Email</label>
          <input id="signupEmail" className={styles.input} type="email" placeholder="you@example.com" value={form.emailId} onChange={set('emailId')} required autoComplete="email" />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="signupPassword">Password</label>
          <input id="signupPassword" className={styles.input} type="password" placeholder="Min 8 characters" value={form.password} onChange={set('password')} required autoComplete="new-password" />
        </div>
        {error && <p className={styles.error}>{error.response?.data || error.message}</p>}
        <Button type="submit" disabled={isPending} fullWidth>
          {isPending ? 'Creating account…' : 'Sign Up'}
        </Button>
      </form>
      <p className={styles.footer}>
        Already have an account?{' '}
        <Link to="/login" className={styles.footerLink}>Login</Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
