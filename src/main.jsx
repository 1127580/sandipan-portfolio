import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./ai-styles.css";
import "./ai-chat-ux.css";
import "./ai-sheet.css";
import "./ai-fab.css";
createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
