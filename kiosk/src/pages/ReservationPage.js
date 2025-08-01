// src/pages/ReservationPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ReservationPage.css';

// 아이콘 이미지들을 모두 import 합니다.
import backIcon from '../arrow_back.png';
import computerIcon from '../computer.png';
import nintendoIcon from '../nintendo.png';
import karaokeIcon from '../karaoke.png';
import padmintonIcon from '../padminton.png';

const options = [
  { name: '컴퓨터', icon: computerIcon },
  { name: '닌텐도', icon: nintendoIcon },
  { name: '노래방', icon: karaokeIcon },
  { name: '패드민턴', icon: padmintonIcon },
];

function ReservationPage() {
  // 어떤 옵션이 선택되었는지 기억하기 위한 state
  const [selected, setSelected] = useState(null);

  return (
    <div className="container reservation-container">
      {/* 뒤로가기 버튼 */}
      <Link to="/" className="back-button">
        <img src={backIcon} alt="뒤로가기" className="back-icon" />
      </Link>
      
      <h1 className="reservation-title">시설 예약</h1>

      {/* 4개의 시설 옵션 */}
      <div className="options-grid">
        {options.map((option) => (
          <div
            key={option.name}
            // 선택된 옵션에는 'selected' 클래스를 추가하여 다른 스타일을 적용
            className={`option-card ${selected === option.name ? 'selected' : ''}`}
            // 클릭하면 selected 상태를 현재 옵션의 이름으로 변경
            onClick={() => setSelected(option.name)}
          >
            <img src={option.icon} alt={option.name} className="option-icon" />
            <span className="option-label">{option.name}</span>
          </div>
        ))}
      </div>

      <button className="submit-btn">시설 예약</button>
    </div>
  );
}

export default ReservationPage;