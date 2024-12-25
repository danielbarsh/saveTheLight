"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define the shape of the context
type ApplicationContextProps = {
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
};

// Create context with default values
const ApplicationContext = createContext<ApplicationContextProps>({
  score: 0,
  setScore: () => {},
});

// Create a provider component
export const ApplicationContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [score, setScore] = useState<number>(0);

  return (
    <ApplicationContext.Provider value={{ score, setScore }}>
      {children}
    </ApplicationContext.Provider>
  );
};

// Custom hook to use the context
export const useApplicationContext = (): ApplicationContextProps => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};
