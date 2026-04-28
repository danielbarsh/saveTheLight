"use client";

import React, {
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
  // Global background music
  bgMusicRef: RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  isMuted: boolean;
  setIsMuted: Dispatch<SetStateAction<boolean>>;
  volume: number;
  setVolume: Dispatch<SetStateAction<number>>;
  togglePlay: () => void;
  toggleMute: () => void;
};

const ApplicationContext = createContext<ApplicationContextProps>({
  score: 0,
  setScore: () => {},
  resetScore: () => {},
  choices: [],
  addChoice: () => {},
  bgMusicRef: { current: null },
  isPlaying: false,
  setIsPlaying: () => {},
  isMuted: false,
  setIsMuted: () => {},
  volume: 1,
  setVolume: () => {},
  togglePlay: () => {},
  toggleMute: () => {},
});

export const ApplicationContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [score, setScore] = useState<number>(0);
  const [choices, setChoices] = useState<ChoiceRecord[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Create the audio element once — it lives for the entire session
  useEffect(() => {
    const bg = new Audio("/ost.mp3");
    bg.loop = true;
    bg.volume = volume;
    bgMusicRef.current = bg;

    return () => {
      bg.pause();
      bg.src = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep volume/mute synced whenever they change
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Restore score/choices from localStorage on mount
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

  const toggleMute = () => {
    const bg = bgMusicRef.current;
    if (!bg) return;
    bg.volume = isMuted ? volume : 0;
    setIsMuted((prev) => !prev);
  };

  return (
    <ApplicationContext.Provider
      value={{
        score, setScore, resetScore,
        choices, addChoice,
        bgMusicRef, isPlaying, setIsPlaying,
        isMuted, setIsMuted,
        volume, setVolume,
        togglePlay, toggleMute,
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
