"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useApplicationContext } from "@/app/ApplicationContext";

const TILE_SIZE = 32;

const TILE_DARK = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#0e0e18" />
    <circle cx="8" cy="8" r="1" fill="#181828" />
    <circle cx="24" cy="24" r="1" fill="#181828" />
    <circle cx="20" cy="10" r="1" fill="#141422" />
  </g>
);
const TILE_TREE = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#060810" />
    <rect x="13" y="20" width="6" height="12" fill="#1a0e06" />
    <path d="M16,3 L29,20 L3,20 Z" fill="#0a1006" />
    <path d="M16,7 L25,18 L7,18 Z" fill="#0e1a0a" />
  </g>
);
const TILE_WATER = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#08101a" />
    <path d="M0,10 Q8,6 16,10 Q24,14 32,10" stroke="#102040" strokeWidth="2" fill="none" />
    <path d="M0,20 Q8,16 16,20 Q24,24 32,20" stroke="#102040" strokeWidth="2" fill="none" />
  </g>
);
const TILE_SPIRIT = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#0a0a1a" />
    <ellipse cx="16" cy="13" rx="8" ry="9" fill="rgba(180,160,255,0.75)" />
    <ellipse cx="16" cy="24" rx="7" ry="6" fill="rgba(160,140,230,0.5)" />
    <circle cx="13" cy="11" r="2" fill="rgba(80,40,200,0.95)" />
    <circle cx="19" cy="11" r="2" fill="rgba(80,40,200,0.95)" />
    <path d="M9,22 Q7,28 11,30 Q13,26 12,24" fill="rgba(180,160,255,0.35)" />
    <path d="M23,22 Q25,28 21,30 Q19,26 20,24" fill="rgba(180,160,255,0.35)" />
    <ellipse cx="16" cy="13" rx="10" ry="11" fill="none" stroke="rgba(200,180,255,0.3)" strokeWidth="1" />
  </g>
);

const HERO_SVG = (
  <g>
    <path d="M12,4 h8 v2 h2 v2 h-2 v2 h-8 v-2 h-2 v-2 h2 v-2" fill="#c8a020" />
    <path d="M12,6 h8 v6 h-8 v-6" fill="#ffd5b0" />
    <path d="M13,8 h2 v2 h-2 v-2 M17,8 h2 v2 h-2 v-2" fill="#111" />
    <path d="M10,12 h12 v10 h-12 v-10" fill="#1a5c1a" />
    <path d="M10,18 h12 v2 h-12 v-2" fill="#6b3010" />
    <path d="M10,22 h4 v6 h-4 v-6 M18,22 h4 v6 h-4 v-6" fill="#4a2e10" />
    <path d="M4,12 h6 v8 h-6 v-8" fill="#8b6914" />
    <path d="M5,13 h4 v6 h-4 v-6" fill="#a07820" />
  </g>
);

