/** home page where we take inputs from the user and list their past reports */
import React, { useState, useRef, useEffect } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'

const MAX_DESC = 500

// turns "2026-11-10T14:57:04.639Z" into "10 Nov 2026"
const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const Home = () => {
  /* ---------- HOOKS & STATE ---------- */
  const { loading, generateReport, reports, getReport } = useInterview()
  const { handleLogout, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [resumeName, setResumeName] = useState('')
  const [error, setError] = useState('')

  // ref to the real file input so we can read the File object on submit
  const resumeInputRef = useRef(null)

  // load all past reports of this user when the page opens
  useEffect(() => {
    getReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---------- HANDLERS ---------- */
  const handleFile = (e) => {
    const file = e.target.files?.[0]
    setResumeName(file ? file.name : '')
  }

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files?.[0]
    if (!resumeFile) return

    setError('')
    try {
      const data = await generateReport({ jobDescription, selfDescription, resumeFile })
      if (data?._id) {
        navigate(`/interview/${data._id}`)
      } else {
        setError('Could not generate the report. Please try again.')
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    }
  }
  const onLogout = async () => {
    const success = await handleLogout()

    if (success) {
        navigate('/login', { replace: true })
    }
}

  /* ---------- DERIVED VALUES ---------- */
  const ready = jobDescription.trim() && selfDescription.trim() && resumeName

  // newest report first
  const pastReports = [...(reports || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  /* ---------- LOADING SCREEN ---------- */
  // only while a report is being generated (not while the list loads)
  if (loading && !pastReports.length) {
    return (
      <main className='home'>
        <section className='hero'>
          <p className='eyebrow'>PLEASE WAIT</p>
          <h1>
            Analysing <span>your profile...</span>
          </h1>
          <p className='sub'>This can take a few seconds.</p>
        </section>
      </main>
    )
  }

  return (
    <main className='home'>
      {/* ================= HEADER ================= */}
      <header className='topbar'>
          <div className='brand'>
              <span className='brand-mark' />
              <span className='brand-name'>Interview GPT</span>
          </div>

          <div className='header-actions'>
              <div className='status'>
                  <span className='pulse' />
                  {loading ? 'ANALYSING' : 'SYSTEM READY'}
              </div>

              <button
                  className='logout-btn'
                  onClick={onLogout}
                  disabled={authLoading}
              >
                  {authLoading ? 'LOGGING OUT...' : 'LOGOUT ↗'}
              </button>
          </div>
      </header>

      {/* ================= HERO ================= */}
      <section className='hero'>
        <p className='eyebrow'>AI-POWERED PREP ENGINE</p>
        <h1>
          Know the interview <br />
          <span>before you walk in.</span>
        </h1>
        <p className='sub'>
          Drop in the role, your resume and a line about you. Get a tailored
          report with likely questions, skill gaps and a prep plan.
        </p>
      </section>

      {/* ================= MAIN FORM ================= */}
      <div className='workspace'>
        {/* ---- LEFT: job description ---- */}
        <div className='panel left'>
          <div className='panel-head'>
            <span className='step'>01</span>
            <span className='title'>JOB DESCRIPTION</span>
            <span className='count'>{jobDescription.length} chars</span>
          </div>
          <textarea
            name="jobDescription"
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder='Paste the full job description here...'
          />
        </div>

        {/* ---- RIGHT: resume, self description, submit ---- */}
        <div className='right'>
          {/* resume upload */}
          <div className='panel input-group'>
            <div className='panel-head'>
              <span className='step'>02</span>
              <span className='title'>RESUME</span>
              <span className='count'>PDF</span>
            </div>
            <input
              ref={resumeInputRef}
              type="file"
              name="resume"
              id="resume"
              accept=".pdf"
              onChange={handleFile}
            />
            <label htmlFor="resume" className={`dropzone ${resumeName ? 'filled' : ''}`}>
              <span className='icon'>{resumeName ? '✓' : '↑'}</span>
              <span className='dz-text'>
                <strong>{resumeName || 'Upload your resume'}</strong>
                <small>{resumeName ? 'Click to replace file' : 'Click to browse · .pdf only'}</small>
              </span>
            </label>
          </div>

          {/* self description */}
          <div className='panel input-group'>
            <div className='panel-head'>
              <span className='step'>03</span>
              <span className='title'>ABOUT YOU</span>
              <span className='count'>{selfDescription.length}/{MAX_DESC}</span>
            </div>
            <textarea
              name="selfDescription"
              id="selfDescription"
              maxLength={MAX_DESC}
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              placeholder='Describe yourself in a sentence or two...'
            />
          </div>

          {/* submit button + status hint */}
          <button
            className='generate-btn'
            disabled={!ready || loading}
            onClick={handleGenerateReport}
          >
            <span>{loading ? 'Analysing your profile...' : 'Generate Interview Report'}</span>
            <span className='arrow'>{loading ? '…' : '→'}</span>
          </button>
          <p className={`hint ${error ? 'error' : ''}`}>
            {error
              ? error
              : loading
                ? 'This can take a few seconds. Hang tight.'
                : ready
                  ? 'All set. Run the analysis.'
                  : 'Complete all three steps to continue.'}
          </p>
        </div>
      </div>

      {/* ================= PAST REPORTS ================= */}
      {pastReports.length > 0 && (
        <section className='history'>
          <div className='history-head'>
            <span className='eyebrow'>YOUR PAST REPORTS</span>
            <span className='history-count'>{pastReports.length} saved</span>
          </div>

          <div className='history-grid'>
            {pastReports.map((item) => (
              <button
                key={item._id}
                className='history-card'
                onClick={() => navigate(`/interview/${item._id}`)}
              >
                <div className='hc-top'>
                  <span className='hc-date'>{formatDate(item.createdAt)}</span>
                  <span className='hc-score'>{Math.round(Number(item.matchScore) || 0)}%</span>
                </div>
                <h3>{item.title || 'Untitled role'}</h3>
                <span className='hc-open'>Open report →</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ================= FOOTER ================= */}
      <footer className='footer'>
        <span>Interview GPT</span>
        <span>Prepare smarter. Interview better.</span>
      </footer>
    </main>
  )
}

export default Home