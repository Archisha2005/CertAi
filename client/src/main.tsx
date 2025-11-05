import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add FontAwesome icons
const fontAwesomeScript = document.createElement("link");
fontAwesomeScript.rel = "stylesheet";
fontAwesomeScript.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
document.head.appendChild(fontAwesomeScript);

// Add title and meta description
const title = document.createElement("title");
title.textContent = "Government e-Certificate Portal";
document.head.appendChild(title);

const description = document.createElement("meta");
description.name = "description";
description.content = "Official government portal for online application and issuance of caste, income, and residence certificates with AI-powered document verification.";
document.head.appendChild(description);

createRoot(document.getElementById("root")!).render(<App />);
