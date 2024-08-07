import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./providers/i18n";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <React.Suspense fallback={<div className="lds-dual-ring-flex"><div className="lds-dual-ring"></div></div>}>
        <App/>
    </React.Suspense>
  </React.StrictMode>
);
