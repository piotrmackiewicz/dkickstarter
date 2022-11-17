import React, { ReactNode, useState } from "react";

interface IAppLoadingContext {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
}

const AppLoadingContext = React.createContext<IAppLoadingContext>(
  {} as IAppLoadingContext
);

interface Props {
  children: ReactNode;
}

export const AppLoadingProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (value: boolean) => setIsLoading(value);

  return (
    <AppLoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </AppLoadingContext.Provider>
  );
};

export const useAppLoadingContext = () => {
  const ctx = React.useContext(AppLoadingContext);

  if (!ctx) {
    throw new Error(
      "useAppLoadingContext must be used within AppLoadingProvider"
    );
  }

  return ctx;
};
