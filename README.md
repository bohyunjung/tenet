# TENET · reverse playback

Record a few seconds of audio and hear it played back in reverse — inspired by the film [Tenet](https://www.imdb.com/title/tt6723592/) (2020).

Built with React 18 + Vite. Hosted on [Vercel](https://vercel.com).

## Browser support

Uses the native [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) and [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). Works in all modern desktop and mobile browsers.

| Browser | Support |
|---|---|
| Chrome / Edge 79+ | ✅ |
| Firefox 25+ | ✅ |
| Safari 14.1+ | ✅ |
| iOS Safari 14.5+ | ✅ |

## Local development

Requires **Node.js v18+**.

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bohyunjung/tenet)

Vercel auto-detects the Vite framework. No extra configuration needed.

| Setting | Value |
|---|---|
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at localhost:5173 |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests |

