// src/pages/ReservationPage.js (전체 코드)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ReservationPage.css';

import backIcon from '../arrow_back.png';
import computerIcon from '../computer.png';
import nintendoIcon from '../nintendo.png';
import karaokeIcon from '../karaoke.png';
import badmintonIcon from '../padminton.png';

const options = [
  { name: '컴퓨터', icon: computerIcon },
  { name: '닌텐도', icon: nintendoIcon },
  { name: '노래방', icon: karaokeIcon },
  { name: '패드민턴', icon: badmintonIcon },
];

function ReservationPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="container reservation-container">
      <Link to="/" className="back-button">
        <img src={backIcon} alt="뒤로가기" className="back-icon" />
      </Link>
      
      <h1 className="reservation-title">시설 예약</h1>

      <div className="options-grid">
        {options.map((option) => (
          <div
            key={option.name}
            className={`option-card ${selected === option.name ? 'selected' : ''}`}
            onClick={() => setSelected(option.name)}
          >
            <img src={option.icon} alt={option.name} className="option-icon" />
            <span className="option-label">{option.name}</span>
          </div>
        ))}
      </div>
      
      {/* ✨ 버튼을 Link로 감싸고, state를 통해 선택된 시설 정보를 전달합니다. */}
      {/* ✨ selected 값이 없으면(null이면) 링크를 비활성화합니다. */}
      <Link to={selected ? "/reservation-details" : "#"} state={{ facility: selected }} className={!selected ? 'disabled-link' : ''}>
        <button className="submit-btn" disabled={!selected}>
          시설 예약
        </button>
      </Link>
    </div>
  );
}

export default ReservationPage;