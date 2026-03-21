import { createContext, useContext, useState, type ReactNode } from "react";

interface SupportContextType {
  currentInventoryTitle: string | undefined;
  setCurrentInventoryTitle: (title: string | undefined) => void;
}

const SupportContext = createContext<SupportContextType>({
  currentInventoryTitle: undefined,
  setCurrentInventoryTitle: () => {},
});

export const SupportProvider = ({ children }: { children: ReactNode }) => {
  const [currentInventoryTitle, setCurrentInventoryTitle] = useState<
    string | undefined
  >(undefined);

  return (
    <SupportContext.Provider
      value={{ currentInventoryTitle, setCurrentInventoryTitle }}
    >
      {children}
    </SupportContext.Provider>
  );
};

export const useSupportContext = () => useContext(SupportContext);
