import { ThemeProvider } from "@mui/material/styles";
import { RefineThemes } from "@refinedev/mui";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

type ProvisionContextType = any;
import {render} from "@evanote/template-engine";
import defaultPlaybook from '/playbook.json?raw';

const defaultPlaybookJson = render(defaultPlaybook, {});
export const ProvisionContext = createContext<ProvisionContextType>(defaultPlaybookJson as ProvisionContextType);

export const ProvisionContextProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [playbook, setPlaybook] = useState(defaultPlaybookJson);

  return (
    <ProvisionContext.Provider
      value={playbook}
    >
      {children}
    </ProvisionContext.Provider>
  );
};
