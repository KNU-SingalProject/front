// src/pages/ReservationDetailsPage.js (예약 완료 메시지 수정 최종 버전)

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ReservationDetailsPage.css';
import backIcon from '../arrow_back.png';
import homeIcon from '../home_icon.png';
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal';

const formatBirthDate = (birth) => {
  if (birth.length !== 6) return null;
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

  const [reservists, setReservists] = useState([]);
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const showErrorModal = (message) => { setErrorMessage(message); setIsErrorModalOpen(true); };
  const closeErrorModal = () => { setIsErrorModalOpen(false); setErrorMessage(''); };
  const showSuccessModalWithMessage = (message) => { setSuccessMessage(message); setIsSuccessModalOpen(true); };
  const closeModalAndNavigateHome = () => { setIsSuccessModalOpen(false); navigate('/'); };

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

    const formattedBirth = formatBirthDate(trimmedBirth);
    if (!formattedBirth) {
      showErrorModal('생년월일 6자리를 올바르게 입력해주세요.');
      return;
    }

    const payload = { name: trimmedName, birth: formattedBirth };

    try {
      await axios.post('http://43.201.162.230:8000/users/log-in', payload);
      setReservists([...reservists, { name: trimmedName, birth: trimmedBirth }]);
      setName('');
      setBirth('');
    } catch (error) {
      console.error('회원 검증 중 오류 발생:', error);
      if (error.response && error.response.status === 404) {
        showErrorModal('등록되지 않은 회원입니다. 추가할 수 없습니다.');
      } else {
        showErrorModal('회원 확인 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCompleteReservation = () => {
    if (reservists.length === 0) {
      showErrorModal('최소 한 명 이상의 예약자를 추가해야 합니다.');
      return;
    }
    
    // ✨✨✨ 바로 이 부분이 요청하신 내용입니다! ✨✨✨
    // reservists 배열에서 이름만 추출하여 각 이름 뒤에 '님'을 붙인 새 배열을 만듭니다.
    const nameList = reservists.map(person => `${person.name}님`);
    
    // '님'이 붙은 이름들을 쉼표와 공백(', ')으로 연결하여 하나의 문자열로 만듭니다.
    const formattedNames = nameList.join(', ');

    // ✨ 환영 메시지를 예약 완료 메시지로 변경합니다.
    const finalMessage = `${formattedNames} 예약을 완료했습니다!`;

    // 완성된 메시지를 모달에 전달합니다.
    showSuccessModalWithMessage(finalMessage);
    // ❗️ 실제로는 이 위에서 백엔드에 예약 완료 API를 호출해야 합니다.
  };

  return (
    <div className="container details-container">
      {isSuccessModalOpen && <SuccessModal message={successMessage} onClose={closeModalAndNavigateHome} />}
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