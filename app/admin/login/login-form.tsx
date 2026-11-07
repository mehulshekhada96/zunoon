'use client';
import {useState} from 'react';
import Image from 'next/image';
import { BRAND_LOGO_URL } from '@/lib/brand';
import {Eye, EyeOff} from 'lucide-react';
import '../media-admin.css';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-head">
          <a href="/" className="admin-login-logo" aria-label="Zunoon Club">
            <Image src={BRAND_LOGO_URL} alt="Zunoon Club" width={160} height={54} priority style={{height:'auto'}} />
          </a>
          <div>
            <span className="admin-login-tag">ADMIN STUDIO</span>
          </div>
          <h1>Welcome back.</h1>
          <p>Sign in to manage your website content &amp; media.</p>
        </div>

        <form
          className="admin-login-form"
          onSubmit={async e => {
            e.preventDefault();
            setBusy(true);
            setError('');
            const form = new FormData(e.currentTarget);
            try {
              const r = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(Object.fromEntries(form))
              });
              const result = (await r.json()) as {error?: string};
              if (!r.ok) throw new Error(result.error || 'Invalid credentials');
              window.location.href = '/admin/';
            } catch (e) {
              setError((e as Error).message);
              setBusy(false);
            }
          }}
        >
          <label>
            Email
            <input
              type="email"
              name="email"
              autoComplete="username"
              placeholder="admin@zunoonclub.com"
              required
              disabled={busy}
            />
          </label>
          <label>
            Password
            <div className="admin-password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                required
                disabled={busy}
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          {error && <p className="admin-login-error" role="alert">{error}</p>}
          <button type="submit" className="admin-login-btn" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in to Dashboard'}
          </button>
          <a href="/" className="admin-login-back">← Back to website</a>
        </form>
      </div>
    </main>
  );
}

