import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { profileAPI } from '../services/api';
import { setUser } from '../store/slices/authSlice';

const EditProfile = () => {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    about: user?.about || '',
    photoUrl: user?.photoUrl || '',
    skills: user?.skills?.join(', ') || '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const res = await profileAPI.edit(payload);
      dispatch(setUser(res.data));
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Profile</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {[
          { label: 'First Name', name: 'firstName' },
          { label: 'Last Name', name: 'lastName' },
          { label: 'Photo URL', name: 'photoUrl' },
          { label: 'Skills (comma separated)', name: 'skills' },
        ].map(({ label, name }) => (
          <div key={name} style={styles.field}>
            <label style={styles.label}>{label}</label>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        ))}
        <div style={styles.field}>
          <label style={styles.label}>About</label>
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            rows={3}
            style={{ ...styles.input, resize: 'vertical' }}
          />
        </div>
        <button type="submit" disabled={status === 'loading'} style={styles.btn}>
          {status === 'loading' ? 'Saving...' : 'Save Changes'}
        </button>
        {status === 'success' && <p style={styles.success}>Profile updated!</p>}
        {status === 'error' && <p style={styles.error}>Failed to update profile.</p>}
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: '560px', background: '#16213e', padding: '32px', borderRadius: '12px' },
  title: { color: '#e94560', marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#aaa', fontSize: '13px' },
  input: { background: '#0f0f1a', border: '1px solid #333', borderRadius: '6px', padding: '10px 12px', color: '#fff', fontSize: '15px', outline: 'none' },
  btn: { padding: '12px', background: '#e94560', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' },
  success: { color: '#4caf50', margin: 0 },
  error: { color: '#e94560', margin: 0 },
};

export default EditProfile;
