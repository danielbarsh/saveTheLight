"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2 } from "lucide-react";
import Link from "next/link";
import { useApplicationContext } from "@/app/ApplicationContext";
//import { LEVEL_ONE_MAP } from "@/app/game/data/levels";
import { useRouter } from "next/dist/client/components/navigation";

const TILE_SIZE = 32;

const TILE_PATH = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#c8a87a" />
    <rect x="0" y="0" width="16" height="16" fill="#b8956a" />
    <rect x="16" y="16" width="16" height="16" fill="#b8956a" />
  </g>
);

const TILE_EXIT = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#1a1a2e" />
    <ellipse cx="16" cy="16" rx="10" ry="14" fill="#d4af37" opacity="0.6">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
    </ellipse>
    <path d="M10,16 Q16,5 22,16 T10,16" fill="#fff" opacity="0.8" />
  </g>
);

const LEVEL_ONE_MAP = [
  // אזור 1: כפר ההתחלה (צפון-מערב) - מקום בטוח יחסית
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 3, 0, 0, 0, 1, 1, 1, 3, 3, 3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 1, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 3, 3, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2],
  [2, 3, 3, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 2],

  // אזור 2: היער המכושף (מרכז ומזרח) - שבילים צרים וצפופים
  [2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0, 1, 2],
  [2, 1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1, 2],
  [2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 0, 1, 2],
  [2, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 0, 1, 3, 3, 3, 3, 3, 3, 1, 1, 1, 0, 0, 0, 0, 1, 2],
  [2, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0, 1, 3, 3, 3, 3, 3, 3, 1, 1, 1, 2, 2, 2, 1, 1, 2],
  [2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2],

  // אזור 3: אגם הייסורים (מרכז המפה) - דורש ניווט מדויק על גשרים
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 4, 4, 0, 4, 4, 4, 4, 4, 4, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2],
  [2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 1, 1, 4, 4, 0, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 2, 1, 0, 1, 1, 4, 4, 0, 4, 4, 4, 4, 4, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2],
  [2, 1, 0, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2],
  [2, 1, 0, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 0, 1, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 0, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2],
  [2, 1, 0, 2, 4, 4, 0, 0, 0, 0, 0, 4, 4, 2, 2, 0, 1, 1, 1, 1, 1, 1, 2, 4, 4, 4, 4, 4, 0, 4, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0, 1, 2],
  [2, 1, 0, 2, 4, 4, 0, 4, 4, 4, 0, 4, 4, 2, 2, 0, 0, 0, 0, 0, 0, 1, 2, 4, 4, 0, 0, 0, 0, 4, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 1, 2],
  [2, 1, 0, 2, 4, 4, 0, 4, 4, 4, 0, 4, 4, 2, 2, 2, 2, 2, 2, 2, 0, 1, 2, 4, 4, 0, 4, 4, 4, 4, 4, 2, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 2, 1, 0, 1, 2],
  [2, 1, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 2, 4, 4, 0, 4, 4, 4, 4, 4, 2, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 2, 1, 0, 1, 2],

  // אזור 4: מובלעת המכשף (דרום מזרח) - אזור קסום ומוגן
  [2, 2, 2, 2, 2, 2, 1, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 0, 2, 1, 1, 1, 1, 1, 1, 1, 2, 0, 1, 2, 1, 0, 1, 2],
  [2, 1, 1, 1, 1, 2, 1, 4, 4, 4, 2, 1, 1, 1, 1, 1, 1, 2, 0, 2, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 2, 1, 0, 2, 1, 3, 3, 3, 3, 3, 1, 2, 0, 1, 2, 1, 0, 1, 2],
  [2, 1, 3, 3, 1, 2, 1, 0, 0, 0, 0, 0, 1, 5, 1, 1, 1, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1, 2, 1, 0, 2, 1, 3, 3, 3, 3, 3, 1, 2, 0, 0, 0, 0, 0, 1, 2],
  [2, 1, 3, 3, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 1, 0, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],

  // אזור 5: קניון המוות והשער לשלב 2 (דרום)
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2],
  [2, 0, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];

