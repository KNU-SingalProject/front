// src/pages/ReservationDetailsPage.js (뒤로가기 기능 수정 최종 버전)

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ReservationDetailsPage.css';
import backIcon from '../arrow_back.png';
import homeIcon from '../home_icon.png';
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal';
import PhoneSelectionModal from '../components/PhoneSelectionModal';

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
  const facilityId = location.state?.facilityId || 0;
  const facilityName = location.state?.facilityName || 'OOO';

  const [reservists, setReservists] = useState([]);
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneOptions, setPhoneOptions] = useState([]);
  const [pendingReservist, setPendingReservist] = useState(null);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const showErrorModal = (message) => { setErrorMessage(message); setIsErrorModalOpen(true); };
  const closeErrorModal = () => { setIsErrorModalOpen(false); setErrorMessage(''); };
  const showSuccessModalWithMessage = (message) => { setSuccessMessage(message); setIsSuccessModalOpen(true); };
  const closeModalAndNavigateHome = () => { setIsSuccessModalOpen(false); navigate('/'); };
  const closePhoneModal = () => { setIsPhoneModalOpen(false); setPhoneOptions([]); setPendingReservist(null); };

  const handleAddReservist = async () => {
    const trimmedName = name.trim();
    const trimmedBirth = birth.trim();
    if (trimmedName === '' || trimmedBirth === '') { showErrorModal('이름과 생년월일을 모두 입력해주세요.'); return; }
    if (reservists.length >= 4) { showErrorModal('최대 4명까지만 추가할 수 있습니다.'); return; }
    const formattedBirth = formatBirthDate(trimmedBirth);
    if (!formattedBirth) { showErrorModal('생년월일 6자리를 올바르게 입력해주세요.'); return; }
    const payload = { name: trimmedName, birth: formattedBirth };
    try {
      const response = await axios.post('http://43.201.162.230:8000/users/log-in', payload);
      if (response.data && Array.isArray(response.data.phone_numbers) && response.data.phone_numbers.length > 0) {
        setPendingReservist({ name: trimmedName, birth: trimmedBirth });
        setPhoneOptions(response.data.phone_numbers);
        setIsPhoneModalOpen(true);
      } else {
        const newUser = { name: trimmedName, birth: trimmedBirth, phone: null };
        const isAlreadyAdded = reservists.some(p => p.name === newUser.name && p.birth === newUser.birth && p.phone === null);
        if (isAlreadyAdded) { showErrorModal('이미 명단에 추가된 사용자입니다.'); return; }
        setReservists([...reservists, newUser]);
        setName('');
        setBirth('');
      }
    } catch (error) {
      console.error('회원 검증 중 오류 발생:', error);
      if (error.response && error.response.status === 404) { showErrorModal('등록되지 않은 회원입니다. 추가할 수 없습니다.'); } 
      else { showErrorModal('회원 확인 중 오류가 발생했습니다.'); }
    }
  };

  const handlePhoneConfirm = (selectedPhone) => {
    const isAlreadyAdded = reservists.some(p => p.phone === selectedPhone);
    if (isAlreadyAdded) {
      showErrorModal('해당 전화번호의 사용자는 이미 명단에 있습니다.');
      closePhoneModal();
      return;
    }
    setReservists([...reservists, { name: pendingReservist.name, birth: pendingReservist.birth, phone: selectedPhone }]);
    setName('');
    setBirth('');
    closePhoneModal();
  };
  
  const handleCompleteReservation = async () => {
    if (reservists.length === 0) {
      showErrorModal('최소 한 명 이상의 예약자를 추가해야 합니다.');
      return;
    }

    const hasUserWithPhone = reservists.some(person => person.phone !== null);
    const isSinglePerson = reservists.length === 1;
    
    let apiUrl = '';
    let payload;

    if (hasUserWithPhone) {
      if (isSinglePerson) {
        apiUrl = 'http://43.201.162.230:8000/facility/confirm';
        const person = reservists[0];
        payload = {
          facility_id: facilityId,
          name: person.name,
          birth: formatBirthDate(person.birth),
          phone: person.phone,
        };
      } else {
        apiUrl = 'http://43.201.162.230:8000/facility/multi-confirm';
        payload = {
          facility_id: facilityId,
          members: reservists.map(person => {
            const data = {
              name: person.name,
              birth: formatBirthDate(person.birth),
            };
            if (person.phone) {
              data.phone = person.phone;
            }
            return data;
          })
        };
      }
    } else {
      if (isSinglePerson) {
        apiUrl = 'http://43.201.162.230:8000/facility/reserve';
        const person = reservists[0];
        payload = {
          facility_id: facilityId,
          name: person.name,
          birth: formatBirthDate(person.birth),
        };
      } else {
        apiUrl = 'http://43.201.162.230:8000/facility/multi-reserve';
        payload = {
          facility_id: facilityId,
          members: reservists.map(person => ({
            name: person.name,
            birth: formatBirthDate(person.birth),
          }))
        };
      }
    }

    console.log(`API URL: ${apiUrl}`);
    console.log("백엔드로 전송할 최종 데이터 (Payload):", JSON.stringify(payload, null, 2));

    try {
      await axios.post(apiUrl, payload);
      const nameList = reservists.map(person => `${person.name}님`);
      const formattedNames = nameList.join(', ');
      const finalMessage = `${formattedNames} 예약을 완료했습니다!`;
      showSuccessModalWithMessage(finalMessage);
    } catch (error) {
      console.error('예약 완료 중 오류 발생:', error);
      if (error.response && error.response.status === 422) {
        const errorDetail = error.response.data?.detail;
        if(typeof errorDetail === 'string') {
            showErrorModal(errorDetail);
        } else {
            showErrorModal('입력된 정보가 서버의 규칙과 맞지 않습니다.');
        }
      } else {
        showErrorModal('예약 완료에 실패했습니다. 관리자에게 문의하세요.');
      }
    }
  };

  const handleBackClick = async () => {
    try {
      const response = await axios.get('http://43.201.162.230:8000/facility/facilities/status');
      navigate('/reservation', { state: { facilityStatuses: response.data } });
    } catch (error) {
      console.error('시설 상태 정보를 불러오는 중 오류 발생:', error);
      showErrorModal('시설 상태 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="container details-container">
      {isPhoneModalOpen && <PhoneSelectionModal phoneNumbers={phoneOptions} onConfirm={handlePhoneConfirm} onCancel={closePhoneModal} />}
      {isSuccessModalOpen && <SuccessModal message={successMessage} onClose={closeModalAndNavigateHome} />}
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeErrorModal} />}

      <button onClick={handleBackClick} className="back-button icon-button">
        <img src={backIcon} alt="뒤로가기" className="back-icon" />
      </button>

      <Link to="/" className="home-button">
        <img src={homeIcon} alt="홈으로" className="home-icon" />
      </Link>
      
      <h1 className="details-title">{facilityName} 시설 예약</h1>

      <main className="details-content">
        <section className="reservist-list-section">
          <h2>{facilityName} 예약자 명단</h2>
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
          <input type="text" placeholder="이름" className="details-input" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="생년월일 (6자리)" className="details-input" value={birth} onChange={(e) => setBirth(e.target.value)} maxLength="6" />
          <button className="details-btn add" onClick={handleAddReservist}>예약자 추가</button>
          <button className="details-btn complete" onClick={handleCompleteReservation}>예약 완료</button>
        </section>
      </main>
    </div>
  );
}

export default ReservationDetailsPage;