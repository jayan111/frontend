import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { profileAPI } from '../services/api';
import { setUser } from '../store/slices/authSlice';

const EditProfile = () => {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    age: user?.age || '',
    gender: user?.gender || '',
    photoUrl: user?.photoUrl || '',
    about: user?.about || '',
    skills: user?.skills?.join(', ') || '',
  });
  const [status, setStatus] = useState(null); // null | loading | success | error

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const payload = {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const res = await profileAPI.edit(payload);
      dispatch(setUser(res.data));
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div style={wrap}>
      <div style={styles.container}>
        <h2 style={styles.title}>Edit Profile</h2>
        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.row}>
            <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
            <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
          </div>

          <div style={styles.row}>
            <Field label="Age" name="age" type="number" value={form.age} onChange={handleChange} />
            <div style={styles.field}>
              <label style={styles.label}>Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <Field
            label="Photo URL"
            name="photoUrl"
            value={form.photoUrl}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
          />

          <Field
            label="Skills (comma separated)"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, Node.js, Python"
          />

          <div style={styles.field}>
            <label style={styles.label}>About</label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows={4}
              style={{ ...styles.input, resize: 'vertical' }}
              placeholder="Tell others about yourself…"
            />
          </div>

          {form.photoUrl && (
            <div style={styles.preview}>
              <img src={form.photoUrl} alt="preview" style={styles.previewImg} />
            </div>
          )}

          <button type="submit" disabled={status === 'loading'} style={styles.btn}>
            {status === 'loading' ? 'Saving…' : 'Save Changes'}
          </button>

          {status === 'success' && <p style={styles.success}>✓ Profile updated successfully!</p>}
          {status === 'error' && <p style={styles.error}>Failed to update profile. Please try again.</p>}
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, name, value, onChange, type = 'text', placeholder }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={styles.input}
    />
  </div>
);

const wrap = {
  minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '40px 20px', background: '#0f0f23',
};

const styles = {
  container: {
    background: '#16213e', padding: '36px', borderRadius: '12px',
    width: '100%', maxWidth: '580px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
  },
  title: { color: '#e94560', margin: '0 0 28px', fontSize: '22px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  row: { display: 'flex', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  label: { color: '#aaa', fontSize: '13px' },
  input: {
    background: '#0f0f1a', border: '1px solid #333', borderRadius: '6px',
    padding: '10px 12px', color: '#fff', fontSize: '15px', outline: 'none',
    width: '100%', boxSizing: 'border-box',
  },
  preview: { display: 'flex', justifyContent: 'center' },
  previewImg: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' },
  btn: {
    padding: '12px', background: '#e94560', border: 'none',
    borderRadius: '6px', color: '#fff', fontWeight: 'bold',
    cursor: 'pointer', fontSize: '15px',
  },
  success: { color: '#4caf50', margin: 0 },
  error: { color: '#e94560', margin: 0 },
};

export default EditProfile;
