// src/pages/VisitPage.js

import React from 'react';
import './VisitPage.css'; // VisitPage 전용 CSS를 불러옵니다.
import logo from '../kiosk_ikon.png'; // 로고 경로가 변경되었습니다.

function VisitPage() {
  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="로고" className="logo-img" />
      </header>
      
      <p className="subtitle">시설 방문은 하루에 한 번 가능합니다.</p>

      <main className="visit-form">
        <input type="text" placeholder="Ex) 홍길동" className="input-field" />
        <input type="text" placeholder="Ex) 250801" className="input-field" />
        <button className="submit-btn">시설 방문 완료</button>
      </main>
    </div>
  );
}

export default VisitPage;