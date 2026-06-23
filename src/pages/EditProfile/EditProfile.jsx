import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { profileAPI } from '../../services/api';
import { setUser } from '../../store/slices/authSlice';
import Button from '../../components/common/Button/Button';
import styles from './EditProfile.module.css';

const Field = ({ label, id, children }) => (
  <div className={styles.field}>
    <label className={styles.label} htmlFor={id}>{label}</label>
    {children}
  </div>
);

const EditProfile = () => {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    age:       user?.age       || '',
    gender:    user?.gender    || '',
    photoUrl:  user?.photoUrl  || '',
    about:     user?.about     || '',
    skills:    user?.skills?.join(', ') || '',
  });
  const [status, setStatus] = useState(null);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

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
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h2 className={styles.title}>Edit Profile</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <Field label="First Name" id="firstName">
              <input id="firstName" name="firstName" className={styles.input} value={form.firstName} onChange={set} />
            </Field>
            <Field label="Last Name" id="lastName">
              <input id="lastName" name="lastName" className={styles.input} value={form.lastName} onChange={set} />
            </Field>
          </div>

          <div className={styles.row}>
            <Field label="Age" id="age">
              <input id="age" name="age" type="number" min="18" max="100" className={styles.input} value={form.age} onChange={set} />
            </Field>
            <Field label="Gender" id="gender">
              <select id="gender" name="gender" className={styles.input} value={form.gender} onChange={set}>
                <option value="">Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>

          <Field label="Photo URL" id="photoUrl">
            <input id="photoUrl" name="photoUrl" className={styles.input} value={form.photoUrl} onChange={set} placeholder="https://example.com/photo.jpg" />
          </Field>

          {form.photoUrl && (
            <div className={styles.preview}>
              <img src={form.photoUrl} alt="Preview" className={styles.previewImg} />
            </div>
          )}

          <Field label="Skills (comma-separated)" id="skills">
            <input id="skills" name="skills" className={styles.input} value={form.skills} onChange={set} placeholder="React, Node.js, Python" />
          </Field>

          <Field label="About" id="about">
            <textarea id="about" name="about" className={styles.input} value={form.about} onChange={set} rows={4} style={{ resize: 'vertical' }} placeholder="Tell others about yourself…" />
          </Field>

          <Button type="submit" disabled={status === 'loading'} fullWidth>
            {status === 'loading' ? 'Saving…' : 'Save Changes'}
          </Button>

          {status === 'success' && <p className={styles.success}>✓ Profile updated successfully!</p>}
          {status === 'error'   && <p className={styles.error}>Failed to update. Please try again.</p>}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