const TILE_GRASS = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#3a6b1e" />
    <circle cx="8" cy="8" r="2" fill="#2d5518" />
    <circle cx="24" cy="24" r="2" fill="#2d5518" />
    <circle cx="24" cy="8" r="2" fill="#2d5518" />
  </g>
);
const TILE_TREE = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#1a2e0a" />
    <rect x="13" y="20" width="6" height="12" fill="#4a2e10" />
    <path d="M16,3 L29,20 L3,20 Z" fill="#1e4010" />
    <path d="M16,7 L25,18 L7,18 Z" fill="#265218" />
  </g>
);
const TILE_HOUSE = (
  <g>
    <rect x="4" y="12" width="24" height="20" fill="#6b3010" />
    <polygon points="16,2 30,12 2,12" fill="#4a2008" />
    <rect x="12" y="20" width="8" height="12" fill="#3a2018" />
  </g>
);
const TILE_WATER = (
  <g>
    <rect width={TILE_SIZE} height={TILE_SIZE} fill="#1a4a8a" />
    <path d="M0,8 Q8,4 16,8 Q24,12 32,8" stroke="#2a6ab0" strokeWidth="2" fill="none" />
    <path d="M0,16 Q8,12 16,16 Q24,20 32,16" stroke="#2a6ab0" strokeWidth="2" fill="none" />
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

export default function Level1() {
  const { score, setScore, resetScore, addChoice, bgMusicRef, volume, setVolume } = useApplicationContext();
  const router = useRouter(); // הגדרה
  const [position, setPosition] = useState({ x: 3, y: 3 });
  const [facing, setFacing] = useState("down");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [showDrowningMessage, setShowDrowningMessage] = useState(false);

  const magicianAudioRef = useRef<HTMLAudioElement | null>(null);



  useEffect(() => {
    const mag = new Audio("/lost.mp3");
    magicianAudioRef.current = mag;
    return () => { mag.pause(); mag.src = ""; };
  }, []);

  useEffect(() => {
    resetScore();
  }, []);

  const checkMagicianInteraction = (x: number, y: number) => {
    const near =
      (x > 0 && LEVEL_ONE_MAP[y][x - 1] === 5) ||
      (x < LEVEL_ONE_MAP[0].length - 1 && LEVEL_ONE_MAP[y][x + 1] === 5) ||
      (y > 0 && LEVEL_ONE_MAP[y - 1][x] === 5) ||
      (y < LEVEL_ONE_MAP.length - 1 && LEVEL_ONE_MAP[y + 1][x] === 5);

    if (!missionCompleted) setShowDialog(near);

    const bg = bgMusicRef.current;
    const mag = magicianAudioRef.current;
    if (near && mag) {
      if (bg) bg.pause();
      mag.currentTime = 0;
      mag.play();
      mag.onended = () => { if (bg) bg.play(); };
    } else if (!near && mag) {
      mag.pause();
      mag.currentTime = 0;
    }
  };

  const makeChoice = (
    key: string,
    delta: number,
    social: number,
    resilience: number,
    empathy: number,
    hope: number,
    agency: number
  ) => {
    setScore((s) => s + delta);
    addChoice({ level: 1, npc: "מכשף", choice: key, delta, social, resilience, empathy, hope, agency });
    setSelectedChoice(key);
    setMissionCompleted(true);
    setCanProceed(true);
    setTimeout(() => setShowDialog(false), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showDialog) return;
      let newX = position.x;
      let newY = position.y;
      let newFacing = facing;

      switch (e.key) {
        case "ArrowUp": newY = Math.max(0, position.y - 1); newFacing = "up"; break;
        case "ArrowDown": newY = Math.min(LEVEL_ONE_MAP.length - 1, position.y + 1); newFacing = "down"; break;
        case "ArrowLeft": newX = Math.max(0, position.x - 1); newFacing = "left"; break;
        case "ArrowRight": newX = Math.min(LEVEL_ONE_MAP[0].length - 1, position.x + 1); newFacing = "right"; break;
        default: return;
      }

      const nextTile = LEVEL_ONE_MAP[newY][newX];
      if ([2, 3, 5].includes(nextTile)) { setFacing(newFacing); return; }

      if (nextTile === 6) {
        if (missionCompleted) {
          router.push("/game/level2"); // הפקודה שמבצעת את המעבר
        } else {
          // אם אתה רוצה להציג הודעה שחייבים לסיים את המשימה קודם
          console.log("חייב לעזור למכשף קודם!");
        }
        return; // עוצרים כאן כדי שלא יזוז פיזית לתוך השער
      }

      if (nextTile === 4) {
        setShowDrowningMessage(true);
        setTimeout(() => {
          setShowDrowningMessage(false);
          setPosition({ x: 3, y: 3 });
          resetScore();
          setMissionCompleted(false);
          setCanProceed(false);
          setSelectedChoice(null);
          setShowDialog(false);
        }, 2000);
      } else {
        setPosition({ x: newX, y: newY });
        checkMagicianInteraction(newX, newY);
      }
      setFacing(newFacing);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, facing, showDialog, missionCompleted]);

  const getTile = (cell: number) => {
    switch (cell) {
      case 0: return TILE_PATH;
      case 1: return TILE_GRASS;
      case 2: return TILE_TREE;
      case 3: return TILE_HOUSE;
      case 4: return TILE_WATER;
      case 5: return TILE_MAGICIAN;
      case 6: return TILE_EXIT;
      default: return TILE_PATH;
    }
  };

  const choiceResponses: Record<string, string> = {
    ignore: "...נוסע קר לב. טוב. אמצא את דרכי לבד",
    directions: "תודה רבה, נוסע! הסברים ברורים. ישמור עליך האור",
    map: "!מפה! יצירתי וחכם. האור יאיר את דרכך",
    thief: "...גנב. הצל כבר לקח גם אותך",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #0a0a1a 0%, #0f1a0f 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "serif",
      }}
    >
      {/* HUD */}
      <div style={{ position: "fixed", top: 12, left: 12, zIndex: 10, background: "rgba(0,0,0,0.8)", border: "1px solid #d4af37", borderRadius: 8, padding: "8px 16px" }}>
        <div style={{ color: "#d4af37", fontSize: 13, letterSpacing: 1 }}>ניקוד</div>
        <div style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>{score}</div>
      </div>

      {/* Audio controls */}
      <div style={{ position: "fixed", top: 12, right: 12, zIndex: 10, display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.7)", padding: 8, borderRadius: 8, border: "1px solid #555" }}>
        <Volume2 size={16} color="#d4af37" />
        <input
          type="range" min="0" max="1" step="0.05" value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{ width: 80, accentColor: "#d4af37" }}
        />
      </div>

      {/* Level header */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ color: "#888", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>פרק א׳</div>
        <h1 style={{ color: "#d4af37", fontSize: 22, margin: "4px 0", textShadow: "0 0 20px rgba(212,175,55,0.5)" }}>הדרך האבודה</h1>
        <p style={{ color: "#666", fontSize: 12, margin: 0 }}>מצא את המכשף האבוד ועזור לו לשוב הביתה</p>
      </div>

      {/* Map */}
      {/* Viewport: חלון הראייה של המשחק */}
      <div style={{
        position: "relative",
        width: "100%",        // תופס את רוחב המסך הזמין
        maxWidth: "900px",    // מגביל את הרוחב כדי שלא יתפרס מדי
        height: "600px",      // גובה קבוע לחלון המשחק
        overflow: "hidden",   // מסתיר את מה שמחוץ למצלמה
        border: "4px solid #2a2a4a",
        borderRadius: "12px",
        background: "#000",
        boxShadow: "0 0 40px rgba(0,0,0,0.8)"
      }}>

        {/* Camera Container: המפה שזזה מתחת למצלמה */}
        <div style={{
          position: "absolute",
          width: LEVEL_ONE_MAP[0].length * TILE_SIZE,
          height: LEVEL_ONE_MAP.length * TILE_SIZE,
          // חישוב המרכז: מציב את השחקן תמיד באמצע ה-Viewport
          left: `calc(50% - ${position.x * TILE_SIZE + TILE_SIZE / 2}px)`,
          top: `calc(50% - ${position.y * TILE_SIZE + TILE_SIZE / 2}px)`,
          transition: "left 0.2s ease-out, top 0.2s ease-out" // תנועת מצלמה חלקה
        }}>

          {/* רינדור המפה */}
          {LEVEL_ONE_MAP.map((row, y) =>
            row.map((cell, x) => (
              <div key={`${x}-${y}`} style={{ position: "absolute", left: x * TILE_SIZE, top: y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}>
                <svg width={TILE_SIZE} height={TILE_SIZE}>{getTile(cell)}</svg>
              </div>
            ))
          )}

          {/* Hero: השחקן עכשיו נמצא בתוך המפה שזזה */}
          <div
            style={{
              position: "absolute",
              left: position.x * TILE_SIZE,
              top: position.y * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
              transition: "left 0.1s, top 0.1s",
              transform: `scaleX(${facing === "left" ? -1 : 1})`,
              zIndex: 10, // מבטיח שהשחקן תמיד מעל האריחים
            }}
          >
            <svg width={TILE_SIZE} height={TILE_SIZE}>{HERO_SVG}</svg>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ marginTop: 8, color: "#555", fontSize: 11, textAlign: "center" }}>
        השתמש בחיצים לתנועה • התקרב למכשף לדיאלוג
      </div>

      {/* Next level button */}
      {canProceed && (
        <div style={{ marginTop: 12, width: "100%", display: "flex", justifyContent: "flex-end", paddingRight: 16 }}>
          <Link
            href="/game/level2"
            style={{ padding: "10px 28px", background: "#d4af37", color: "#0a0a1a", borderRadius: 8, fontWeight: "bold", textDecoration: "none", fontSize: 15, border: "none", letterSpacing: 1 }}
          >
            המשך למאורת הדרקון ←
          </Link>
        </div>
      )}

      {/* Drowning overlay */}
      {showDrowningMessage && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,30,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#0a0a2a", border: "2px solid #1a4a8a", color: "#4a9af0", padding: "32px 48px", borderRadius: 12, textAlign: "center" }}>
            <h2 style={{ fontSize: 28, margin: "0 0 8px" }}>טבעת במים!</h2>
            <p style={{ color: "#888", margin: 0 }}>המסע מתחיל מחדש...</p>
          </div>
        </div>
      )}

      {/* Dialog modal */}
      {showDialog && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#0d0d1e", border: "2px solid #d4af37", borderRadius: 12, padding: 28, maxWidth: 580, width: "90%", direction: "rtl" }}>
            {/* NPC portrait area */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, borderBottom: "1px solid #2a2a4a", paddingBottom: 16 }}>
              <svg width={48} height={48} style={{ flexShrink: 0 }}>
                <rect width={48} height={48} rx={8} fill="#1a0a30" />
                {TILE_MAGICIAN}
              </svg>
              <div>
                <div style={{ color: "#d4af37", fontWeight: "bold", fontSize: 15 }}>אלדרין המכשף</div>
                <div style={{ color: "#aaa", fontSize: 11 }}>מכשף אבוד</div>
              </div>
            </div>

            <p style={{ color: "#e8e8e8", fontSize: 14, lineHeight: 1.7, marginBottom: 20, textAlign: "right" }}>
              נוסע! האור כבה בממלכה. מאז שהצל פשט על הארץ, איבדתי את דרכי.
              האם תעזור לי למצוא את הדרך חזרה לכפר?
            </p>

            {!selectedChoice ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { key: "ignore", label: "להתעלם", img: "/images/sayNo.png", delta: -5, s: -3, r: 0, em: -2, h: 0, a: 0 },
                  { key: "directions", label: "ללוות אותו לכפר", img: "/images/livui.jpg", delta: +8, s: +4, r: 0, em: +4, h: 0, a: 0 },
                  { key: "map", label: "לתת לו מפה", img: "/images/map.png", delta: +8, s: 0, r: 0, em: +4, h: 0, a: +4 },
                  { key: "thief", label: "לגנוב את ספריו", img: "/images/thief.png", delta: -5, s: -3, r: 0, em: -2, h: 0, a: 0 },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => makeChoice(opt.key, opt.delta, opt.s, opt.r, opt.em, opt.h, opt.a)}
                    style={{ background: "#1a1a30", border: "1px solid #3a3a5a", borderRadius: 8, padding: 12, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transition: "border-color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#d4af37")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#3a3a5a")}
                  >
                    <img src={opt.img} alt={opt.label} style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 6 }} />
                    <span style={{ color: "#e0e0e0", fontSize: 13 }}>{opt.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ background: "#1a1a30", border: "1px solid #3a3a5a", borderRadius: 8, padding: 16, textAlign: "right" }}>
                <p style={{ color: "#d4af37", margin: 0, fontSize: 14 }}>{choiceResponses[selectedChoice]}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
