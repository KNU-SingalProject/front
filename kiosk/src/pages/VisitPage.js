import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VisitPage.css';
import logo from '../kiosk_ikon.png';
import backIcon from '../arrow_back.png';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

function VisitPage() {
  const [birth, setBirth] = useState({ year: '', month: '', day: '' });
  const [name, setName] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const monthInputRef = useRef(null);
  const dayInputRef = useRef(null);

  // 🔹 생년월일 입력 제어
  const handleBirthChange = (e, field) => {
    const { value } = e.target;
    if (isNaN(value)) return;
    setBirth(prev => ({ ...prev, [field]: value }));
    if (field === 'year' && value.length === 4) monthInputRef.current.focus();
    if (field === 'month' && value.length === 2) dayInputRef.current.focus();
  };
  
  // 🔹 모달 제어
  const showSuccessModal = (message) => {
    setSuccessMessage(message);
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

  // 🔹 사용자 확인 (로그인)
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
      console.log(response.data);

      if (response.data.multiple) {
        // 📌 동명이인 케이스: 전화번호 선택 화면으로 전환
        setPhoneNumbers(response.data.phone_numbers || []);
      } else {
        // 📌 단일 유저 케이스
        const responseName = response.data?.name || trimmedName;
        if (response.data.visit_log === true) {
          showErrorModal('센터 방문은 하루에 한 번 가능합니다.');
        } else {
          showSuccessModal(`${responseName}님 반갑습니다!`);
        }
      }
    } catch (error) {
      handleError(error, trimmedName);
    }
  };

  // 🔹 최종 제출 (전화번호 확인)
  const handleFinalSubmit = async () => {
    const formattedBirth = `${birth.year}-${birth.month.padStart(2, '0')}-${birth.day.padStart(2, '0')}`;
    
    if (selectedPhone === '') { 
      showErrorModal('전화번호를 선택해주세요.');
      return; 
    }
    
    const finalPayload = {
      name: name.trim(),
      birth: formattedBirth,
      phone_number: selectedPhone
    };

    try {
      // 📌 confirm-phone API 호출
      const response = await axios.post('http://43.201.162.230:8000/users/confirm-phone', finalPayload);
      
      const responseName = response.data?.name || name.trim();
      if (response.data.visit_log === true) {
        showErrorModal('센터 방문은 하루에 한 번 가능합니다.');
      } else {
        showSuccessModal(`${responseName}님 반갑습니다!`);
      }
    } catch (error) {
      handleError(error, name.trim());
    }
  };

  // 🔹 에러 처리 공통 함수
  const handleError = (error, userName) => {
    console.error('오류 발생:', error);
    if (error.response && error.response.status === 404) {
      showErrorModal(`${userName}님은 회원이 아닙니다.\n데스크에 회원 요청 바랍니다.`);
    } else {
      let errorMsg = '알 수 없는 오류가 발생했습니다.';
      if (error.response) {
        const errorDetail = error.response.data?.detail;
        if (typeof errorDetail === 'string') errorMsg = errorDetail;
        else if (Array.isArray(errorDetail)) errorMsg = errorDetail[0]?.msg || '입력 값을 확인해주세요.';
      } else if (error.request) {
        errorMsg = '서버로부터 응답이 없습니다. 네트워크를 확인해주세요.';
      }
      showErrorModal(errorMsg);
    }
  };

  return (
    <div className="container visit-page-container">
      {isSuccessModalOpen && <SuccessModal message={successMessage} onClose={closeModalAndNavigateHome} />}
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
            <input 
              type="text" 
              placeholder="Ex) 홍길동" 
              className="input-field" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <div className="date-input-container">
              <input 
                type="text" 
                placeholder="YYYY" 
                maxLength="4" 
                className="date-input-part year" 
                value={birth.year} 
                onChange={(e) => handleBirthChange(e, 'year')} 
              />
              <span>-</span>
              <input 
                type="text" 
                placeholder="MM" 
                maxLength="2" 
                className="date-input-part month" 
                ref={monthInputRef} 
                value={birth.month} 
                onChange={(e) => handleBirthChange(e, 'month')} 
              />
              <span>-</span>
              <input 
                type="text" 
                placeholder="DD" 
                maxLength="2" 
                className="date-input-part day" 
                ref={dayInputRef} 
                value={birth.day} 
                onChange={(e) => handleBirthChange(e, 'day')} 
              />
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
                  <input
                    type="radio"
                    id={`phone-${index}`}
                    name="phoneNumber"
                    value={phone}
                    checked={selectedPhone === phone}
                    onChange={(e) => setSelectedPhone(e.target.value)}
                  />
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
