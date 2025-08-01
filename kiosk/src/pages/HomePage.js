// src/pages/HomePage.js (전체 코드)

import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import logo from '../kiosk_ikon.png';

function HomePage() {
  // ✨ className에 "container"와 "home-container"를 둘 다 넣어줍니다. (띄어쓰기로 구분)
  return (
    <div className="container home-container"> 
      <header className="header">
        <img src={logo} alt="로고" className="logo-img" />
      </header>
      <main className="main-content">
        <Link to="/visit">
          <button className="btn">시설 방문</button>
        </Link>
        <Link to="/reservation">
          <button className="btn">시설 예약</button>
        </Link>
      </main>
    </div>
  );
}

export default HomePage;