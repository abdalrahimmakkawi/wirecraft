import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { Workspace } from './components/Workspace';
import './index.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<Workspace />} />
    </Routes>
  );
}
