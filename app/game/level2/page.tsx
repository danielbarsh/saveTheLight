"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useApplicationContext } from "@/app/ApplicationContext";

const TILE_SIZE = 32;

const TILE_PATH = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#3a2a1a" />
    <rect x="0" y="0" width="16" height="16" fill="#2e2010" />
    <rect x="16" y="16" width="16" height="16" fill="#2e2010" />
  </g>
);
const TILE_GRASS = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#2a4a1a" />
    <circle cx="8" cy="8" r="2" fill="#1e3812" />
    <circle cx="24" cy="24" r="2" fill="#1e3812" />
  </g>
);
const TILE_TREE = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#0a0e04" />
    <rect x="13" y="20" width="6" height="12" fill="#3a1e08" />
    <path d="M16,3 L29,20 L3,20 Z" fill="#142808" />
    <path d="M16,7 L25,18 L7,18 Z" fill="#1c3810" />
  </g>
);
const TILE_WATER = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#0a1e3a" />
    <path d="M0,8 Q8,4 16,8 Q24,12 32,8" stroke="#1a3a6a" strokeWidth="2" fill="none" />
    <path d="M0,18 Q8,14 16,18 Q24,22 32,18" stroke="#1a3a6a" strokeWidth="2" fill="none" />
  </g>
);
const TILE_ROCK = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#1a1208" />
    <path d="M8,24 L4,16 L8,8 L16,4 L24,8 L28,16 L24,24 L16,28 Z" fill="#4a4038" />
    <path d="M16,4 L24,8 L20,12 L12,8 Z" fill="#6a6050" />
    <path d="M24,24 L16,28 L12,20 L20,16 Z" fill="#383028" />
  </g>
);
const TILE_MAGICIAN = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#2a1a40" />
    <path d="M14,3 L16,0 L18,3 L21,2 L20,5 L23,6 L20,7 L21,10 L18,9 L16,12 L14,9 L11,10 L12,7 L9,6 L12,5 L11,2 Z" fill="#ffd700" />
    <path d="M12,12 h8 v3 h2 v2 h-2 v2 h-8 v-2 h-2 v-2 h2 v-3" fill="#6a0dad" />
    <path d="M12,14 h8 v5 h-8 v-5" fill="#ffd5b0" />
    <path d="M13,16 h2 v2 h-2 v-2 M17,16 h2 v2 h-2 v-2" fill="#222" />
    <path d="M10,19 h12 v10 h-12 v-10" fill="#4b0082" />
    <path d="M22,16 h2 v11 h-2 v-11" fill="#6b3010" />
    <path d="M21,14 h4 v4 h-4 v-4" fill="#ffd700" />
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

const DRAGON_SVG = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#1a0808" />
    <ellipse cx="16" cy="18" rx="12" ry="10" fill="#6a0808" />
    <path d="M8,10 L4,2 L12,8 Z" fill="#8a0a0a" />
    <path d="M24,10 L28,2 L20,8 Z" fill="#8a0a0a" />
    <circle cx="12" cy="14" r="3" fill="#ff2000" />
    <circle cx="20" cy="14" r="3" fill="#ff2000" />
    <circle cx="12" cy="14" r="1" fill="#ffaa00" />
    <circle cx="20" cy="14" r="1" fill="#ffaa00" />
    <path d="M10,22 Q16,28 22,22" stroke="#8a1010" strokeWidth="2" fill="none" />
    <path d="M4,20 Q0,24 4,28 Q6,24 8,22" fill="#6a0808" />
    <path d="M28,20 Q32,24 28,28 Q26,24 24,22" fill="#6a0808" />
  </g>
);

