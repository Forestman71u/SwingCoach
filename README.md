# SwingCoach AI Prototype

A GitHub Pages-ready mockup for an AI golf swing coaching app.

## What this prototype includes

- Upload or record a golf swing video
- Built-in sample swing video with a “Try sample swing” button
- Preview the swing video in the browser
- Select club type, camera angle, skill level, and coach engine
- Demo AI Coach mode that works with no API key
- Optional OpenAI Backend Hook mode for a secure future endpoint
- Mock swing metrics that represent what a pose/vision model could produce later
- AI-style coaching report, drills, and practice plan
- Local browser storage for the latest analysis

## Important security note

Do not place an OpenAI API key directly in this front-end app. GitHub Pages is static hosting, so anything in JavaScript can be viewed by users. Use a backend proxy such as:

- Cloudflare Worker
- Netlify Function
- Vercel Function
- Firebase Function
- Supabase Edge Function

The prototype includes an endpoint field for testing that future backend pattern.

## Future real AI architecture

Recommended path:

1. Use MediaPipe Pose Landmarker in the browser to detect body landmarks.
2. Convert landmarks into swing metrics such as tempo, hip rotation, balance, and head movement.
3. Send metrics to a secure backend.
4. Let OpenAI generate the coaching summary, drills, and practice plan.

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, `script.js`, `README.md`, and the `assets` folder.
3. Go to **Settings → Pages**.
4. Choose **Deploy from a branch**.
5. Select `main` and `/root`.
6. Save.
