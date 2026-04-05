import { useState } from 'react';
import { registerUser, loginUser } from '../api/words';

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fn = mode === 'login' ? loginUser : registerUser;
      const res = await fn(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      onAuth(res.data.name);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="brand-icon">λ</span>
          <h1>Lexicon</h1>
        </div>
        <p className="auth-tagline">Your personal dictionary,<br/>beautifully organized.</p>
        <div className="auth-words">
          {['ephemeral', 'serendipity', 'luminous', 'solitude', 'wanderlust'].map((w, i) => (
            <span key={w} className="floating-word" style={{ animationDelay: `${i * 0.4}s` }}>{w}</span>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
          <p className="auth-sub">{mode === 'login' ? 'Sign in to your lexicon' : 'Start building your dictionary'}</p>

          <form onSubmit={submit}>
            {mode === 'register' && (
              <div className="field">
                <label>Name</label>
                <input name="name" placeholder="Your name" value={form.name} onChange={handle} required />
              </div>
            )}
            <div className="field">
              <label>Email</label>
              <input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handle} required />
            </div>
            <div className="field">
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} required />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="auth-toggle">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
              {mode === 'login' ? 'Register' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}