import React, { useState } from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { loading, handleRegister } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const success = await handleRegister({ username, email, password })

    if (success) {
      navigate('/', { replace: true })
    } else {
      setError('Registration failed. Please check your details and try again.')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">

        <div className="auth-visual">
          <Link to="/register" className="auth-brand">
            <span className="brand-icon">I</span>
            <span>Interview GPT</span>
          </Link>

          <div className="visual-content">
            <span className="eyebrow">START YOUR NEXT CHAPTER</span>

            <h1>
              Your next role
              <br />
              <span>starts here.</span>
            </h1>

            <p>
              Build confidence before the interview. Get personalized
              questions, identify skill gaps, and prepare with a clear plan.
            </p>

            <div className="visual-dashboard">
              <div className="dashboard-top">
                <span className="dashboard-dot" />
                <span>YOUR PREPARATION TOOLKIT</span>
                <span className="dashboard-live">READY</span>
              </div>

              <div className="dashboard-main">
                <div className="feature-row">
                  <span className="feature-number">01</span>
                  <div>
                    <strong>Resume intelligence</strong>
                    <small>Understand your strengths</small>
                  </div>
                  <span className="feature-arrow">↗</span>
                </div>

                <div className="feature-row">
                  <span className="feature-number">02</span>
                  <div>
                    <strong>Job description analysis</strong>
                    <small>Find the skills employers need</small>
                  </div>
                  <span className="feature-arrow">↗</span>
                </div>

                <div className="feature-row">
                  <span className="feature-number">03</span>
                  <div>
                    <strong>AI interview preparation</strong>
                    <small>Practice with targeted questions</small>
                  </div>
                  <span className="feature-arrow">↗</span>
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
            <span className="form-eyebrow">GET STARTED</span>
            <h2>Create your account</h2>
            <p>Set up your account and start preparing.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="username">Full name</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              {!loading && <span>↗</span>}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
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

export default Register