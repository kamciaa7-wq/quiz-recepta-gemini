'use client';

import { useState } from 'react';

export default function Home() {
  const [first_name, setFirst] = useState('');
  const [last_name, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  async function startQuiz() {
    setError('');

    const r = await fetch('/api/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name,
        last_name,
        email
      })
    });

    const j = await r.json();

    if (!r.ok) {
      setError(j.error || 'Błąd');
      return;
    }

    localStorage.setItem('quiz_attempt_id', j.id);
    window.location.href = '/quiz';
  }

  return (
    <main className="wrap">
      <div className="phone">

        <div className="brand">
          <img
            src="/Zrzut ekranu 2026-05-29 112620.png"
            alt="Recepta Gemini"
          />
        </div>

        <h1 className="h1">
          Zacznij quiz
        </h1>

        <div className="sub">
          Wypełnij formularz i rozpocznij test.
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <label className="label">
          Imię
        </label>

        <input
          className="input"
          value={first_name}
          onChange={e => setFirst(e.target.value)}
        />

        <label className="label">
          Nazwisko
        </label>

        <input
          className="input"
          value={last_name}
          onChange={e => setLast(e.target.value)}
        />

        <label className="label">
          Email
        </label>

        <input
          className="input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <button
          className="btn"
          onClick={startQuiz}
        >
          Start quizu
        </button>

      </div>
    </main>
  );
}
