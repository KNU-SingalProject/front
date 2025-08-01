// src/App.js (전체 코드)

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VisitPage from './pages/VisitPage';
import ReservationPage from './pages/ReservationPage';
import ReservationDetailsPage from './pages/ReservationDetailsPage'; // ✨ 1. 새로 만든 페이지 import
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/visit" element={<VisitPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        {/* ✨ 2. /reservation-details 경로에 대한 라우트를 추가합니다. */}
        <Route path="/reservation-details" element={<ReservationDetailsPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;