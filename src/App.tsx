import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AForm, BForm } from "./Pages";
export default function App() {
  return (
    <Routes>
      <Route path="/a" element={<AForm />} />
      <Route path="/b" element={<BForm />} />
      <Route path="*" element={<Navigate to="/a" />} />
    </Routes>
  );
}
