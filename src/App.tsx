import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { CenterForm, ProForm } from "./Pages";
export default function App() {
  return (
    <Routes>
      <Route path="/center" element={<CenterForm />} />
      <Route path="/pro" element={<ProForm />} />
      <Route path="*" element={<Navigate to="/center" />} />
    </Routes>
  );
}
