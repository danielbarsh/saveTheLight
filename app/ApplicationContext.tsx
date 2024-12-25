"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type ApplicationContextProps = {
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
  resetScore: () => void;
};

const ApplicationContext = createContext<ApplicationContextProps>({
  score: 0,
  setScore: () => {},
  resetScore: () => {},
});

export const ApplicationContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    // Initialize score from localStorage on the client
    const savedScore = localStorage.getItem("score");
    if (savedScore) {
      setScore(parseInt(savedScore, 10));
    }
  }, []);

  useEffect(() => {
    // Save the score to localStorage whenever it changes
    localStorage.setItem("score", score.toString());
  }, [score]);

  const resetScore = () => {
    setScore(0);
    localStorage.setItem("score", "0");
  };

  return (
    <ApplicationContext.Provider value={{ score, setScore, resetScore }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplicationContext = (): ApplicationContextProps => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplicationContext must be used within an ApplicationContextProvider");
  }
  return context;
};
