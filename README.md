# Interview Report

I kept running into the same problem before interviews: I'd read a job description, look at my own resume, and have no real idea what they were going to ask me. So I built this.

You paste in a job description, upload your resume (PDF), write a line or two about yourself, and it gives you a report with:

- a match score for the role
- technical questions they're likely to ask, with what the interviewer is really checking and a suggested way to answer using *your* projects
- behavioural questions, same idea
- skill gaps, marked high / medium / low
- a 7-day prep plan to fix those gaps

Every report is saved to your account, so you can come back to old ones instead of generating them again.

> Screenshots coming soon. I'll add them once I finish the landing page.

## Tech stack

**Frontend:** React (Vite), React Router, SCSS
**Backend:** Node.js, Express
**Database:** MongoDB (Mongoose)
**AI:** Google Gemini API
**Other:** JWT auth, multer for uploads, a PDF parser to pull text out of resumes

## How it works

1. You submit the form. The resume goes up as a PDF.
2. The backend extracts the text from the PDF.
3. Resume text + job description + your self-description go into one prompt.
4. Gemini sends back structured JSON (scores, questions, gaps, plan).
5. That gets saved to MongoDB under your user, and you're taken to the report page.

## Running it locally

You'll need Node 18+ and a MongoDB database (local or Atlas), plus a Gemini API key.

```bash
# clone
git clone https://github.com/YOUR-USERNAME/interview-report.git
cd interview-report

# backend
cd backend
npm install
npm run dev     # runs on port 3000

# frontend (new terminal)
cd frontend
npm install
npm run dev     # runs on port 5173
```

Create a `.env` file inside `backend/`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
GOOGLE_GENAI_API_KEY=your_gemini_key
```

Don't commit this file. It's already in `.gitignore`.

## Things that tripped me up

Writing these down mostly so I don't forget them.

- **Gemini returns 503 sometimes.** The API gets overloaded and just fails. I added a retry with a growing delay (5s, then 10s) and it usually works on the third try. You'll see `Gemini error 503. Retrying...` in the terminal when it happens. That's normal.
- **Field names have to match everywhere.** My backend uses `behaviourQuestions` and `preparationPlan`, and I wrote the frontend with different names at first. Only one section showed up and it took me a while to notice why.
- **React components need a capital letter.** I named my context provider `interviewProvider` and spent way too long on a "must be used within a provider" error. Lowercase JSX tags are treated as HTML elements.
- **PDF warnings.** You'll see `TT: undefined function` in the console while parsing resumes. It's a font warning from the parser and doesn't affect the text.

## What's still missing

- A proper landing page that explains what the app does
- A logout button (the login works, I just never added the way out)
- Deleting old reports
- Downloading a report as PDF
- Rate limiting, so nobody burns through my API quota

## Folder structure

```
interview-report/
├── backend/
│   ├── src/
│   └── server.js
└── frontend/
    └── src/
        ├── features/
        │   ├── auth/
        │   └── interview/
        │       ├── hooks/        # useInterview
        │       ├── pages/        # home, interview
        │       ├── services/     # API calls
        │       └── style/
        └── App.jsx
```

## About me

I'm Nouhid, a CS student (AI specialization) from Kolkata. This is one of a few projects I've built around LLMs and RAG. If you have feedback or found a bug, open an issue or message me.

- GitHub: Nouhid665(https://github.com/Nouhid665))
- LinkedIn: [add your link](https://www.linkedin.com/in/nouhid-siddiqui-a45705330/)
- Email: nouhidsidd123@gmail.com
