"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useApplicationContext } from "@/app/ApplicationContext";

const TILE_SIZE = 32;

const TILE_TEMPLE = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#181820" />
    <rect x="0" y="0" width="16" height="16" fill="#14141c" />
    <rect x="16" y="16" width="16" height="16" fill="#14141c" />
    <circle cx="4" cy="4" r="1" fill="#2a2a38" />
    <circle cx="28" cy="28" r="1" fill="#2a2a38" />
  </g>
);
const TILE_ROCK = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#0e0e14" />
    <path d="M8,24 L4,16 L8,8 L16,4 L24,8 L28,16 L24,24 L16,28 Z" fill="#2e2e3a" />
    <path d="M16,4 L24,8 L20,12 L12,8 Z" fill="#3e3e50" />
    <path d="M24,24 L16,28 L12,20 L20,16 Z" fill="#20202c" />
  </g>
);
const TILE_GRASS = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#1a2228" />
    <circle cx="8" cy="8" r="2" fill="#141c20" />
    <circle cx="24" cy="24" r="2" fill="#141c20" />
  </g>
);
const TILE_TREE = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#08080e" />
    <rect x="13" y="20" width="6" height="12" fill="#181008" />
    <path d="M16,3 L29,20 L3,20 Z" fill="#0c1018" />
    <path d="M16,7 L25,18 L7,18 Z" fill="#101820" />
  </g>
);
const TILE_LAVA = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#200808" />
    <rect x="0" y="20" width={TILE_SIZE} height="12" fill="#3a1008" />
    <path d="M4,20 Q8,14 12,20 Q16,26 20,20 Q24,14 28,20" fill="#5a1808" />
    <circle cx="10" cy="22" r="3" fill="#a03010" />
    <circle cx="22" cy="18" r="2" fill="#c04010" />
  </g>
);

const TILE_ORACLE = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#08081a" />
    <circle cx="16" cy="14" r="13" fill="rgba(255,200,50,0.1)" />
    <ellipse cx="16" cy="12" rx="3" ry="3" fill="rgba(255,220,100,0.15)" />
    <path d="M9,14 Q7,28 16,30 Q25,28 23,14 Q21,9 16,7 Q11,9 9,14" fill="#14082a" />
    <path d="M9,14 Q7,28 16,30 Q25,28 23,14" stroke="#d4af37" strokeWidth="1.5" fill="none" />
    <path d="M9,14 Q11,10 16,8 Q21,10 23,14" stroke="#d4af37" strokeWidth="1" fill="none" />
    <circle cx="16" cy="8" r="5" fill="rgba(220,190,140,0.9)" />
    <circle cx="13" cy="7" r="2" fill="#d4af37" />
    <circle cx="19" cy="7" r="2" fill="#d4af37" />
    <circle cx="13" cy="7" r="1" fill="#fff8e0" />
    <circle cx="19" cy="7" r="1" fill="#fff8e0" />
    <circle cx="26" cy="6" r="5" fill="rgba(160,100,255,0.8)" />
    <circle cx="26" cy="6" r="2" fill="rgba(220,180,255,1)" />
    <path d="M13,18 Q13,22 11,24" stroke="#d4af37" strokeWidth="1" fill="none" />
    <path d="M19,18 Q19,22 21,24" stroke="#d4af37" strokeWidth="1" fill="none" />
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

