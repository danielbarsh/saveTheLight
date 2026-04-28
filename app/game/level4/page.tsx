"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useApplicationContext } from "@/app/ApplicationContext";

const TILE_SIZE = 32;

const TILE_PATH = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#2a2218" />
    <rect x="0" y="0" width="16" height="16" fill="#221a10" />
    <rect x="16" y="16" width="16" height="16" fill="#221a10" />
  </g>
);
const TILE_GRASS = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#2a3820" />
    <circle cx="8" cy="8" r="2" fill="#1e2a16" />
    <circle cx="24" cy="24" r="2" fill="#1e2a16" />
    <circle cx="16" cy="14" r="1" fill="#1e2a16" />
  </g>
);
const TILE_TREE = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#0a0c08" />
    <rect x="13" y="20" width="6" height="12" fill="#281606" />
    <path d="M16,3 L29,20 L3,20 Z" fill="#0e1608" />
    <path d="M16,7 L25,18 L7,18 Z" fill="#16200e" />
  </g>
);
const TILE_RUIN = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#1a1410" />
    <rect x="2" y="8" width="12" height="18" fill="#3a2a20" />
    <polygon points="8,2 16,8 0,8" fill="#2a1e16" />
    <rect x="4" y="14" width="4" height="6" fill="#1a1010" />
    <rect x="14" y="10" width="8" height="14" fill="#2e2018" />
    <rect x="15" y="20" width="6" height="8" fill="#1a1010" />
    <rect x="2" y="26" width="28" height="4" fill="#241c14" />
  </g>
);
const TILE_WATER = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#0c1820" />
    <path d="M0,10 Q8,6 16,10 Q24,14 32,10" stroke="#183050" strokeWidth="2" fill="none" />
    <path d="M0,20 Q8,16 16,20 Q24,24 32,20" stroke="#183050" strokeWidth="2" fill="none" />
  </g>
);

const TILE_CHILD = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#1a1a10" />
    <circle cx="16" cy="10" r="5" fill="#e8c090" />
    <circle cx="14" cy="9" r="1" fill="#333" />
    <circle cx="18" cy="9" r="1" fill="#333" />
    <path d="M14,13 Q16,12 18,13" stroke="#c08060" strokeWidth="1" fill="none" />
    <path d="M14,12 Q14,15 13,16" stroke="#8a7070" strokeWidth="1" fill="none" />
    <path d="M18,12 Q18,15 19,16" stroke="#8a7070" strokeWidth="1" fill="none" />
    <path d="M12,15 Q11,22 13,26 Q19,26 21,22 Q22,16 20,15 Q18,14 16,14 Q14,14 12,15 Z" fill="#7a6050" />
    <path d="M12,24 Q11,30 14,29" fill="#7a6050" />
    <path d="M20,24 Q21,30 18,29" fill="#7a6050" />
  </g>
);

const TILE_ELDER = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#1a1a14" />
    <path d="M11,14 h10 v14 h-10 v-14" fill="#6a6070" />
    <path d="M11,20 h10 v2 h-10 v-2" fill="#5a5060" />
    <circle cx="16" cy="10" r="5" fill="#e0c090" />
    <path d="M12,13 Q16,20 20,13" fill="#f0f0f0" />
    <line x1="11" y1="11" x2="10" y2="28" stroke="#f0f0f0" strokeWidth="1" />
    <circle cx="14" cy="9" r="1.5" fill="#4a3a20" />
    <circle cx="18" cy="9" r="1.5" fill="#4a3a20" />
    <rect x="22" y="8" width="3" height="20" rx="1" fill="#5a3a10" />
    <circle cx="23" cy="7" r="3" fill="#c8a020" />
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

