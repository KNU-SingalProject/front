// src/pages/VisitPage.js (USER_NOT_FOUND 에러 코드 처리 최종 버전)

import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VisitPage.css';
import logo from '../kiosk_ikon.png';
import backIcon from '../arrow_back.png';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

function VisitPage() {
  // --- 상태 관리 ---
  const [birth, setBirth] = useState({ year: '', month: '', day: '' });
  const [name, setName] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState('');
  
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalName, setModalName] = useState('');

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const monthInputRef = useRef(null);
  const dayInputRef = useRef(null);

  // --- 함수 로직 ---
  const handleBirthChange = (e, field) => {
    const { value } = e.target;
    if (isNaN(value)) return;
    setBirth(prev => ({ ...prev, [field]: value }));
    if (field === 'year' && value.length === 4) monthInputRef.current.focus();
    if (field === 'month' && value.length === 2) dayInputRef.current.focus();
  };
  
  const showSuccessModal = (responseName) => {
    setModalName(responseName);
    setIsSuccessModalOpen(true);
  };
  const closeModalAndNavigateHome = () => {
    setIsSuccessModalOpen(false);
    navigate('/');
  };

  const showErrorModal = (message) => {
    setErrorMessage(message);
    setIsErrorModalOpen(true);
  };
  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage('');
  };

  const handleCheckUser = async () => {
    const trimmedName = name.trim();
    const formattedBirth = `${birth.year}-${birth.month.padStart(2, '0')}-${birth.day.padStart(2, '0')}`;
    
    if (trimmedName === '' || birth.year.length !== 4 || birth.month.length === 0 || birth.day.length === 0) {
      showErrorModal('이름과 생년월일을 모두 올바르게 입력해주세요.');
      return;
    }
    const payload = { name: trimmedName, birth: formattedBirth };

    try {
      const response = await axios.post('http://43.201.162.230:8000/users/log-in', payload);
      
      if (response.data && Array.isArray(response.data.phone_numbers) && response.data.phone_numbers.length > 0) {
        setPhoneNumbers(response.data.phone_numbers);
      } else {
        const responseName = response.data?.name || trimmedName;
        showSuccessModal(responseName);
      }
    } catch (error) {
      console.error('사용자 확인 중 오류 발생:', error);
      
      let errorMsg = '알 수 없는 오류가 발생했습니다.';
      if (error.response) {
        // ✨ 서버가 보내준 상세 에러 정보를 변수에 저장
        const errorDetail = error.response.data?.detail;

        // ✨ code가 'USER_NOT_FOUND'인지 확인하고, 그렇다면 message를 사용
        if (errorDetail && errorDetail.code === 'USER_NOT_FOUND') {
          errorMsg = errorDetail.message;
        } else if (typeof errorDetail === 'string') {
          // 그 외 다른 에러 처리
          errorMsg = errorDetail;
        }
      } else if (error.request) {
        errorMsg = '서버로부터 응답이 없습니다. 네트워크를 확인해주세요.';
      }
      
      showErrorModal(errorMsg);
    }
  };

  const handleFinalSubmit = async () => {
    const formattedBirth = `${birth.year}-${birth.month.padStart(2, '0')}-${birth.day.padStart(2, '0')}`;
    if (selectedPhone === '') { 
      showErrorModal('전화번호를 선택해주세요.');
      return; 
    }
    const finalPayload = { name: name.trim(), birth: formattedBirth, phone_number: selectedPhone };

    try {
      const response = await axios.post('http://43.201.162.230:8000/users/log-in', finalPayload);
      if (response.status === 200 || response.status === 201) {
        const responseName = response.data?.name || name.trim();
        showSuccessModal(responseName);
      }
    } catch (error) {
      // (이 부분의 에러 처리 로직도 동일하게 적용되어 있습니다)
      console.error('최종 전송 중 오류 발생:', error);
      let errorMsg = '알 수 없는 오류가 발생했습니다.';
      if (error.response) {
        const errorDetail = error.response.data?.detail;
        if (errorDetail && errorDetail.code === 'USER_NOT_FOUND') {
          errorMsg = errorDetail.message;
        } else if (typeof errorDetail === 'string') {
          errorMsg = errorDetail;
        }
      } else if (error.request) {
        errorMsg = '서버로부터 응답이 없습니다. 네트워크를 확인해주세요.';
      }
      showErrorModal(errorMsg);
    }
  };

  // --- UI 렌더링 ---
  return (
    <div className="container visit-page-container">
      {isSuccessModalOpen && <SuccessModal name={modalName} onClose={closeModalAndNavigateHome} />}
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeErrorModal} />}

      <Link to="/" className="back-button">
        <img src={backIcon} alt="뒤로가기" className="back-icon" />
      </Link>
      <header className="header">
        <img src={logo} alt="로고" className="logo-img" />
      </header>
      
      {phoneNumbers.length === 0 ? (
        <>
          <p className="subtitle">시설 방문은 하루에 한 번 가능합니다.</p>
          <main className="visit-form">
            <input type="text" placeholder="Ex) 홍길동" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="date-input-container">
              <input type="text" placeholder="YYYY" maxLength="4" className="date-input-part year" value={birth.year} onChange={(e) => handleBirthChange(e, 'year')} />
              <span>-</span>
              <input type="text" placeholder="MM" maxLength="2" className="date-input-part month" ref={monthInputRef} value={birth.month} onChange={(e) => handleBirthChange(e, 'month')} />
              <span>-</span>
              <input type="text" placeholder="DD" maxLength="2" className="date-input-part day" ref={dayInputRef} value={birth.day} onChange={(e) => handleBirthChange(e, 'day')} />
            </div>
            <button className="submit-btn" onClick={handleCheckUser}>사용자 확인</button>
          </main>
        </>
      ) : (
        <>
          <p className="subtitle">동일한 정보의 사용자가 있습니다. 본인의 전화번호를 선택해주세요.</p>
          <main className="visit-form phone-selection-form">
            <ul className="phone-selection-list">
              {phoneNumbers.map((phone, index) => (
                <li key={index}>
                  <input type="radio" id={`phone-${index}`} name="phoneNumber" value={phone} checked={selectedPhone === phone} onChange={(e) => setSelectedPhone(e.target.value)} />
                  <label htmlFor={`phone-${index}`}>{phone}</label>
                </li>
              ))}
            </ul>
            <button className="submit-btn" onClick={handleFinalSubmit}>시설 방문 완료</button>
          </main>
        </>
      )}
    </div>
  );
}

export default VisitPage;