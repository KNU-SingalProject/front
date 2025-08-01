// src/App.js (수정된 코드)

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VisitPage from './pages/VisitPage';
import ReservationPage from './pages/ReservationPage'; // ✨ 1. 새로 만든 페이지를 import
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/visit" element={<VisitPage />} />
        {/* ✨ 2. /reservation 경로에 대한 라우트를 추가합니다. */}
        <Route path="/reservation" element={<ReservationPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;