// Level 4: Ruined Village
// Child NPC (tile 9) at map[6][8]
// Elder NPC (tile 10) at map[11][22]
// Player starts at (2, 14)
export default function Level4() {
  const { score, setScore, addChoice, bgMusicRef, isPlaying, setIsPlaying, isMuted, volume, setVolume, togglePlay, toggleMute } = useApplicationContext();

  const [position, setPosition] = useState({ x: 2, y: 14 });
  const [facing, setFacing] = useState("down");
  const [showDrowningMessage, setShowDrowningMessage] = useState(false);
  const [isNearChild, setIsNearChild] = useState(false);
  const [isNearElder, setIsNearElder] = useState(false);
  const [childChoice, setChildChoice] = useState<string | null>(null);
  const [elderChoice, setElderChoice] = useState<string | null>(null);
  const [canProceed, setCanProceed] = useState(false);
  const [entryScore] = useState(score);

  // 0=path, 1=grass, 2=tree, 3=ruin, 4=water, 9=child, 10=elder
  const map = [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,1,1,1,1,1,2,2,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,2,2,2,2,2,2],
    [2,1,3,3,1,1,2,1,1,3,3,3,1,1,2,1,1,3,3,3,3,1,1,1,2,2,2,2,2,2],
    [2,1,3,3,1,1,2,1,1,3,3,3,1,1,2,1,1,3,3,3,3,1,1,1,2,2,2,2,2,2],
    [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2],
    [2,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2],
    [2,1,0,0,0,0,0,9,0,0,1,1,2,2,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2],
    [2,1,1,0,0,0,0,0,0,0,0,1,1,2,2,1,1,1,1,1,0,0,0,0,1,2,2,2,2,2],
    [2,2,1,1,0,0,0,0,0,0,0,0,1,1,2,1,1,1,0,0,0,0,0,0,0,1,2,2,2,2],
    [2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2],
    [2,2,2,1,1,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2],
    [2,2,2,1,0,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,10,0,0,1,2,2,2,2],
    [2,2,1,1,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,3,3,3,0,0,1,1,2,2,2],
    [2,1,1,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,3,3,3,3,0,0,0,1,2,2,2],
    [2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2],
    [2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2],
    [2,2,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,2,2,2,2],
    [2,2,2,2,2,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ];


  const checkProximity = (x: number, y: number) => {
    const nearChild =
      (x > 0 && map[y][x - 1] === 9) || (x < map[0].length - 1 && map[y][x + 1] === 9) ||
      (y > 0 && map[y - 1][x] === 9) || (y < map.length - 1 && map[y + 1][x] === 9);
    const nearElder =
      (x > 0 && map[y][x - 1] === 10) || (x < map[0].length - 1 && map[y][x + 1] === 10) ||
      (y > 0 && map[y - 1][x] === 10) || (y < map.length - 1 && map[y + 1][x] === 10);

    setIsNearChild(nearChild && !childChoice);
    setIsNearElder(nearElder && !elderChoice);
  };

  const makeChildChoice = (
    key: string, delta: number,
    social: number, resilience: number, empathy: number, hope: number, agency: number
  ) => {
    setScore((s) => s + delta);
    addChoice({ level: 4, npc: "ילד", choice: key, delta, social, resilience, empathy, hope, agency });
    setChildChoice(key);
    setIsNearChild(false);
    if (elderChoice) setCanProceed(true);
  };

  const makeElderChoice = (
    key: string, delta: number,
    social: number, resilience: number, empathy: number, hope: number, agency: number
  ) => {
    setScore((s) => s + delta);
    addChoice({ level: 4, npc: "זקן", choice: key, delta, social, resilience, empathy, hope, agency });
    setElderChoice(key);
    setIsNearElder(false);
    if (childChoice) setCanProceed(true);
  };

  useEffect(() => {
    if (childChoice && elderChoice) setCanProceed(true);
  }, [childChoice, elderChoice]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isNearChild || isNearElder) return;
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
      if ([2, 3, 9, 10].includes(nextTile)) { setFacing(newFacing); return; }

      if (nextTile === 4) {
        setShowDrowningMessage(true);
        setTimeout(() => {
          setShowDrowningMessage(false);
          setPosition({ x: 2, y: 14 });
          setScore(entryScore);
          setIsNearChild(false);
          setIsNearElder(false);
        }, 2000);
      } else {
        setPosition({ x: newX, y: newY });
        checkProximity(newX, newY);
      }
      setFacing(newFacing);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, facing, isNearChild, isNearElder, childChoice, elderChoice, entryScore]);

  const getTile = (cell: number) => {
    switch (cell) {
      case 0: return TILE_PATH;
      case 1: return TILE_GRASS;
      case 2: return TILE_TREE;
      case 3: return TILE_RUIN;
      case 4: return TILE_WATER;
      case 9: return TILE_CHILD;
      case 10: return TILE_ELDER;
      default: return TILE_PATH;
    }
  };

  const childResponses: Record<string, string> = {
    share:   "הילד מחייך בפעם הראשונה מזמן. 'תודה... לא ידעתי שיש עוד אנשים טובים'",
    teach:   "עיני הילד נדלקות. 'אני יכול לעשות את זה! תודה שהאמנת בי'",
    pass:    "...הילד מסתכל ברגליים. 'כן. כולם עוברים'",
    notmine: "...הילד מקמט את פניו. 'בסדר. אני רגיל כבר לזה'",
  };
  const elderResponses: Record<string, string> = {
    wisdom:  "הזקן מחייך. 'שאלה טובה מגלה לב פתוח. הנה מה שלמדתי...'",
    rebuild: "הזקן מתיישר. 'כן! עם עוד ידיים כאלה, הכפר יחיה שוב'",
    complain:"הזקן מהנהן לאט. '...כן. גם אני ידעתי לבכות. אחר כך בנינו'",
    leave:   "הזקן מביט בדרך שעזבת. '...ילך. שייך לדרכו'",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #0a0c08 0%, #121008 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "serif",
      }}
    >
      {/* HUD */}
      <div style={{ position: "fixed", top: 12, left: 12, zIndex: 10, background: "rgba(0,0,0,0.8)", border: "1px solid #6a5020", borderRadius: 8, padding: "8px 16px" }}>
        <div style={{ color: "#c89040", fontSize: 13, letterSpacing: 1 }}>ניקוד</div>
        <div style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>{score}</div>
      </div>

      {/* Progress indicators */}
      <div style={{ position: "fixed", top: 12, left: 160, zIndex: 10, display: "flex", gap: 8 }}>
        <div style={{ background: childChoice ? "#4a6a20" : "#2a1a10", border: "1px solid #6a5020", borderRadius: 6, padding: "4px 10px", color: childChoice ? "#80c040" : "#6a5020", fontSize: 11 }}>
          {childChoice ? "✓ ילד" : "• ילד"}
        </div>
        <div style={{ background: elderChoice ? "#4a6a20" : "#2a1a10", border: "1px solid #6a5020", borderRadius: 6, padding: "4px 10px", color: elderChoice ? "#80c040" : "#6a5020", fontSize: 11 }}>
          {elderChoice ? "✓ זקן" : "• זקן"}
        </div>
      </div>

      {/* Audio controls */}
      <div style={{ position: "fixed", top: 12, right: 12, zIndex: 10, display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.7)", padding: 8, borderRadius: 8, border: "1px solid #444" }}>
        <button onClick={togglePlay} style={{ background: "#2a1a08", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={toggleMute} style={{ background: "#2a1a08", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range" min="0" max="1" step="0.05" value={volume}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            if (bgMusicRef.current && !isMuted) bgMusicRef.current.volume = v;
          }}
          style={{ width: 64, accentColor: "#c89040" }}
        />
      </div>

      {/* Level header */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ color: "#555", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>פרק ד׳</div>
        <h1 style={{ color: "#c89040", fontSize: 22, margin: "4px 0", textShadow: "0 0 20px rgba(180,130,40,0.5)" }}>הכפר השכוח</h1>
        <p style={{ color: "#555", fontSize: 12, margin: 0 }}>שני תושבים נותרו — ילד יתום וזקן חכם — שניהם צריכים עזרה</p>
      </div>

      {/* Map */}
      <div style={{ position: "relative", width: map[0].length * TILE_SIZE, height: map.length * TILE_SIZE, border: "2px solid #2a2010", boxShadow: "0 0 40px rgba(100,70,20,0.3)" }}>
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

      <div style={{ marginTop: 8, color: "#444", fontSize: 11, textAlign: "center" }}>
        מצא את הילד ואת הזקן — שניהם דורשים עזרה לפני שתמשיך
      </div>

      {canProceed && (
        <div style={{ marginTop: 12, width: "100%", display: "flex", justifyContent: "flex-end", paddingRight: 16 }}>
          <a
            href="/game/level5"
            style={{ padding: "10px 28px", background: "#c89040", color: "#0a0c08", borderRadius: 8, fontWeight: "bold", textDecoration: "none", fontSize: 15, letterSpacing: 1 }}
          >
            המשך לפסגת האורקל ←
          </a>
        </div>
      )}

      {/* Drowning */}
      {showDrowningMessage && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#0a0c08", border: "2px solid #1a2810", color: "#406020", padding: "32px 48px", borderRadius: 12, textAlign: "center" }}>
            <h2 style={{ fontSize: 28, margin: "0 0 8px" }}>נפלת לבוץ!</h2>
            <p style={{ color: "#444", margin: 0 }}>חוזר לכניסה לכפר...</p>
          </div>
        </div>
      )}

      {/* Child dialog */}
      {isNearChild && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#0e0c08", border: "2px solid #6a5020", borderRadius: 12, padding: 28, maxWidth: 580, width: "90%", direction: "rtl" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, borderBottom: "1px solid #2a2010", paddingBottom: 16 }}>
              <svg width={48} height={48} style={{ flexShrink: 0 }}>
                <rect width={48} height={48} rx={8} fill="#0a0a08" />
                {TILE_CHILD}
              </svg>
              <div>
                <div style={{ color: "#c89040", fontWeight: "bold", fontSize: 15 }}>ילד יתום</div>
                <div style={{ color: "#555", fontSize: 11 }}>נשאר לבד בכפר ההרוס</div>
              </div>
            </div>
            <p style={{ color: "#e0d8c0", fontSize: 14, lineHeight: 1.8, marginBottom: 20, textAlign: "right" }}>
              ...האם ראית את אמא שלי? היא הלכה כשהצל בא...
              <br />
              <span style={{ color: "#8a7050", fontSize: 13 }}>אני כל כך רעב. וכל כך בודד.</span>
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { key: "share",   label: "לשתף אותו באוכל",         emoji: "🍞", delta: +7, s: +3, r: 0, em: +4, h: 0,  a: 0  },
                { key: "teach",   label: "ללמד אותו לדוג ולצוד",    emoji: "🎣", delta: +6, s: 0,  r: 0, em: +3, h: +3, a: +3 },
                { key: "pass",    label: "לעבור לידו",              emoji: "🚶", delta: -5, s: -2, r: 0, em: -3, h: 0,  a: 0  },
                { key: "notmine", label: "לא הבעיה שלי",            emoji: "🤷", delta: -6, s: 0,  r: 0, em: -4, h: -2, a: 0  },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => makeChildChoice(opt.key, opt.delta, opt.s, opt.r, opt.em, opt.h, opt.a)}
                  style={{ background: "#181408", border: "1px solid #3a2a10", borderRadius: 8, padding: 14, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c89040")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#3a2a10")}
                >
                  <span style={{ fontSize: 36 }}>{opt.emoji}</span>
                  <span style={{ color: "#e0d8c0", fontSize: 13, textAlign: "center" }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Elder dialog */}
      {isNearElder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#0e0c08", border: "2px solid #6a5020", borderRadius: 12, padding: 28, maxWidth: 580, width: "90%", direction: "rtl" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, borderBottom: "1px solid #2a2010", paddingBottom: 16 }}>
              <svg width={48} height={48} style={{ flexShrink: 0 }}>
                <rect width={48} height={48} rx={8} fill="#0a0a08" />
                {TILE_ELDER}
              </svg>
              <div>
                <div style={{ color: "#c89040", fontWeight: "bold", fontSize: 15 }}>אלרון הזקן</div>
                <div style={{ color: "#555", fontSize: 11 }}>זקן הכפר ששרד את הצל</div>
              </div>
            </div>
            <p style={{ color: "#e0d8c0", fontSize: 14, lineHeight: 1.8, marginBottom: 20, textAlign: "right" }}>
              הכפר הזה היה פעם מלא אור ושמחה...
              <br />
              עכשיו נשארנו רק אנחנו הזקנים, והילדים שאין להם לאן ללכת.
              <br />
              <span style={{ color: "#8a7050", fontSize: 13 }}>האם תעזור לנו לבנות מחדש?</span>
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { key: "wisdom",  label: "לשאול בחוכמתו",          emoji: "📜", delta: +5, s: +2, r: 0, em: 0,  h: +3, a: 0  },
                { key: "rebuild", label: "לעזור לבנות מחדש",       emoji: "🔨", delta: +5, s: 0,  r: +2, em: 0,  h: 0,  a: +3 },
                { key: "complain","label": "להתלונן על הקשיים",    emoji: "😤", delta: -5, s: 0,  r: -2, em: 0,  h: -3, a: 0  },
                { key: "leave",   label: "להמשיך ללא מילה",        emoji: "🚪", delta: -5, s: -3, r: 0,  em: 0,  h: 0,  a: -2 },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => makeElderChoice(opt.key, opt.delta, opt.s, opt.r, opt.em, opt.h, opt.a)}
                  style={{ background: "#181408", border: "1px solid #3a2a10", borderRadius: 8, padding: 14, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c89040")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#3a2a10")}
                >
                  <span style={{ fontSize: 36 }}>{opt.emoji}</span>
                  <span style={{ color: "#e0d8c0", fontSize: 13, textAlign: "center" }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Post-choice toasts */}
      {childChoice && !isNearChild && (
        <div style={{ position: "fixed", bottom: elderChoice ? 130 : 80, left: "50%", transform: "translateX(-50%)", background: "rgba(14,12,8,0.95)", border: "1px solid #6a5020", borderRadius: 8, padding: "10px 20px", color: "#c89040", fontSize: 13, direction: "rtl", maxWidth: 380, textAlign: "center", zIndex: 20 }}>
          {childResponses[childChoice]}
        </div>
      )}
      {elderChoice && !isNearElder && (
        <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "rgba(14,12,8,0.95)", border: "1px solid #6a5020", borderRadius: 8, padding: "10px 20px", color: "#c89040", fontSize: 13, direction: "rtl", maxWidth: 380, textAlign: "center", zIndex: 20 }}>
          {elderResponses[elderChoice]}
        </div>
      )}
    </div>
  );
}
