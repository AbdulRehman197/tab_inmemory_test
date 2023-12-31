import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import SaveMemory from "./SaveMemory";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
const bc = new BroadcastChannel("test_memory");
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App bc={bc} />} />
      <Route path="/newTab" element={<SaveMemory bc={bc} />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
