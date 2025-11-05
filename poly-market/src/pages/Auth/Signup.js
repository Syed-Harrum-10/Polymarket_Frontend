'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/login.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [role, setRole] = useState('user');
  const [setting, setSetting] = useState('{"theme":"dark"}');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let parsedSetting;
    try {
      parsedSetting = JSON.parse(setting);
    } catch {
      setError('❌ Invalid JSON in setting field.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://poly-market-backend.vercel.app/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          username,
          password,
          wallet_address: walletAddress,
          role,
          setting: parsedSetting,
          nonce: 'fake_nonce_1234', 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      
      router.push('/Listing/Listing');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      window.location.href = 'http://localhost:5000/auth/google';
    } catch (err) {
      setError('Google signup failed.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button onClick={() => router.back()} className={styles.backButton}>
          ← Back
        </button>

        <h1 className={styles.title}>Sign Up</h1>

        <form onSubmit={handleSignup} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourusername"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Setting (JSON)</label>
            <textarea
              rows={3}
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeButton}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Wallet Address</label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x1234...abcd"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.input}
            >
              <option value="seller">seller</option>
              <option value="buyer">buyer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && (
            <div className={styles.error}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.divider}><span>or continue with</span></div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className={styles.googleButton}
        >
          <img
            src="/google-icon.svg"
            alt="Google"
            className={styles.googleIcon}
          />
          Sign Up with Google
        </button>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link href="/Auth/Login" className={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}