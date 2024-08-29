import React from "react";

import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";

import { PrivyProvider } from "@privy-io/react-auth";
import { StateContextProvider } from "./context";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <PrivyProvider
    appId="cm06hrht800s1k0pioae9eril"
    config={{
      // Customize Privy's appearance in your app
      appearance: {
        theme: "dark",
      },
    }}
  >
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </PrivyProvider>,
);
