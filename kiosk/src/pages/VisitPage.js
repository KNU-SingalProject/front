// src/pages/VisitPage.js (수정된 코드)

import React from 'react';
import { Link } from 'react-router-dom'; // 페이지 이동을 위한 Link를 import 합니다.
import './VisitPage.css';
import logo from '../kiosk_ikon.png';
import backIcon from '../arrow_back.png'; // ✨ 1. 방금 저장한 뒤로가기 아이콘을 불러옵니다.

function VisitPage() {
  return (
    <div className="container">
      {/* ✨ 2. 뒤로가기 버튼을 Link 태그로 감싸서 추가합니다. */}
      <Link to="/" className="back-button">
        <img src={backIcon} alt="뒤로가기" className="back-icon" />
      </Link>

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