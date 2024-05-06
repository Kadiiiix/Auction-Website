import React from "react";
import ReactDOM from "react-dom";
import "./index.css"; // Assuming you have global styles defined
import App from "./App"; // Importing App component from App.js

// ReactDOM.render is the function that instructs React to attach your App component to a specific DOM element.
import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("root"));
root.render(<App />);

