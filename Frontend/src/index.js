// index.js (frontend)
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import AdminApp from "./AdminApp";
import { PreferencesProvider } from "./PreferencesContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <PreferencesProvider>
    <Router>
      <Routes>
        {/* Main user app */}
        <Route path="/*" element={<App />} />

        {/* Admin panel */}
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </Router>
  </PreferencesProvider>
);