export default function Level2() {
  const { score, setScore, addChoice, bgMusicRef, isPlaying, setIsPlaying, isMuted, volume, setVolume, togglePlay, toggleMute } = useApplicationContext();

  const [position, setPosition] = useState({ x: 3, y: 3 });
  const [facing, setFacing] = useState("down");
  const [showDrowningMessage, setShowDrowningMessage] = useState(false);
  const [isNearDragon, setIsNearDragon] = useState(false);
  const [isNearMagician, setIsNearMagician] = useState(false);
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [entryScore] = useState(score);

  const dragonAudioRef = useRef<HTMLAudioElement | null>(null);

  const map = [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,1,1,1,1,2,2,2,1,1,1,1,1,2,2,2,1,1,1,1,1,1,2,2,2,2,2,2,2,2],
    [2,1,0,0,1,1,2,1,1,0,0,0,1,1,2,1,1,0,0,0,0,1,1,2,2,2,2,2,2,2],
    [2,1,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,2,2,2,2,2,2],
    [2,2,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1,0,0,0,1,1,2,2,2,2,2],
    [2,2,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1,0,0,0,1,1,2,2,2,2],
    [2,2,2,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,6,6,1,1,0,0,0,1,1,2,2,2],
    [2,2,2,2,1,1,0,0,1,6,6,6,1,0,0,1,1,6,6,6,6,1,1,0,0,0,1,2,2,2],
    [2,2,2,1,1,0,0,1,1,6,6,6,1,1,0,1,6,6,6,6,6,6,1,1,0,0,1,2,2,2],
    [2,2,1,1,0,0,1,1,6,6,6,6,6,1,1,1,6,6,4,4,6,6,6,1,0,0,5,2,2,2],
    [2,1,1,0,0,1,1,6,6,6,4,4,6,6,1,1,1,4,4,4,4,6,6,1,0,7,1,2,2,2],
    [2,1,0,0,1,1,6,6,6,4,4,4,4,6,6,1,1,1,4,4,6,6,1,1,0,0,1,2,2,2],
    [2,1,0,0,1,6,6,6,4,4,4,4,4,4,6,6,1,1,1,1,1,1,1,0,0,1,1,2,2,2],
    [2,1,0,0,1,1,6,4,4,4,6,6,4,4,4,6,6,1,0,0,0,0,0,0,1,1,2,2,2,2],
    [2,1,1,0,0,1,1,1,4,6,6,6,6,4,4,4,6,1,0,0,0,0,0,1,1,2,2,2,2,2],
    [2,2,1,1,0,0,0,1,1,1,1,1,1,1,4,4,6,1,1,0,0,0,1,1,2,2,2,2,2,2],
    [2,2,2,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,1,2,2,2,2,2,2,2],
    [2,2,2,2,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ];

  useEffect(() => {
    const d = new Audio("/meetdragon.mp3");
    dragonAudioRef.current = d;
    return () => { d.pause(); d.src = ""; };
  }, []);

  const checkProximity = (x: number, y: number) => {
    const nearMag =
      (x > 0 && map[y][x - 1] === 5) || (x < map[0].length - 1 && map[y][x + 1] === 5) ||
      (y > 0 && map[y - 1][x] === 5) || (y < map.length - 1 && map[y + 1][x] === 5);
    const nearDragon =
      (x > 0 && map[y][x - 1] === 7) || (x < map[0].length - 1 && map[y][x + 1] === 7) ||
      (y > 0 && map[y - 1][x] === 7) || (y < map.length - 1 && map[y + 1][x] === 7);

    setIsNearMagician(nearMag);
    setIsNearDragon(nearDragon);

    const bg = bgMusicRef.current;
    const dragon = dragonAudioRef.current;
    if ((nearMag || nearDragon) && dragon && !playerChoice) {
      if (bg) bg.pause();
      setIsPlaying(false);
      dragon.currentTime = 0;
      dragon.play();
      dragon.onended = () => { if (bg) { bg.play(); setIsPlaying(true); } };
    } else if (!nearMag && !nearDragon && dragon) {
      dragon.pause();
      dragon.currentTime = 0;
    }
  };

  const makeChoice = (
    key: string, delta: number,
    social: number, resilience: number, empathy: number, hope: number, agency: number
  ) => {
    setScore((s) => s + delta);
    addChoice({ level: 2, npc: "דרקון", choice: key, delta, social, resilience, empathy, hope, agency });
    setPlayerChoice(key);
    setTimeout(() => { window.location.href = "/game/level3"; }, 1500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isNearDragon && !playerChoice) return;
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
      if ([2, 3, 5, 6, 7].includes(nextTile)) { setFacing(newFacing); return; }

      if (nextTile === 4) {
        setShowDrowningMessage(true);
        setTimeout(() => {
          setShowDrowningMessage(false);
          setPosition({ x: 3, y: 3 });
          setScore(entryScore);
          setIsNearDragon(false);
          setIsNearMagician(false);
        }, 2000);
      } else {
        setPosition({ x: newX, y: newY });
        checkProximity(newX, newY);
      }
      setFacing(newFacing);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, facing, isNearDragon, playerChoice, entryScore]);

  const getTile = (cell: number) => {
    switch (cell) {
      case 0: return TILE_PATH;
      case 1: return TILE_GRASS;
      case 2: return TILE_TREE;
      case 4: return TILE_WATER;
      case 5: return TILE_MAGICIAN;
      case 6: return TILE_ROCK;
      default: return TILE_PATH;
    }
  };

  const choiceResponses: Record<string, string> = {
    help:      "!אומץ לב אמיתי! הדרקון נסוג. הקוסם חופשי",
    flee:      "...רצת. הקוסם נשאר לבד. הצל מתחזק",
    negotiate: "ניסית לדבר... הדרקון לא הקשיב. אבל האומץ שלך נרשם",
    wait:      "...המתנת. הזמן עבר. הקוסם עדיין שם",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #0e0808 0%, #0a0a0a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "serif",
      }}
    >
      {/* HUD */}
      <div style={{ position: "fixed", top: 12, left: 12, zIndex: 10, background: "rgba(0,0,0,0.8)", border: "1px solid #8a1010", borderRadius: 8, padding: "8px 16px" }}>
        <div style={{ color: "#c03030", fontSize: 13, letterSpacing: 1 }}>ניקוד</div>
        <div style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>{score}</div>
      </div>

      {/* Audio controls */}
      <div style={{ position: "fixed", top: 12, right: 12, zIndex: 10, display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.7)", padding: 8, borderRadius: 8, border: "1px solid #555" }}>
        <button onClick={togglePlay} style={{ background: "#3a0a0a", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={toggleMute} style={{ background: "#3a0a0a", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range" min="0" max="1" step="0.05" value={volume}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            if (bgMusicRef.current && !isMuted) bgMusicRef.current.volume = v;
          }}
          style={{ width: 64, accentColor: "#c03030" }}
        />
      </div>

      {/* Level header */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ color: "#666", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>פרק ב׳</div>
        <h1 style={{ color: "#c03030", fontSize: 22, margin: "4px 0", textShadow: "0 0 20px rgba(180,20,20,0.6)" }}>מאורת הדרקון</h1>
        <p style={{ color: "#555", fontSize: 12, margin: 0 }}>דרקון הצל לכד קוסם — הגיע הזמן לפעול</p>
      </div>

      {/* Map */}
      <div style={{ position: "relative", width: map[0].length * TILE_SIZE, height: map.length * TILE_SIZE, border: "2px solid #3a0808", boxShadow: "0 0 40px rgba(100,0,0,0.5)" }}>
        {map.map((row, y) =>
          row.map((cell, x) => (
            <div key={`${x}-${y}`} style={{ position: "absolute", left: x * TILE_SIZE, top: y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}>
              {cell === 7 ? (
                <svg width={TILE_SIZE} height={TILE_SIZE}>{DRAGON_SVG}</svg>
              ) : (
                <svg width={TILE_SIZE} height={TILE_SIZE}>{getTile(cell)}</svg>
              )}
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

      <div style={{ marginTop: 8, color: "#444", fontSize: 11, textAlign: "center" }}>
        השתמש בחיצים לתנועה • התקרב לדרקון לעימות
      </div>

      {/* Drowning overlay */}
      {showDrowningMessage && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,20,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#0a0a1a", border: "2px solid #1a3a7a", color: "#4a8af0", padding: "32px 48px", borderRadius: 12, textAlign: "center" }}>
            <h2 style={{ fontSize: 28, margin: "0 0 8px" }}>טבעת!</h2>
            <p style={{ color: "#666", margin: 0 }}>חוזר לנקודת הכניסה...</p>
          </div>
        </div>
      )}

      {/* Magician greeting */}
      {isNearMagician && !isNearDragon && (
        <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "rgba(10,10,30,0.95)", border: "1px solid #4b0082", borderRadius: 8, padding: "12px 24px", color: "#c8a0ff", fontSize: 14, direction: "rtl", maxWidth: 400 }}>
          אלדרין: "נוסע, היזהר! הדרקון קרוב. אני מאמין בך..."
        </div>
      )}

      {/* Dragon dialog */}
      {isNearDragon && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#0d0808", border: "2px solid #8a1010", borderRadius: 12, padding: 28, maxWidth: 580, width: "90%", direction: "rtl" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, borderBottom: "1px solid #2a1010", paddingBottom: 16 }}>
              <svg width={48} height={48} style={{ flexShrink: 0 }}>
                <rect width={48} height={48} rx={8} fill="#1a0000" />
                {DRAGON_SVG}
              </svg>
              <div>
                <div style={{ color: "#c03030", fontWeight: "bold", fontSize: 15 }}>קוסם כלוא</div>
                <div style={{ color: "#666", fontSize: 11 }}>שבוי בידי דרקון הצל</div>
              </div>
            </div>

            {playerChoice ? (
              <div style={{ background: "#1a0808", border: "1px solid #3a1010", borderRadius: 8, padding: 16, textAlign: "right" }}>
                <p style={{ color: "#c03030", margin: 0, fontSize: 14 }}>{choiceResponses[playerChoice]}</p>
                <p style={{ color: "#555", margin: "8px 0 0", fontSize: 12 }}>עובר ליער הלחישות...</p>
              </div>
            ) : (
              <>
                <p style={{ color: "#e8e8e8", fontSize: 14, lineHeight: 1.7, marginBottom: 20, textAlign: "right" }}>
                  יוצא לאור! דרקון הצל לכד אותי! הוא שומר אותי כאן בחושך.
                  רק אומץ לב יכול להציל אותי עכשיו — מה תעשה?
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { key: "help",      label: "להציל את הקוסם",   img: "/images/helping-hands.jpg", delta: +5, s: 0,  r: +3, em: +2, h: 0,  a: +2 },
                    { key: "flee",      label: "לברוח מהדרקון",    img: "/images/runaway.png",       delta: -5, s: 0,  r: -3, em: 0,  h: 0,  a: -2 },
                    { key: "negotiate", label: "לנסות משא ומתן",   img: "/images/scales.png",        delta: +2, s: +1, r: 0,  em: 0,  h: 0,  a: +1 },
                    { key: "wait",      label: "לחכות ולראות",     img: "/images/sandclock.png",     delta: -5, s: 0,  r: 0,  em: 0,  h: -3, a: -2 },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => makeChoice(opt.key, opt.delta, opt.s, opt.r, opt.em, opt.h, opt.a)}
                      style={{ background: "#1a0808", border: "1px solid #3a1010", borderRadius: 8, padding: 12, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transition: "border-color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c03030")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#3a1010")}
                    >
                      <img src={opt.img} alt={opt.label} style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 6 }} />
                      <span style={{ color: "#e0e0e0", fontSize: 13 }}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
