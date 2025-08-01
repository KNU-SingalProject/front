// src/pages/VisitPage.js (동적 환영 메시지 추가 최종 버전)

import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VisitPage.css';
import logo from '../kiosk_ikon.png';
import backIcon from '../arrow_back.png';

function VisitPage() {
  // --- 상태 관리 ---
  const [birth, setBirth] = useState({ year: '', month: '', day: '' });
  const [name, setName] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState('');
  
  const navigate = useNavigate();

  // --- Ref 관리 ---
  const monthInputRef = useRef(null);
  const dayInputRef = useRef(null);

  // --- 함수 로직 ---
  const handleBirthChange = (e, field) => {
    const { value } = e.target;
    if (isNaN(value)) return;

    setBirth(prev => ({ ...prev, [field]: value }));

    if (field === 'year' && value.length === 4) {
      monthInputRef.current.focus();
    }
    if (field === 'month' && value.length === 2) {
      dayInputRef.current.focus();
    }
  };

  const handleCheckUser = async () => {
    const formattedBirth = `${birth.year}-${birth.month.padStart(2, '0')}-${birth.day.padStart(2, '0')}`;
    
    if (name.trim() === '' || birth.year.length !== 4 || birth.month.length === 0 || birth.day.length === 0) {
      alert('이름과 생년월일을 모두 올바르게 입력해주세요.');
      return;
    }
    const payload = { name: name.trim(), birth: formattedBirth };

    try {
      const response = await axios.post('http://43.201.162.230:8000/users/log-in', payload);
      
      if (response.data && Array.isArray(response.data.phone_numbers) && response.data.phone_numbers.length > 0) {
        setPhoneNumbers(response.data.phone_numbers);
      } else {
        // ✨ 여기서도 서버 응답의 name을 사용할 수 있습니다.
        const responseName = response.data?.name || name;
        alert(`${responseName}님 방문 정보가 성공적으로 기록되었습니다.`);
        navigate('/');
      }
    } catch (error) {
      console.error('사용자 확인 중 오류 발생:', error);
      if (error.response) { alert(`오류: ${error.response.data.detail || '서버 응답 오류'}`); } 
      else { alert('네트워크 오류가 발생했습니다.'); }
    }
  };

  const handleFinalSubmit = async () => {
    const formattedBirth = `${birth.year}-${birth.month.padStart(2, '0')}-${birth.day.padStart(2, '0')}`;
    if (selectedPhone === '') { alert('전화번호를 선택해주세요.'); return; }

    const finalPayload = {
      name: name.trim(),
      birth: formattedBirth,
      phone_number: selectedPhone, 
    };

    try {
      const response = await axios.post('http://43.201.162.230:8000/users/log-in', finalPayload);
      
      // ✨✨✨ 바로 이 부분이 요청하신 내용입니다! ✨✨✨
      if (response.status === 200 || response.status === 201) {
        // ✨ 1. 서버 응답 데이터에서 name을 추출합니다. (서버가 응답에 name을 포함해준다고 가정)
        // ✨    혹시 모를 오류를 방지하기 위해, 응답에 name이 없으면 기존 state의 name을 사용합니다.
        const responseName = response.data?.name || name;
        
        // ✨ 2. 추출한 이름을 사용하여 동적인 알림창을 띄웁니다.
        alert(`${responseName}님 방문 처리가 완료되었습니다.`);
        
        navigate('/');
      }
    } catch (error) {
      console.error('최종 전송 중 오류 발생:', error);
      if (error.response) { alert(`오류: ${error.response.data.detail || '서버 응답 오류'}`); }
      else { alert('네트워크 오류가 발생했습니다.'); }
    }
  };


  // --- UI 렌더링 ---
  return (
    <div className="container visit-page-container">
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