// Spirit NPC is tile 8, placed at map[4][14]
// Player starts at (2, 10)
export default function Level3() {
  const { score, setScore, addChoice, bgMusicRef, isPlaying, setIsPlaying, isMuted, volume, setVolume, togglePlay, toggleMute } = useApplicationContext();

  const [position, setPosition] = useState({ x: 2, y: 10 });
  const [facing, setFacing] = useState("down");
  const [showDrowningMessage, setShowDrowningMessage] = useState(false);
  const [isNearSpirit, setIsNearSpirit] = useState(false);
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [canProceed, setCanProceed] = useState(false);
  const [entryScore] = useState(score);

  // 0=dark floor, 2=tree, 4=water(hazard), 8=spirit NPC
  // Player: (2,10)  Spirit: (14,4)
  const map = [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,0,0,0,0,0,8,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,0,0,4,4,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,0,0,4,4,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2],
    [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2],
    [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,0,0,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ];


  const checkProximity = (x: number, y: number) => {
    const near =
      (x > 0 && map[y][x - 1] === 8) || (x < map[0].length - 1 && map[y][x + 1] === 8) ||
      (y > 0 && map[y - 1][x] === 8) || (y < map.length - 1 && map[y + 1][x] === 8);
    setIsNearSpirit(near && !playerChoice);
  };

  const makeChoice = (
    key: string, delta: number,
    social: number, resilience: number, empathy: number, hope: number, agency: number
  ) => {
    setScore((s) => s + delta);
    addChoice({ level: 3, npc: "רוח", choice: key, delta, social, resilience, empathy, hope, agency });
    setPlayerChoice(key);
    setIsNearSpirit(false);
    setCanProceed(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isNearSpirit) return;
      let newX = position.x;
      let newY = position.y;
      let newFacing = facing;

      switch (e.key) {
        case "ArrowUp":    newY = Math.max(0, position.y - 1); newFacing = "up";    break;
        case "ArrowDown":  newY = Math.min(map.length - 1, position.y + 1); newFacing = "down";  break;
        case "ArrowLeft":  newX = Math.max(0, position.x - 1); newFacing = "left";  break;
        case "ArrowRight": newX = Math.min(map[0].length - 1, position.x + 1); newFacing = "right"; break;
        default: return;
      }

      const nextTile = map[newY][newX];
      if ([2, 8].includes(nextTile)) { setFacing(newFacing); return; }

      if (nextTile === 4) {
        setShowDrowningMessage(true);
        setTimeout(() => {
          setShowDrowningMessage(false);
          setPosition({ x: 2, y: 10 });
          setScore(entryScore);
          setIsNearSpirit(false);
        }, 2000);
      } else {
        setPosition({ x: newX, y: newY });
        checkProximity(newX, newY);
      }
      setFacing(newFacing);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, facing, isNearSpirit, playerChoice, entryScore]);

  const getTile = (cell: number) => {
    if (cell === 8) return TILE_SPIRIT;
    if (cell === 4) return TILE_WATER;
    if (cell === 2) return TILE_TREE;
    return TILE_DARK;
  };

  const choiceResponses: Record<string, string> = {
    comfort:    "...לאט לאט, הרוח נרגעת. 'תודה... מזמן לא מישהו הקשיב לי'",
    guide:      "הרוח מנצנצת. 'אולי... אולי יש עוד דרך. תודה שהאמנת'",
    ignore:     "...הרוח נגנבת בחושך. 'כפי שציפיתי. כולם הולכים'",
    dismiss:    "הרוח מצטמקת. 'ידעתי. אני רק מטרד. כרגיל'",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #050510 0%, #080818 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "serif",
      }}
    >
      {/* HUD */}
      <div style={{ position: "fixed", top: 12, left: 12, zIndex: 10, background: "rgba(0,0,0,0.8)", border: "1px solid #4a3a8a", borderRadius: 8, padding: "8px 16px" }}>
        <div style={{ color: "#9a80e0", fontSize: 13, letterSpacing: 1 }}>ניקוד</div>
        <div style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>{score}</div>
      </div>

      {/* Audio controls */}
      <div style={{ position: "fixed", top: 12, right: 12, zIndex: 10, display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.7)", padding: 8, borderRadius: 8, border: "1px solid #333" }}>
        <button onClick={togglePlay} style={{ background: "#1a103a", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={toggleMute} style={{ background: "#1a103a", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range" min="0" max="1" step="0.05" value={volume}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            if (bgMusicRef.current && !isMuted) bgMusicRef.current.volume = v;
          }}
          style={{ width: 64, accentColor: "#9a80e0" }}
        />
      </div>

      {/* Level header */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ color: "#444", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>פרק ג׳</div>
        <h1 style={{ color: "#9a80e0", fontSize: 22, margin: "4px 0", textShadow: "0 0 24px rgba(150,120,255,0.6)" }}>יער הלחישות</h1>
        <p style={{ color: "#444", fontSize: 12, margin: 0 }}>קול ענוג מהחושך — רוח אבודה מחכה למישהו שיקשיב</p>
      </div>

      {/* Map */}
      <div style={{ position: "relative", width: map[0].length * TILE_SIZE, height: map.length * TILE_SIZE, border: "2px solid #1a1a3a", boxShadow: "0 0 60px rgba(80,40,160,0.3)" }}>
        {map.map((row, y) =>
          row.map((cell, x) => (
            <div key={`${x}-${y}`} style={{ position: "absolute", left: x * TILE_SIZE, top: y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}>
              <svg width={TILE_SIZE} height={TILE_SIZE}>{getTile(cell)}</svg>
            </div>
          ))
        )}
        {/* Hero */}
        <div
          style={{
            position: "absolute",
            left: position.x * TILE_SIZE,
            top: position.y * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
            transition: "left 0.1s, top 0.1s",
            transform: `scaleX(${facing === "left" ? -1 : 1})`,
          }}
        >
          <svg width={TILE_SIZE} height={TILE_SIZE}>{HERO_SVG}</svg>
        </div>
      </div>

      <div style={{ marginTop: 8, color: "#333", fontSize: 11, textAlign: "center" }}>
        השתמש בחיצים לתנועה • מצא את הרוח הנסתרת ביער
      </div>

      {canProceed && (
        <div style={{ marginTop: 12, width: "100%", display: "flex", justifyContent: "flex-end", paddingRight: 16 }}>
          <a
            href="/game/level4"
            style={{ padding: "10px 28px", background: "#9a80e0", color: "#050510", borderRadius: 8, fontWeight: "bold", textDecoration: "none", fontSize: 15, letterSpacing: 1 }}
          >
            המשך לכפר השכוח ←
          </a>
        </div>
      )}

      {/* Drowning */}
      {showDrowningMessage && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,20,0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#050510", border: "2px solid #1a1a4a", color: "#6060c0", padding: "32px 48px", borderRadius: 12, textAlign: "center" }}>
            <h2 style={{ fontSize: 28, margin: "0 0 8px" }}>נבלעת בבוץ!</h2>
            <p style={{ color: "#444", margin: 0 }}>חוזר לכניסה ליער...</p>
          </div>
        </div>
      )}

      {/* Spirit dialog */}
      {isNearSpirit && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#080818", border: "2px solid #4a3a8a", borderRadius: 12, padding: 28, maxWidth: 580, width: "90%", direction: "rtl" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, borderBottom: "1px solid #1a1a3a", paddingBottom: 16 }}>
              <svg width={48} height={48} style={{ flexShrink: 0 }}>
                <rect width={48} height={48} rx={8} fill="#050510" />
                {TILE_SPIRIT}
              </svg>
              <div>
                <div style={{ color: "#9a80e0", fontWeight: "bold", fontSize: 15 }}>רוח האבוד</div>
                <div style={{ color: "#555", fontSize: 11 }}>נשמה שנלכדה בחושך</div>
              </div>
            </div>

            <p style={{ color: "#c8c8e8", fontSize: 14, lineHeight: 1.8, marginBottom: 20, textAlign: "right" }}>
              ...שמעת את הקולות? גם אני פעם הייתי חי...
              <br />
              אבל הצל לקח ממני את הרצון. כולם עברו, אף אחד לא עצר.
              <br />
              <span style={{ color: "#7a6ab0", fontSize: 13 }}>...האם גם אתה תלך?</span>
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { key: "comfort", label: "לעצור ולהקשיב לו",       emoji: "🫂", delta: +7, s: +2, r: 0, em: +4, h: +3, a: 0  },
                { key: "guide",   label: "לעזור לו למצוא מנוחה",   emoji: "✨", delta: +6, s: 0,  r: 0, em: +3, h: +3, a: +3 },
                { key: "ignore",  label: "להתעלם וללכת",           emoji: "🚶", delta: -5, s: -2, r: 0, em: -3, h: 0,  a: 0  },
                { key: "dismiss", label: "לגרש אותו מהדרך",       emoji: "✋", delta: -6, s: 0,  r: 0, em: -4, h: -2, a: 0  },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => makeChoice(opt.key, opt.delta, opt.s, opt.r, opt.em, opt.h, opt.a)}
                  style={{ background: "#0e0e28", border: "1px solid #2a2a4a", borderRadius: 8, padding: 14, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#9a80e0")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a4a")}
                >
                  <span style={{ fontSize: 36 }}>{opt.emoji}</span>
                  <span style={{ color: "#c8c8e8", fontSize: 13, textAlign: "center" }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Post-choice message */}
      {playerChoice && (
        <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "rgba(8,8,24,0.95)", border: "1px solid #4a3a8a", borderRadius: 8, padding: "12px 24px", color: "#9a80e0", fontSize: 14, direction: "rtl", maxWidth: 400, textAlign: "center" }}>
          {choiceResponses[playerChoice]}
        </div>
      )}
    </div>
  );
}
