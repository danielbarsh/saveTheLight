"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  Dispatch,
  SetStateAction,
  RefObject,
} from "react";
import { usePathname } from "next/navigation";

// Singleton audio instance that persists across page navigations
let _bgMusic: HTMLAudioElement | null = null;
function getBgMusic(): HTMLAudioElement {
  if (!_bgMusic) {
    _bgMusic = new Audio("/ost.mp3");
    _bgMusic.loop = true;
    _bgMusic.volume = 1;
  }
  return _bgMusic;
}

export type ChoiceRecord = {
  level: number;
  npc: string;
  choice: string;
  delta: number;
  social: number;
  resilience: number;
  empathy: number;
  hope: number;
  agency: number;
};

type ApplicationContextProps = {
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
  resetScore: () => void;
  choices: ChoiceRecord[];
  addChoice: (choice: ChoiceRecord) => void;
  bgMusicRef: RefObject<HTMLAudioElement | null>;
  volume: number;
  setVolume: Dispatch<SetStateAction<number>>;
};

const ApplicationContext = createContext<ApplicationContextProps>({
  score: 0,
  setScore: () => {},
  resetScore: () => {},
  choices: [],
  addChoice: () => {},
  bgMusicRef: { current: null },
  volume: 1,
  setVolume: () => {},
});

export const ApplicationContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [score, setScore] = useState<number>(0);
  const [choices, setChoices] = useState<ChoiceRecord[]>([]);
  const [volume, setVolume] = useState(1);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const bg = getBgMusic();
    bg.volume = volume;
    bgMusicRef.current = bg;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const bg = getBgMusic();
    if (pathname.startsWith("/game/level")) {
      if (bg.paused) {
        bg.play().catch(() => {
          const resume = () => { bg.play(); document.removeEventListener("click", resume); };
          document.addEventListener("click", resume, { once: true });
        });
      }
    } else if (!pathname.startsWith("/game")) {
      bg.pause();
    }
  }, [pathname]);

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const savedScore = localStorage.getItem("score");
    if (savedScore) setScore(parseInt(savedScore, 10));
    const savedChoices = localStorage.getItem("choices");
    if (savedChoices) {
      try { setChoices(JSON.parse(savedChoices)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("score", score.toString());
  }, [score]);

  useEffect(() => {
    localStorage.setItem("choices", JSON.stringify(choices));
  }, [choices]);

  const resetScore = () => {
    setScore(0);
    setChoices([]);
    localStorage.setItem("score", "0");
    localStorage.setItem("choices", "[]");
  };

  const addChoice = (choice: ChoiceRecord) => {
    setChoices((prev) => [...prev, choice]);
  };

  return (
    <ApplicationContext.Provider
      value={{
        score, setScore, resetScore,
        choices, addChoice,
        bgMusicRef,
        volume, setVolume,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplicationContext = (): ApplicationContextProps => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplicationContext must be used within ApplicationContextProvider");
  }
  return context;
};
