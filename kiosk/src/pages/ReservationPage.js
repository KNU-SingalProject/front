// src/pages/ReservationPage.js (백엔드 응답 형식 반영 최종 버전)

import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ReservationPage.css';

import backIcon from '../arrow_back.png';
import computerIcon from '../computer.png';
import nintendoIcon from '../nintendo.png';
import karaokeIcon from '../karaoke.png';
import badmintonIcon from '../padminton.png';
import ErrorModal from '../components/ErrorModal';

const initialOptions = [
  { id: 1, name: '컴퓨터', icon: computerIcon },
  { id: 2, name: '닌텐도', icon: nintendoIcon },
  { id: 3, name: '노래방', icon: karaokeIcon },
  { id: 4, name: '패드민턴', icon: badmintonIcon },
];

function ReservationPage() {
  const location = useLocation();
  const [selected, setSelected] = useState(null);
  
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const showErrorModal = (message) => { setErrorMessage(message); setIsErrorModalOpen(true); };
  const closeErrorModal = () => { setIsErrorModalOpen(false); setErrorMessage(''); };

  // ✨✨✨ 바로 이 부분이 실제 백엔드 응답에 맞게 수정되었습니다! ✨✨✨
  const optionsWithStatus = useMemo(() => {
    const statuses = location.state?.facilityStatuses || [];
    
    return initialOptions.map(option => {
      // ✨ 1. 백엔드 데이터에서 현재 옵션의 id와 일치하는 facility_id를 찾습니다.
      const statusInfo = statuses.find(s => s.facility_id === option.id);
      
      // ✨ 2. 상태(status)가 'active'일 때만 'on', 그 외에는 모두 'off'로 변환합니다.
      const currentStatus = (statusInfo && statusInfo.status === 'active') ? 'on' : 'off';

      return {
        ...option,
        status: currentStatus, 
      };
    });
  }, [location.state]);

  const handleOptionClick = (option) => {
    if (option.status === 'off') {
      showErrorModal('해당 시설은 사용이 불가합니다.');
      return;
    }
    setSelected(option);
  };

  return (
    <div className="container reservation-container">
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeErrorModal} />}

      <Link to="/" className="back-button">
        <img src={backIcon} alt="뒤로가기" className="back-icon" />
      </Link>
      
      <h1 className="reservation-title">시설 예약</h1>

      <div className="options-grid">
        {optionsWithStatus.map((option) => (
          <div
            key={option.name}
            className={`option-card ${selected?.id === option.id ? 'selected' : ''} ${option.status === 'off' ? 'disabled' : ''}`}
            onClick={() => handleOptionClick(option)}
          >
            <img src={option.icon} alt={option.name} className="option-icon" />
            <span className="option-label">{option.name}</span>
          </div>
        ))}
      </div>
      
      <Link 
        to={selected ? "/reservation-details" : "#"} 
        state={{ facilityId: selected?.id, facilityName: selected?.name }} 
        className={!selected || selected.status === 'off' ? 'disabled-link' : ''}
      >
        <button className="submit-btn" disabled={!selected || selected.status === 'off'}>
          시설 예약
        </button>
      </Link>
    </div>
  );
}

export default ReservationPage;