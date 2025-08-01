// src/pages/ReservationDetailsPage.js (전체 코드)

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './ReservationDetailsPage.css';

import backIcon from '../arrow_back.png';
import homeIcon from '../home_icon.png';

function ReservationDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // 이전 페이지에서 전달받은 시설 이름. 없을 경우 'OOO' 표시
  const facility = location.state?.facility || 'OOO';

  // 상태 관리
  const [reservists, setReservists] = useState([]); // 예약자 명단 배열
  const [name, setName] = useState(''); // 이름 입력창
  const [id, setId] = useState(''); // 번호 입력창

  // '예약자 추가' 버튼 클릭 시 실행될 함수
  const handleAddReservist = () => {
    if (name.trim() === '' || id.trim() === '') {
      alert('이름과 번호를 모두 입력해주세요.');
      return;
    }
    if (reservists.length >= 10) {
      alert('예약자 명단이 가득 찼습니다.');
      return;
    }
    setReservists([...reservists, { name, id }]);
    setName(''); // 입력창 초기화
    setId('');   // 입력창 초기화
  };

  // '예약 완료' 버튼 클릭 시 실행될 함수
  const handleCompleteReservation = () => {
    if (reservists.length === 0) {
      alert('최소 한 명 이상의 예약자를 추가해야 합니다.');
      return;
    }
    alert(`${facility} 예약이 완료되었습니다.`);
    navigate('/'); // 홈으로 이동
  };

  return (
    <div className="container details-container">
      <Link to="/reservation" className="back-button">
        <img src={backIcon} alt="뒤로가기" className="back-icon" />
      </Link>
      <Link to="/" className="home-button">
        <img src={homeIcon} alt="홈으로" className="home-icon" />
      </Link>
      
      <h1 className="details-title">시설 예약</h1>

      <main className="details-content">
        {/* 왼쪽 예약자 명단 */}
        <section className="reservist-list-section">
          <h2>{facility} 예약자 명단</h2>
          <ul className="reservist-list">
            {Array.from({ length: 10 }).map((_, index) => (
              <li key={index}>
                {`${index + 1}번: `}
                <span>{reservists[index] ? `${reservists[index].name} (${reservists[index].id})` : '-'}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 오른쪽 예약 폼 */}
        <section className="reservation-form-section">
          <input 
            type="text" 
            placeholder="Ex) 홍길동, 이춘향, ..." 
            className="details-input" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Ex) 250801, 250801, ..." 
            className="details-input"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button className="details-btn add" onClick={handleAddReservist}>예약자 추가</button>
          <button className="details-btn complete" onClick={handleCompleteReservation}>예약 완료</button>
        </section>
      </main>
    </div>
  );
}

export default ReservationDetailsPage;