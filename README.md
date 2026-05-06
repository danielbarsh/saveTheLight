# Save the Light | להציל את האור

> A browser-based RPG adventure game built with Next.js — where every choice shapes your character's moral compass.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Overview

**Save the Light** is a top-down tile-based RPG where darkness has fallen over the kingdom and the player must journey through five distinct levels to restore the light. Each encounter with an NPC presents moral dilemmas — your decisions are tracked across five psychological dimensions: social, resilience, empathy, hope, and agency.

At the end of the adventure, a personalized report card is generated, reflecting the player's choices throughout the game.

---

## Features

- **5 hand-crafted levels** — each with a unique map, tileset, atmosphere, and NPC
- **Moral choice system** — decisions affect five psychological indicators in real time
- **Score tracking** — live HUD displaying current score during gameplay
- **Ambient audio** — background music with per-scene NPC audio cues
- **Audio controls** — play/pause, mute, and volume slider always accessible
- **Final report screen** — visual breakdown of the player's psychological profile
- **Hebrew & English UI** — language toggle on the main menu
- **Tile-based movement** — smooth camera follow with viewport clipping
- **Drowning / respawn mechanic** — water tiles reset the player to the start

---

## Levels

| Level | Name | Environment | NPC |
|-------|------|-------------|-----|
| 1 | הדרך האבודה | Enchanted forest with a lake | Eldrin the Wizard |
| 2 | מאורת הדרקון | Dark cave with lava pools | Dragon |
| 3 | חושך הרוחות | Spirit realm | Wandering Spirit |
| 4 | כפר הנטוש | Abandoned village | Village Elder |
| 5 | היכל האור | Temple of Light | Final Encounter |

---

## Tech Stack

| Technology | Role |
|------------|------|
| [Next.js 15](https://nextjs.org) | Framework (App Router) |
| [React 19](https://react.dev) | UI library |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Lucide React](https://lucide.dev) | Icons |
| SVG | All game tiles and sprites — no external assets |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun

### Installation

```bash
git clone https://github.com/your-username/saveTheLight.git
cd saveTheLight
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
saveTheLight/
├── app/
│   ├── page.tsx                  # Main menu
│   ├── layout.tsx                # Root layout + context provider
│   ├── ApplicationContext.tsx    # Global state (score, choices, audio)
│   └── game/
│       ├── data/
│       │   └── levels.ts         # All five level maps (tile arrays)
│       ├── level1/page.tsx       # The Lost Path
│       ├── level2/page.tsx       # Dragon's Lair
│       ├── level3/page.tsx       # Spirit Darkness
│       ├── level4/page.tsx       # Abandoned Village
│       ├── level5/page.tsx       # Temple of Light
│       └── print/page.tsx        # End-game report card
├── public/
│   ├── images/                   # Choice images shown in dialogs
│   ├── lost.mp3                  # NPC encounter audio
│   └── meetdragon.mp3            # Dragon encounter audio
└── tailwind.config.ts
```

---

## Tile Legend

Each level map is a 2D number array. Tile codes are consistent across levels:

| Code | Tile |
|------|------|
| `0` | Path (walkable) |
| `1` | Grass (walkable) |
| `2` | Tree / Wall (blocked) |
| `3` | House (blocked) |
| `4` | Water / Lava (respawn trigger) |
| `5` | NPC (interaction trigger) |
| `6` | Exit / portal to next level |

---

## Choice & Score System

Every NPC dialog offers 4 choices. Each choice carries a point delta and affects five psychological dimensions:

- **Social** — willingness to cooperate and connect
- **Resilience** — ability to withstand adversity
- **Empathy** — understanding others' feelings
- **Hope** — optimism about the future
- **Agency** — sense of personal control

The final `/game/print` page aggregates all choices and renders a bar chart for each dimension with a narrative interpretation.

---

## Deployment

The project is configured for **Cloudflare Pages** (standalone output, unoptimized images).

```bash
npm run build
```

Deploy the `.next` directory or connect your GitHub repo directly to Cloudflare Pages / Vercel.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT © [Daniel Bar](https://github.com/your-username)
