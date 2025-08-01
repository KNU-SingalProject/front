// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VisitPage from './pages/VisitPage';
import './App.css'; // 모든 페이지에 적용될 공용 CSS

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/visit" element={<VisitPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;