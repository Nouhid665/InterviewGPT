import React, { useState } from 'react'
import '../auth.form.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const { loading, handleLogin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const success = await handleLogin({ email, password })

    if (success) {
      navigate('/', { replace: true })
    } else {
      setError('Invalid email or password. Please try again.')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">

        <div className="auth-visual">
          <Link to="/login" className="auth-brand">
            <span className="brand-icon">I</span>
            <span>Interview GPT</span>
          </Link>

          <div className="visual-content">
            <span className="eyebrow">YOUR CAREER, REIMAGINED</span>

            <h1>
              Prepare smarter.
              <br />
              <span>Interview better.</span>
            </h1>

            <p>
              Turn your resume and job description into a focused
              interview preparation plan powered by AI.
            </p>

            <div className="visual-dashboard">
              <div className="dashboard-top">
                <span className="dashboard-dot" />
                <span>AI PREPARATION OVERVIEW</span>
                <span className="dashboard-live">LIVE</span>
              </div>

              <div className="dashboard-main">
                <div className="dashboard-score">
                  <div className="score-ring">
                    <span>85%</span>
                  </div>
                  <div>
                    <strong>Profile analysis</strong>
                    <small>Your preparation is on track</small>
                  </div>
                </div>

                <div className="dashboard-divider" />

                <div className="dashboard-task">
                  <span className="task-check">✓</span>
                  <div>
                    <strong>Resume analyzed</strong>
                    <small>Skills and experience identified</small>
                  </div>
                </div>

                <div className="dashboard-task">
                  <span className="task-check">✓</span>
                  <div>
                    <strong>Skill gaps identified</strong>
                    <small>Personalized learning roadmap</small>
                  </div>
                </div>

                <div className="dashboard-task">
                  <span className="task-pending">↗</span>
                  <div>
                    <strong>Interview questions</strong>
                    <small>Practice with relevant questions</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="visual-footer">
            <span>BUILT FOR YOUR NEXT OPPORTUNITY</span>
            <span>AI-POWERED PREPARATION</span>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="form-heading">
            <span className="form-eyebrow">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p>Continue preparing for your next interview.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
              {!loading && <span>↗</span>}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>

          <div className="auth-bottom">
            <span>© 2026 Interview GPT</span>
            <span>PREPARE WITH PURPOSE</span>
          </div>
        </div>

      </section>
    </main>
  )
}

export default Login