# LEVERAGE

LEVERAGE is the frontend for a voice-agent negotiation benchmark. It presents a BCSM training scenario, runs an observer-mode negotiation loop against an external REST backend, and renders live transcript, score, stage, pressure, emotion, avatar, participant, leaderboard, and outcome UI.

![LEVERAGE landing](public/showcase/mockup-landing.png)

## Current Scope

This repository is frontend-only.

Implemented/planned boundaries:

- The frontend renders the app shell and state-driven UI.
- The backend owns AI behavior, scoring, STT, persistence, and authoritative session state.
- Observer mode calls a REST backend turn loop.
- Human training mode is planned around Agora RTC and game-state polling.
- Browser-side TTS uses the Web Speech API.
- The avatar path uses Three.js / TalkingHead / Ready Player Me assets, with fallback handling still important.

## Screens

### Landing

![Persona landing](public/showcase/landing-persona.png)

### Session

![Session mockup](public/showcase/mockup-session.png)

![Human session](public/showcase/session-human.png)

![Agent observer session](public/showcase/session-agent.png)

![Agent 1v1 session](public/showcase/session-agent-1v1.png)

### Stage Progression

![Stage 1 to 2](public/showcase/stage-s1s2.png)

![Stage 2 to 3](public/showcase/stage-s2s3.png)

![Stage 3 to 4](public/showcase/stage-s3s4.png)

![Stage 4 to 5](public/showcase/stage-s4s5.png)

### Outcomes

![Stage advance overlay](public/showcase/outcome-stage.png)

![Surrender outcome](public/showcase/outcome-surrender.png)

![Disengaged outcome](public/showcase/outcome-disengaged.png)

![Game over outcome](public/showcase/outcome-gameover.png)

### Leaderboard

![Leaderboard](public/showcase/mockup-leaderboard.png)

## Tech Stack

- Next.js App Router
- React
- TypeScript
- CSS Modules
- Three.js
- Browser Web Speech API
- Native `fetch`
- Jest
- React Testing Library

The original plan referenced Next.js 14; the current scaffold uses the version installed in `package.json`.

## App Structure

```txt
src/
  app/
    page.tsx
    session/page.tsx
    leaderboard/page.tsx
    globals.css
  components/
    session/
    leaderboard/
    ui/
  hooks/
    useBenchmarkSession.ts
    useMicrophone.ts
    useTTS.ts
  types/
    api.ts
    leaderboard.ts
    session.ts
```

## Backend Contract

Set the backend base URL with:

```bash
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

If unset, the app defaults to `http://localhost:4000`.

Observer mode expects:

```txt
GET  /api/benchmark/presets
POST /api/benchmark/start
POST /api/benchmark/turn
POST /api/benchmark/evaluate
```

Human training mode is planned around:

```txt
GET  /api/agora/token?channelName=<channel>&uid=<uid>
GET  /api/game/state?session_id=<id>
POST /api/game/state
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Test

There is Jest configuration and test coverage in `src/__tests__`. A package script is not currently defined, so run:

```bash
npx jest
```

## Frontend Roadmap

Highest-priority frontend-only improvements:

1. Add a mock backend mode so the demo runs without API, Agora, or AI services.
2. Add an API adapter layer for all backend calls.
3. Add robust loading, empty, and error states.
4. Add session replay/report UI.
5. Improve transcript controls: auto-scroll lock, stage markers, score badges, replay, filters, export.
6. Add a full stage timeline from Active Listening to Surrender.
7. Add pressure explanation events.
8. Enrich persona cards using the existing BCSM persona matrix.
9. Harden avatar fallback states.
10. Complete mobile/responsive layouts.

## Planning References

- `../docs/superpowers/specs/2026-05-27-leverage-design.md`
- `../docs/superpowers/plans/2026-05-27-leverage-nextjs.md`
- `../design-docs/simplified-design.md`
- `../bato/app-demo-architecture.md`
- `../bato/scoring-overview.md`
- `../bato/personas/README.md`
