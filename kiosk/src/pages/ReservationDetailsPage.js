// src/pages/ReservationDetailsPage.js (동적 그리드 레이아웃 최종 버전)

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './ReservationDetailsPage.css';
import backIcon from '../arrow_back.png';
import homeIcon from '../home_icon.png';
import ErrorModal from '../components/ErrorModal'; // ✨ 에러 모달 추가
import SuccessModal from '../components/SuccessModal'; // ✨ 성공 모달 추가

function ReservationDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const facility = location.state?.facility || 'OOO';

  // --- 상태 관리 ---
  const [reservists, setReservists] = useState([]);
  const [name, setName] = useState('');
  const [birth, setBirth] = useState(''); // id -> birth로 변경
  
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // --- 모달 함수 ---
  const showErrorModal = (message) => { setErrorMessage(message); setIsErrorModalOpen(true); };
  const closeErrorModal = () => { setIsErrorModalOpen(false); setErrorMessage(''); };
  const showSuccessModal = (message) => { setSuccessMessage(message); setIsSuccessModalOpen(true); };
  const closeModalAndNavigateHome = () => { setIsSuccessModalOpen(false); navigate('/'); };

  // --- 함수 로직 ---
  const handleAddReservist = () => {
    if (name.trim() === '' || birth.trim() === '') {
      showErrorModal('이름과 생년월일을 모두 입력해주세요.');
      return;
    }
    // ✨ 1. 최대 예약자 수를 4명으로 제한
    if (reservists.length >= 4) {
      showErrorModal('최대 4명까지만 추가할 수 있습니다.');
      return;
    }
    setReservists([...reservists, { name, birth }]);
    setName('');
    setBirth('');
  };

  const handleCompleteReservation = () => {
    if (reservists.length === 0) {
      showErrorModal('최소 한 명 이상의 예약자를 추가해야 합니다.');
      return;
    }
    // ✨ 실제로는 여기서 reservists 배열을 백엔드로 전송하는 로직이 들어갑니다.
    // 예: await axios.post('/api/reservations', { facility, users: reservists });
    showSuccessModal(`${facility} 예약이 완료되었습니다.`);
  };

  // --- UI 렌더링 ---
  return (
    <div className="container details-container">
      {isSuccessModalOpen && <SuccessModal name={successMessage} onClose={closeModalAndNavigateHome} />}
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeErrorModal} />}

      <Link to="/reservation" className="back-button"> <img src={backIcon} alt="뒤로가기" className="back-icon" /> </Link>
      <Link to="/" className="home-button"> <img src={homeIcon} alt="홈으로" className="home-icon" /> </Link>
      
      {/* ✨ 2. 페이지 전체 제목을 "OOO 시설 예약"으로 변경 */}
      <h1 className="details-title">{facility} 시설 예약</h1>

      <main className="details-content">
        <section className="reservist-list-section">
          {/* ✨ 3. 예약자 명단 제목 변경 */}
          <h2>{facility} 예약자 명단</h2>
          
          {/* ✨ 4. 예약자 명단을 동적 그리드로 변경 */}
          {/* reservists 배열의 길이에 따라 CSS 클래스를 동적으로 부여 (reservist-grid-1, reservist-grid-2 등) */}
          <div className={`reservist-grid reservist-grid-${reservists.length}`}>
            {reservists.length > 0 ? (
              reservists.map((person, index) => (
                <div key={index} className="reservist-card">
                  {`${person.name} / ${person.birth}`}
                </div>
              ))
            ) : (
              // 예약자가 없을 때의 플레이스홀더
              <div className="reservist-placeholder"></div>
            )}
          </div>
        </section>

        <section className="reservation-form-section">
          {/* ✨ 5. 안내 문구 추가 */}
          <p className="form-guide">시설을 같이 이용할 분들 모두 적어주세요.</p>
          <input 
            type="text" 
            placeholder="이름" 
            className="details-input" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="생년월일" 
            className="details-input"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            maxLength="6" // 생년월일은 6자리로 제한
          />
          <button className="details-btn add" onClick={handleAddReservist}>예약자 추가</button>
          <button className="details-btn complete" onClick={handleCompleteReservation}>예약 완료</button>
        </section>
      </main>
    </div>
  );
}

export default ReservationDetailsPage;