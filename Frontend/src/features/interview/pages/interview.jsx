/** interview report page: shows the generated report in switchable sections */
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import "../style/interview.scss"
import { useInterview } from '../hooks/useInterview'

const SECTIONS = [
  { id: 'technical', label: 'Technical Questions', short: 'TECH' },
  { id: 'behavioral', label: 'Behavioral Questions', short: 'BEHAV' },
  { id: 'roadmap', label: 'Road Map', short: 'PLAN' },
  { id: 'gaps', label: 'Skill Gaps', short: 'GAPS' },
]

const Empty = ({ text }) => <p className='empty'>{text}</p>

const QuestionList = ({ items }) => {
  const [open, setOpen] = useState(0)

  if (!items.length) return <Empty text='No questions were generated for this section.' />

  return (
    <div className='q-list'>
      {items.map((item, i) => (
        <div key={i} className={`q-item ${open === i ? 'open' : ''}`}>
          <button className='q-head' onClick={() => setOpen(open === i ? -1 : i)}>
            <span className='q-num'>Q{String(i + 1).padStart(2, '0')}</span>
            <span className='q-text'>{item.question}</span>
            <span className='q-toggle'>{open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <div className='q-body'>
              <div className='block'>
                <span className='tag amber'>INTENTION</span>
                <p>{item.intention}</p>
              </div>
              <div className='block'>
                <span className='tag mint'>MODEL ANSWER</span>
                <p>{item.answer}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const Roadmap = ({ items }) => {
  if (!items.length) return <Empty text='No road map was generated.' />

  return (
    <div className='timeline'>
      {items.map((step, i) => (
        <div key={i} className='t-step'>
          <div className='t-dot' />
          <div className='t-card'>
            <div className='t-top'>
              <span className='t-day'>Day {step.days ?? step.day}</span>
              <h3>{step.focus}</h3>
            </div>
            <ul>
              {(step.tasks || []).map((task, j) => (
                <li key={j}>{task}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

const SkillGaps = ({ items }) => {
  if (!items.length) return <Empty text='No skill gaps found. Nice work.' />

  return (
    <div className='gaps'>
      {items.map((gap, i) => {
        const severity = (gap.severity || 'low').toLowerCase()
        return (
          <div key={i} className={`gap ${severity}`}>
            <div className='gap-top'>
              <span className='gap-name'>{gap.skills ?? gap.skill}</span>
              <span className='gap-level'>{severity.toUpperCase()}</span>
            </div>
            <div className='bar'>
              <span />
            </div>
          </div>
        )
      })}
    </div>
  )
}

const Interview = () => {
  const { interviewId } = useParams()
  const { report, loading, getReportById } = useInterview()
  const [active, setActive] = useState('technical')

  // fetch the report for the id in the URL: /interview/:interviewId
  useEffect(() => {
    if (interviewId) getReportById(interviewId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId])

  // loading and empty states
  if (loading || !report) {
    return (
      <main className='report'>
        <header className='topbar'>
          <div className='brand'>
            <span className='brand-mark' />
            <span className='brand-name'>INTERVIEW<b>/</b>REPORT</span>
          </div>
          <div className='status'>
            <span className='pulse' />
            {loading ? 'LOADING REPORT' : 'NO REPORT FOUND'}
          </div>
        </header>
        <section className='summary'>
          <div>
            <p className='eyebrow'>{loading ? 'PLEASE WAIT' : 'NOTHING HERE'}</p>
            <h1>
              {loading ? 'Loading your ' : 'Report '}
              <span>{loading ? 'report...' : 'not found'}</span>
            </h1>
            {!loading && (
              <p className='back'>
                <Link to='/'>← Generate a new report</Link>
              </p>
            )}
          </div>
        </section>
      </main>
    )
  }

  const technical = report.technicalQuestions || []
  const behavioral = report.behaviourQuestions || report.behavioralQuestions || []
  const roadmap = report.preparationPlan || report.roadmap || []
  const gaps = report.skillGaps || []
  const score = Math.round(Number(report.matchScore) || 0)

  const counts = {
    technical: technical.length,
    behavioral: behavioral.length,
    roadmap: roadmap.length,
    gaps: gaps.length,
  }

  const current = SECTIONS.find((s) => s.id === active)

  return (
    <main className='report'>
      <header className='topbar'>
        <div className='brand'>
          <span className='brand-mark' />
          <span className='brand-name'>INTERVIEW<b>/</b>REPORT</span>
        </div>
        <div className='status'>
          <span className='pulse' />
          REPORT GENERATED
        </div>
      </header>

      <section className='summary'>
        <div>
          <p className='eyebrow'>ANALYSIS COMPLETE</p>
          <h1>
            Your plan for <span>{report.title || 'this role'}</span>
          </h1>
        </div>
        <div className='score' style={{ '--pct': `${score}%` }}>
          <div className='ring'>
            <b>{score}</b>
            <small>%</small>
          </div>
          <span className='score-label'>MATCH SCORE</span>
        </div>
      </section>

      <div className='layout'>
        <nav className='sidebar panel'>
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              className={`nav-item ${active === s.id ? 'active' : ''}`}
              onClick={() => setActive(s.id)}
            >
              <span className='nav-step'>{String(i + 1).padStart(2, '0')}</span>
              <span className='nav-label'>{s.label}</span>
              <span className='nav-count'>{counts[s.id]}</span>
            </button>
          ))}
        </nav>

        <section className='content panel' key={active}>
          <div className='panel-head'>
            <span className='step'>{current.short}</span>
            <span className='title'>{current.label.toUpperCase()}</span>
            <span className='count'>{counts[active]} items</span>
          </div>

          {active === 'technical' && <QuestionList items={technical} />}
          {active === 'behavioral' && <QuestionList items={behavioral} />}
          {active === 'roadmap' && <Roadmap items={roadmap} />}
          {active === 'gaps' && <SkillGaps items={gaps} />}
        </section>
      </div>
    </main>
  )
}

export default Interview