// src/pages/ReservationDetailsPage.js (실시간 회원 검증 기능 추가 최종 버전)

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✨ axios import
import './ReservationDetailsPage.css';
import backIcon from '../arrow_back.png';
import homeIcon from '../home_icon.png';
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal';

// ✨ 1. VisitPage에서 사용했던 생년월일 변환 함수를 가져옵니다.
const formatBirthDate = (birth) => {
  if (birth.length !== 6) return null; // 6자리가 아니면 유효하지 않음
  let yearPrefix = parseInt(birth.substring(0, 2), 10) > 50 ? '19' : '20';
  let year = yearPrefix + birth.substring(0, 2);
  let month = birth.substring(2, 4);
  let day = birth.substring(4, 6);
  return `${year}-${month}-${day}`;
};

function ReservationDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const facility = location.state?.facility || 'OOO';

  // --- 상태 관리 ---
  const [reservists, setReservists] = useState([]);
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  
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
  // ✨ 2. '예약자 추가' 버튼의 로직을 백엔드 검증 기능으로 전면 수정
  const handleAddReservist = async () => {
    const trimmedName = name.trim();
    const trimmedBirth = birth.trim();

    if (trimmedName === '' || trimmedBirth === '') {
      showErrorModal('이름과 생년월일을 모두 입력해주세요.');
      return;
    }
    if (reservists.length >= 4) {
      showErrorModal('최대 4명까지만 추가할 수 있습니다.');
      return;
    }

    // ✨ 3. 6자리 생년월일을 YYYY-MM-DD 형식으로 변환
    const formattedBirth = formatBirthDate(trimmedBirth);
    if (!formattedBirth) {
      showErrorModal('생년월일 6자리를 올바르게 입력해주세요.');
      return;
    }

    const payload = {
      name: trimmedName,
      birth: formattedBirth,
    };

    try {
      // ✨ 4. 백엔드에 회원 여부 확인 요청 (VisitPage와 동일한 API 사용)
      // 이 요청이 성공하면 (catch로 빠지지 않으면) 등록된 회원으로 간주합니다.
      await axios.post('http://43.201.162.230:8000/users/log-in', payload);

      // ✨ 5. 검증 성공 시에만 예약자 명단(reservists) state에 추가
      setReservists([...reservists, { name: trimmedName, birth: trimmedBirth }]);
      setName('');
      setBirth('');

    } catch (error) {
      // ✨ 6. 검증 실패 시 에러 처리
      console.error('회원 검증 중 오류 발생:', error);
      if (error.response && error.response.status === 404) {
        // 백엔드가 404 응답을 주는 경우
        showErrorModal('등록되지 않은 회원입니다. 추가할 수 없습니다.');
      } else {
        // 그 외 다른 에러 (네트워크 문제 등)
        showErrorModal('회원 확인 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCompleteReservation = () => {
    if (reservists.length === 0) {
      showErrorModal('최소 한 명 이상의 예약자를 추가해야 합니다.');
      return;
    }
    // ❗️ 최종적으로 이 'reservists' 배열을 백엔드에 보내 예약 확정 API를 호출해야 합니다.
    // 예: await axios.post('/api/complete-reservation', { facility, users: reservists });
    showSuccessModal(`${facility} 예약이 완료되었습니다.`);
  };

  // --- UI 렌더링 ---
  return (
    <div className="container details-container">
      {isSuccessModalOpen && <SuccessModal name={successMessage} onClose={closeModalAndNavigateHome} />}
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeErrorModal} />}

      <Link to="/reservation" className="back-button"> <img src={backIcon} alt="뒤로가기" className="back-icon" /> </Link>
      <Link to="/" className="home-button"> <img src={homeIcon} alt="홈으로" className="home-icon" /> </Link>
      
      <h1 className="details-title">{facility} 시설 예약</h1>

      <main className="details-content">
        <section className="reservist-list-section">
          <h2>{facility} 예약자 명단</h2>
          <div className={`reservist-grid reservist-grid-${reservists.length}`}>
            {reservists.length > 0 ? (
              reservists.map((person, index) => (
                <div key={index} className="reservist-card">
                  {/* ✨ 화면에는 6자리 생년월일을 그대로 표시 */}
                  {`${person.name} / ${person.birth}`}
                </div>
              ))
            ) : (
              <div className="reservist-placeholder"></div>
            )}
          </div>
        </section>

        <section className="reservation-form-section">
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
            placeholder="생년월일 (6자리)" 
            className="details-input"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            maxLength="6"
          />
          <button className="details-btn add" onClick={handleAddReservist}>예약자 추가</button>
          <button className="details-btn complete" onClick={handleCompleteReservation}>예약 완료</button>
        </section>
      </main>
    </div>
  );
}

export default ReservationDetailsPage;