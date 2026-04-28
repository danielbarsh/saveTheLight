"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useApplicationContext } from "@/app/ApplicationContext";

export default function Level2() {
  const { score, setScore } = useApplicationContext();
  const TILE_SIZE = 32;

  const [position, setPosition] = useState({ x: 3, y: 3 });
  const [facing, setFacing] = useState("down");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showDrowningMessage, setShowDrowningMessage] = useState(false);
  const [isNearDragon, setIsNearDragon] = useState(false);
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);

  // Audio refs
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const dragonAudioRef = useRef<HTMLAudioElement | null>(null);

  const map = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 1, 0, 0, 1, 1, 2, 1, 1, 0, 0, 0, 1, 1, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2],
    [2, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2],
    [2, 2, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2],
    [2, 2, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 2, 2, 2, 2],
    [2, 2, 2, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 6, 6, 1, 1, 0, 0, 0, 1, 1, 2, 2, 2],
    [2, 2, 2, 2, 1, 1, 0, 0, 1, 6, 6, 6, 1, 0, 0, 1, 1, 6, 6, 6, 6, 1, 1, 0, 0, 0, 1, 2, 2, 2],
    [2, 2, 2, 1, 1, 0, 0, 1, 1, 6, 6, 6, 1, 1, 0, 1, 6, 6, 6, 6, 6, 6, 1, 1, 0, 0, 1, 2, 2, 2],
    [2, 2, 1, 1, 0, 0, 1, 1, 6, 6, 6, 6, 6, 1, 1, 1, 6, 6, 4, 4, 6, 6, 6, 1, 0, 0, 5, 2, 2, 2],
    [2, 1, 1, 0, 0, 1, 1, 6, 6, 6, 4, 4, 6, 6, 1, 1, 1, 4, 4, 4, 4, 6, 6, 1, 0, 7, 1, 2, 2, 2],
    [2, 1, 0, 0, 1, 1, 6, 6, 6, 4, 4, 4, 4, 6, 6, 1, 1, 1, 4, 4, 6, 6, 1, 1, 0, 0, 1, 2, 2, 2],
    [2, 1, 0, 0, 1, 6, 6, 6, 4, 4, 4, 4, 4, 4, 6, 6, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 2, 2, 2],
    [2, 1, 0, 0, 1, 1, 6, 4, 4, 4, 6, 6, 4, 4, 4, 6, 6, 1, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2],
    [2, 1, 1, 0, 0, 1, 1, 1, 4, 6, 6, 6, 6, 4, 4, 4, 6, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2],
    [2, 2, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 4, 4, 6, 1, 1, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  ];

  const tiles = {
    path: (
      <g>
        <rect width={TILE_SIZE} height={TILE_SIZE} fill="#e8d4b5" />
        <rect x="0" y="0" width="16" height="16" fill="#dcc5a7" />
        <rect x="16" y="16" width="16" height="16" fill="#dcc5a7" />
      </g>
    ),
    grass: (
      <g>
        <rect width={TILE_SIZE} height={TILE_SIZE} fill="#71aa34" />
        <circle cx="8" cy="8" r="2" fill="#5d8c2a" />
        <circle cx="24" cy="24" r="2" fill="#5d8c2a" />
        <circle cx="24" cy="8" r="2" fill="#5d8c2a" />
      </g>
    ),
    tree: (
      <g>
        <rect x="12" y="20" width="8" height="12" fill="#6e4e2c" />
        <path d="M16,4 L28,20 L4,20 Z" fill="#2d5a1e" />
        <path d="M16,8 L24,18 L8,18 Z" fill="#3a7325" />
      </g>
    ),
    house: (
      <g>
        <rect x="4" y="12" width="24" height="20" fill="#8b4513" />
        <polygon points="16,2 30,12 2,12" fill="#654321" />
        <rect x="12" y="20" width="8" height="12" fill="#4a3728" />
      </g>
    ),
    water: (
      <g>
        <rect width={TILE_SIZE} height={TILE_SIZE} fill="#4fa4f4" />
        <path d="M0,4 Q8,0 16,4 Q24,8 32,4" stroke="#65b5ff" strokeWidth="2" fill="none" />
      </g>
    ),
    magician: (
      <g>
        <path d="M12,6 h8 v2 h2 v2 h-2 v2 h-8 v-2 h-2 v-2 h2 v-2" fill="#800080" />
        <path d="M12,8 h8 v6 h-8 v-6" fill="#ffd5b0" />
        <path d="M13,10 h2 v2 h-2 v-2 M17,10 h2 v2 h-2 v-2" fill="#000" />
        <path d="M10,14 h12 v10 h-12 v-10" fill="#4b0082" />
        <path d="M10,20 h12 v2 h-12 v-2" fill="#800080" />
        <path d="M22,10 h2 v12 h-2 v-12" fill="#8b4513" />
        <path d="M21,8 h4 v4 h-4 v-4" fill="#ffd700" />
      </g>
    ),
    rock: (
      <g>
        <path d="M8,24 L4,16 L8,8 L16,4 L24,8 L28,16 L24,24 L16,28 Z" fill="#808080" />
        <path d="M16,4 L24,8 L20,12 L12,8 Z" fill="#A0A0A0" />
        <path d="M24,24 L16,28 L12,20 L20,16 Z" fill="#606060" />
        <line x1="12" y1="14" x2="16" y2="16" stroke="#707070" strokeWidth="1" />
        <line x1="20" y1="12" x2="22" y2="16" stroke="#707070" strokeWidth="1" />
      </g>
    ),
  };

  const hero: any = {
    down: (
      <g>
        <path d="M12,6 h8 v2 h2 v2 h-2 v2 h-8 v-2 h-2 v-2 h2 v-2" fill="#ffd700" />
        <path d="M12,8 h8 v6 h-8 v-6" fill="#ffd5b0" />
        <path d="M13,10 h2 v2 h-2 v-2 M17,10 h2 v2 h-2 v-2" fill="#000" />
        <path d="M10,14 h12 v10 h-12 v-10" fill="#228b22" />
        <path d="M10,20 h12 v2 h-12 v-2" fill="#8b4513" />
        <path d="M10,24 h4 v4 h-4 v-4 M18,24 h4 v4 h-4 v-4" fill="#654321" />
        <path d="M20,14 h6 v8 h-6 v-8" fill="#4169e1" />
        <path d="M21,15 h4 v6 h-4 v-6" fill="#1e90ff" />
      </g>
    ),
  };

  // ─── Initialize background music (ost.mp3) ───────────────────────────────
  useEffect(() => {
    const bg = new Audio("/ost.mp3");
    bg.loop = true;
    bg.volume = volume;
    bgMusicRef.current = bg;

    return () => {
      bg.pause();
      bg.src = "";
    };
  }, []);

  // ─── Initialize dragon/magician audio (meetdragon.mp3) ───────────────────
  useEffect(() => {
    const dragon = new Audio("/meetdragon.mp3");
    dragonAudioRef.current = dragon;

    return () => {
      dragon.pause();
      dragon.src = "";
    };
  }, []);

  // ─── Sync volume ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // ─── Play / Pause ─────────────────────────────────────────────────────────
  const togglePlay = () => {
    const bg = bgMusicRef.current;
    if (!bg) return;
    if (isPlaying) {
      bg.pause();
      setIsPlaying(false);
    } else {
      bg.play();
      setIsPlaying(true);
    }
  };

  // ─── Mute / Unmute ────────────────────────────────────────────────────────
  const toggleMute = () => {
    const bg = bgMusicRef.current;
    if (!bg) return;
    bg.volume = isMuted ? volume : 0;
    setIsMuted(!isMuted);
  };

  // ─── Proximity check ─────────────────────────────────────────────────────
  const checkMagicianInteraction = (x: number, y: number) => {
    const isBesideMagician =
      (x > 0 && map[y][x - 1] === 5) ||
      (x < map[0].length - 1 && map[y][x + 1] === 5) ||
      (y > 0 && map[y - 1][x] === 5) ||
      (y < map.length - 1 && map[y + 1][x] === 5);

    const isBesideDragon =
      (x > 0 && map[y][x - 1] === 7) ||
      (x < map[0].length - 1 && map[y][x + 1] === 7) ||
      (y > 0 && map[y - 1][x] === 7) ||
      (y < map.length - 1 && map[y + 1][x] === 7);

    setShowDialog(isBesideMagician);
    setIsNearDragon(isBesideDragon);

    const bg = bgMusicRef.current;
    const dragon = dragonAudioRef.current;

    if ((isBesideMagician || isBesideDragon) && dragon) {
      if (bg) bg.pause();
      setIsPlaying(false);

      dragon.currentTime = 0;
      dragon.play();

      dragon.onended = () => {
        if (bg) {
          bg.play();
          setIsPlaying(true);
        }
      };
    } else if (!isBesideMagician && !isBesideDragon && dragon) {
      dragon.pause();
      dragon.currentTime = 0;
    }
  };

  const handleChoice = (choice: string) => {
    setPlayerChoice(choice);
  };

  // ─── Keyboard movement ────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      let newX = position.x;
      let newY = position.y;
      let newFacing = facing;

      switch (e.key) {
        case "ArrowUp":
          newY = Math.max(0, position.y - 1);
          newFacing = "up";
          break;
        case "ArrowDown":
          newY = Math.min(map.length - 1, position.y + 1);
          newFacing = "down";
          break;
        case "ArrowLeft":
          newX = Math.max(0, position.x - 1);
          newFacing = "left";
          break;
        case "ArrowRight":
          newX = Math.min(map[0].length - 1, position.x + 1);
          newFacing = "right";
          break;
      }

      const nextTile = map[newY][newX];
      const isWalkable = ![2, 3, 6, 5].includes(nextTile);

      if (isWalkable) {
        if (map[newY][newX] === 4) {
          setShowDrowningMessage(true);
          setTimeout(() => {
            setShowDrowningMessage(false);
            setPosition({ x: 3, y: 3 });
            setScore(0);
            setShowDialog(false);
          }, 2000);
        } else {
          setPosition({ x: newX, y: newY });
          checkMagicianInteraction(newX, newY);
        }
      }
      setFacing(newFacing);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, facing]);

  return (
    <div
      className="flex flex-col items-center p-4 bg-gray-800"
      style={{ minHeight: "100vh", justifyContent: "center", width: "100%" }}
    >
      <h1>Level 2</h1>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 bg-gray-700 p-2 rounded-lg z-10">
        <div className="fixed top-4 left-4 z-10 bg-black bg-opacity-50 px-4 py-2 rounded text-white text-2xl font-bold">
          Score: {score}
        </div>
        <button
          onClick={togglePlay}
          className="p-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors"
        >
          {isPlaying ? <Pause className="text-white w-6 h-6" /> : <Play className="text-white w-6 h-6" />}
        </button>
        <button
          onClick={toggleMute}
          className="p-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors"
        >
          {isMuted ? <VolumeX className="text-white w-6 h-6" /> : <Volume2 className="text-white w-6 h-6" />}
        </button>
      </div>

      {/* Drowning overlay */}
      {showDrowningMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="bg-black border-2 border-white text-white p-8 rounded-lg text-center">
            <h2 className="text-2xl mb-4">!טבעת במים</h2>
            <p>המשחק מתחיל מחדש</p>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="relative" style={{ width: map[0].length * TILE_SIZE, height: map.length * TILE_SIZE }}>
        {map.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className="absolute"
              style={{ left: x * TILE_SIZE, top: y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}
            >
              {cell === 7 ? (
                <img src="/images/EuropeanDragon.png" width={TILE_SIZE} height={TILE_SIZE} alt="dragon" />
              ) : (
                <svg width={TILE_SIZE} height={TILE_SIZE}>
                  {cell === 0 ? tiles.path
                    : cell === 1 ? tiles.grass
                      : cell === 2 ? tiles.tree
                        : cell === 3 ? tiles.house
                          : cell === 4 ? tiles.water
                            : cell === 5 ? tiles.magician
                              : cell === 6 ? tiles.rock
                                : tiles.path}
                </svg>
              )}
            </div>
          ))
        )}

        {/* Hero */}
        <div
          className="absolute transition-all duration-100"
          style={{
            left: position.x * TILE_SIZE,
            top: position.y * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
            transform: `scale(${facing === "left" ? -1 : 1}, 1)`,
          }}
        >
          <svg width={TILE_SIZE} height={TILE_SIZE}>
            {hero[facing as any] || hero.down}
          </svg>
        </div>

        {/* Dragon dialog */}
        {isNearDragon && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 m-2 rounded">
            {playerChoice ? (
              <p>
                {playerChoice === "help"
                  ? "תודה רבה על האומץ שלך"
                  : playerChoice === "flee"
                    ? "לא! רק אל תעזוב אותי"
                    : playerChoice === "negotiate"
                      ? "הדרקון לא רוצה לשוחח"
                      : "אני מקווה שתחליט מהר"}
              </p>
            ) : (
              <>
                <p>הצילו! תציל אותי מהדרקון האיום</p>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="bg-black bg-opacity-90 p-6 rounded-lg max-w-2xl w-full mx-4">
                    <p className="text-white text-xl text-center mb-6">הצילו! תציל אותי מהדרקון האיום</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-900 p-4 rounded-lg">
                        <button
                          onClick={() => { handleChoice("help"); setScore(score + 5); setTimeout(() => setShowDialog(false), 2000); window.location.href = "/game/print"; }}
                          className="w-full h-full flex flex-col items-center gap-3"
                        >
                          <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                            <img src="/images/helping-hands.jpg" alt="Help wizard" className="w-full h-full object-cover rounded-lg" />
                          </div>
                          <span className="text-white text-right w-full">תעזור לקוסם</span>
                        </button>
                      </div>

                      <div className="bg-gray-900 p-4 rounded-lg">
                        <button
                          onClick={() => { handleChoice("flee"); setScore(score - 5); setTimeout(() => setShowDialog(false), 2000); window.location.href = "/game/print"; }}
                          className="w-full h-full flex flex-col items-center gap-3"
                        >
                          <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                            <img src="/images/runaway.png" alt="Run from dragon" className="w-full h-full object-cover rounded-lg" />
                          </div>
                          <span className="text-white text-right w-full">לברוח מהדרקון</span>
                        </button>
                      </div>

                      <div className="bg-gray-900 p-4 rounded-lg">
                        <button
                          onClick={() => { handleChoice("negotiate"); setScore(score + 2); setTimeout(() => { setShowDialog(false); window.location.href = "/game/print"; }, 2000); }}
                          className="w-full h-full flex flex-col items-center gap-3"
                        >
                          <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                            <img src="/images/scales.png" alt="Negotiate with dragon" className="w-full h-full object-cover rounded-lg" />
                          </div>
                          <span className="text-white text-right w-full">משא ומתן עם הדרקון</span>
                        </button>
                      </div>

                      <div className="bg-gray-900 p-4 rounded-lg">
                        <button
                          onClick={() => { handleChoice("wait"); setScore(score - 5); setTimeout(() => setShowDialog(false), 2000); window.location.href = "/game/print"; }}
                          className="w-full h-full flex flex-col items-center gap-3"
                        >
                          <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                            <img src="/images/sandclock.png" alt="Wait and see" className="w-full h-full object-cover rounded-lg" />
                          </div>
                          <span className="text-white text-right w-full">אחכה ואראה מה יהיה</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Magician dialog */}
        {showDialog && !isNearDragon && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 m-2 rounded">
            <p>Greetings, young adventurer! Seek ye the ancient wisdom?</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-white">
        <p>השתמש בחיצים כדי לזוז | התקרב לקוסם כדי לדבר איתו</p>
      </div>
    </div>
  );
}
