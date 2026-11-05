'use client';
import {useState} from 'react';
import '../media-admin.css';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  return (
    <main className="admin-login">
      <form
        className="admin-panel"
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
            if (!r.ok) throw new Error(result.error);
            window.location.href = '/admin/';
          } catch (e) {
            setError((e as Error).message);
            setBusy(false);
          }
        }}
      >
        <a href="/" className="admin-brand">
          Zunoon<span>ADMIN STUDIO</span>
        </a>
        <h1>Welcome back.</h1>
        <p>Sign in to manage your website images.</p>
        <div className="admin-fields">
          <label>
            Email
            <input type="email" name="email" autoComplete="username" required disabled={busy} />
          </label>
          <label>
            Password
            <input type="password" name="password" autoComplete="current-password" required disabled={busy} />
          </label>
          {error && <p role="alert">{error}</p>}
          <button className="admin-primary" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
        <a href="/">Back to website</a>
      </form>
    </main>
  );
}

