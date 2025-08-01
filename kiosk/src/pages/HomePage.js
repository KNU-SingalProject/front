// src/pages/HomePage.js

import React from 'react';
import { Link } from 'react-router-dom'; // Link를 import 합니다.
import './HomePage.css'; // HomePage 전용 CSS를 불러옵니다.
import logo from '../kiosk_ikon.png'; // 로고 경로가 변경되었습니다.

function HomePage() {
  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="로고" className="logo-img" />
      </header>
      <main className="main-content">
        {/* button을 Link로 감싸서 클릭 시 페이지 이동이 되게 합니다. */}
        <Link to="/visit">
          <button className="btn">시설 방문</button>
        </Link>
        <button className="btn">시설 예약</button>
      </main>
    </div>
  );
}

export default HomePage;