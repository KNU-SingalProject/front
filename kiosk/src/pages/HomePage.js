// src/pages/HomePage.js (API 호출 방식 수정 최종 버전)

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';
import logo from '../kiosk_ikon.png';
import ErrorModal from '../components/ErrorModal';

function HomePage() {
  const navigate = useNavigate();
  
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const showErrorModal = (message) => { setErrorMessage(message); setIsErrorModalOpen(true); };
  const closeErrorModal = () => { setIsErrorModalOpen(false); setErrorMessage(''); };

  // ✨✨✨ 바로 이 부분이 문제를 해결하는 핵심 코드입니다! ✨✨✨
  const handleReservationClick = async () => {
    try {
      // ✨ 1. API를 단 한 번만 호출하여 전체 시설 상태 목록을 가져옵니다.
      const response = await axios.get('http://43.201.162.230:8000/facility/facilities/status');
      
      // ✨ 2. 받아온 데이터 배열(response.data)을 다음 페이지로 그대로 전달합니다.
      navigate('/reservation', { state: { facilityStatuses: response.data } });

    } catch (error) {
      console.error('시설 상태 정보를 불러오는 중 오류 발생:', error);
      showErrorModal('시설 상태 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="container home-container">
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeErrorModal} />}

      <header className="header">
        <img src={logo} alt="로고" className="logo-img" />
      </header>
      <main className="main-content">
        <Link to="/visit">
          <button className="btn">시설 방문</button>
        </Link>
        
        <button className="btn" onClick={handleReservationClick}>시설 예약</button>
      </main>
    </div>
  );
}

export default HomePage;