// Level 5: Mountain Temple
// Oracle NPC (tile 11) at map[3][24]
// Player starts at (2, 17)
export default function Level5() {
  const { score, setScore, addChoice, bgMusicRef, isPlaying, setIsPlaying, isMuted, volume, setVolume, togglePlay, toggleMute } = useApplicationContext();

  const [position, setPosition] = useState({ x: 2, y: 17 });
  const [facing, setFacing] = useState("up");
  const [showLavaMessage, setShowLavaMessage] = useState(false);
  const [isNearOracle, setIsNearOracle] = useState(false);
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [entryScore] = useState(score);

  // 0=temple floor, 1=grass, 2=tree, 6=rock, 11=oracle, 13=lava(hazard)
  const map = [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0,2,2,2,2],
    [2,2,2,2,6,6,6,6,6,6,6,6,6,6,6,0,0,0,6,6,6,6,0,0,11,0,2,2,2,2],
    [2,2,2,6,6,6,6,6,6,6,6,6,0,0,0,0,0,0,0,0,6,6,0,0,0,0,2,2,2,2],
    [2,2,6,6,6,6,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,2,2,2,2],
    [2,2,6,6,6,6,6,6,0,0,0,0,0,0,0,0,13,13,0,0,0,0,0,0,6,6,2,2,2,2],
    [2,2,6,6,6,6,0,0,0,0,0,0,0,0,0,0,13,13,0,0,0,0,0,0,6,6,2,2,2,2],
    [2,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,2,2,2],
    [2,6,6,6,0,0,0,0,0,0,13,13,13,0,0,0,0,0,0,0,0,0,0,6,6,6,6,2,2,2],
    [2,6,6,0,0,0,0,0,0,0,13,13,13,0,0,0,0,0,0,0,0,0,6,6,6,6,6,2,2,2],
    [2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,2,2],
    [2,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,2,2],
    [2,1,0,0,0,0,0,0,0,0,0,0,0,13,13,0,0,0,0,0,0,1,1,1,6,6,6,2,2,2],
    [2,1,1,0,0,0,0,0,0,0,0,0,0,13,13,0,0,0,0,0,0,1,1,1,1,6,6,2,2,2],
    [2,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,6,6,2,2,2],
    [2,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,6,6,6,2,2,2],
    [2,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,6,6,6,6,2,2,2],
    [2,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,6,6,6,6,6,2,2,2],
    [2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,6,6,6,6,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ];


  const checkProximity = (x: number, y: number) => {
    const near =
      (x > 0 && map[y][x - 1] === 11) || (x < map[0].length - 1 && map[y][x + 1] === 11) ||
      (y > 0 && map[y - 1][x] === 11) || (y < map.length - 1 && map[y + 1][x] === 11);
    setIsNearOracle(near && !playerChoice);
  };

  const makeChoice = (
    key: string, delta: number,
    social: number, resilience: number, empathy: number, hope: number, agency: number
  ) => {
    setScore((s) => s + delta);
    addChoice({ level: 5, npc: "אורקל", choice: key, delta, social, resilience, empathy, hope, agency });
    setPlayerChoice(key);
    setIsNearOracle(false);
    setTimeout(() => { window.location.href = "/game/print"; }, 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isNearOracle) return;
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
      if ([2, 6, 11].includes(nextTile)) { setFacing(newFacing); return; }

      if (nextTile === 13) {
        setShowLavaMessage(true);
        setTimeout(() => {
          setShowLavaMessage(false);
          setPosition({ x: 2, y: 17 });
          setScore(entryScore);
          setIsNearOracle(false);
        }, 2000);
      } else {
        setPosition({ x: newX, y: newY });
        checkProximity(newX, newY);
      }
      setFacing(newFacing);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, facing, isNearOracle, playerChoice, entryScore]);

  const getTile = (cell: number) => {
    switch (cell) {
      case 0: return TILE_TEMPLE;
      case 1: return TILE_GRASS;
      case 2: return TILE_TREE;
      case 6: return TILE_ROCK;
      case 11: return TILE_ORACLE;
      case 13: return TILE_LAVA;
      default: return TILE_TEMPLE;
    }
  };

  const choiceResponses: Record<string, string> = {
    accept:    "האורקל מחייך. 'ידעתי שתבחר בכך. האור ממתין לך'",
    companions:"האורקל מהנהן. 'חוכמה. גיבורים יודעים מתי לבקש עזרה'",
    refuse:    "האורקל נשאר דומם. '...הצל ימשיך לגדול. זו בחירתך'",
    easier:    "האורקל נאנח. 'הדרך הקלה לעיתים קרובות היא הקשה ביותר'",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #040408 0%, #080814 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "serif",
      }}
    >
      {/* HUD */}
      <div style={{ position: "fixed", top: 12, left: 12, zIndex: 10, background: "rgba(0,0,0,0.85)", border: "1px solid #d4af37", borderRadius: 8, padding: "8px 16px" }}>
        <div style={{ color: "#d4af37", fontSize: 13, letterSpacing: 1 }}>ניקוד סופי</div>
        <div style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>{score}</div>
      </div>

      {/* Audio controls */}
      <div style={{ position: "fixed", top: 12, right: 12, zIndex: 10, display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.7)", padding: 8, borderRadius: 8, border: "1px solid #333" }}>
        <button onClick={togglePlay} style={{ background: "#1a1428", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={toggleMute} style={{ background: "#1a1428", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range" min="0" max="1" step="0.05" value={volume}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            if (bgMusicRef.current && !isMuted) bgMusicRef.current.volume = v;
          }}
          style={{ width: 64, accentColor: "#d4af37" }}
        />
      </div>

      {/* Level header */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ color: "#555", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>פרק ה׳ — הפינאלה</div>
        <h1 style={{ color: "#d4af37", fontSize: 22, margin: "4px 0", textShadow: "0 0 30px rgba(212,175,55,0.7)" }}>פסגת האורקל</h1>
        <p style={{ color: "#555", fontSize: 12, margin: 0 }}>רגע האמת — האורקל הקדום מחכה לתשובתך הסופית</p>
      </div>

      {/* Map */}
      <div style={{ position: "relative", width: map[0].length * TILE_SIZE, height: map.length * TILE_SIZE, border: "2px solid #2a2820", boxShadow: "0 0 60px rgba(212,175,55,0.2)" }}>
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
        טפס לפסגה • הגע לאורקל לעימות הסופי
      </div>

      {/* Lava overlay */}
      {showLavaMessage && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#100404", border: "2px solid #5a1808", color: "#c04010", padding: "32px 48px", borderRadius: 12, textAlign: "center" }}>
            <h2 style={{ fontSize: 28, margin: "0 0 8px" }}>נשרפת בלבה!</h2>
            <p style={{ color: "#555", margin: 0 }}>חוזר לבסיס ההר...</p>
          </div>
        </div>
      )}

      {/* Oracle dialog */}
      {isNearOracle && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#08081a", border: "2px solid #d4af37", borderRadius: 12, padding: 28, maxWidth: 600, width: "90%", direction: "rtl", boxShadow: "0 0 40px rgba(212,175,55,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, borderBottom: "1px solid #2a2810", paddingBottom: 16 }}>
              <svg width={56} height={56} style={{ flexShrink: 0 }}>
                <rect width={56} height={56} rx={10} fill="#04040e" />
                <g transform="scale(1.17) translate(-2, -2)">{TILE_ORACLE}</g>
              </svg>
              <div>
                <div style={{ color: "#d4af37", fontWeight: "bold", fontSize: 16 }}>אלתאריאל האורקל</div>
                <div style={{ color: "#555", fontSize: 11 }}>שומר הידע הקדום של הממלכה</div>
              </div>
            </div>

            {playerChoice ? (
              <div style={{ background: "#0e0e20", border: "1px solid #3a3810", borderRadius: 8, padding: 16, textAlign: "right" }}>
                <p style={{ color: "#d4af37", margin: 0, fontSize: 14 }}>{choiceResponses[playerChoice]}</p>
                <p style={{ color: "#444", margin: "10px 0 0", fontSize: 12 }}>מועבר לתוצאות המסע...</p>
              </div>
            ) : (
              <>
                <p style={{ color: "#e8e8f0", fontSize: 14, lineHeight: 1.9, marginBottom: 20, textAlign: "right" }}>
                  גיבור... ראיתי את מסעך בראי הכוכבים.
                  <br />
                  ראיתי כל בחירה שעשית — כל לב שנגעת בו, וכל מי שפסחת עליו.
                  <br />
                  עכשיו מגיע הרגע האמת:
                  <br />
                  <strong style={{ color: "#d4af37" }}>האם תקבל על עצמך את משימת החזרת האור לממלכה?</strong>
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { key: "accept",     label: "לקבל את המשימה",              emoji: "⚔️",  delta: +7, s: 0,  r: +4, em: 0, h: +3, a: 0  },
                    { key: "companions", label: "לקבל — אבל לבקש חברים",       emoji: "🤝",  delta: +6, s: +3, r: 0,  em: 0, h: 0,  a: +3 },
                    { key: "refuse",     label: "לסרב — זה גדול עלי",         emoji: "😔",  delta: -6, s: 0,  r: -3, em: 0, h: -3, a: 0  },
                    { key: "easier",     label: "לבקש משימה קלה יותר",        emoji: "🙈",  delta: -4, s: 0,  r: -2, em: 0, h: 0,  a: -2 },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => makeChoice(opt.key, opt.delta, opt.s, opt.r, opt.em, opt.h, opt.a)}
                      style={{ background: "#0e0e1e", border: "1px solid #2a2820", borderRadius: 8, padding: 14, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transition: "border-color 0.2s, box-shadow 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#d4af37"; e.currentTarget.style.boxShadow = "0 0 12px rgba(212,175,55,0.3)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2820"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <span style={{ fontSize: 36 }}>{opt.emoji}</span>
                      <span style={{ color: "#e8e8f0", fontSize: 13, textAlign: "center" }}>{opt.label}</span>
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
