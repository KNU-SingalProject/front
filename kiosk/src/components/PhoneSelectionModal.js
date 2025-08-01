// src/components/PhoneSelectionModal.js (버튼 위치 수정 최종 버전)

import React, { useState } from 'react';
import './PhoneSelectionModal.css';

function PhoneSelectionModal({ phoneNumbers, onConfirm, onCancel }) {
  const [selectedPhone, setSelectedPhone] = useState('');

  const handleConfirm = () => {
    if (!selectedPhone) {
      alert('전화번호를 선택해주세요.');
      return;
    }
    onConfirm(selectedPhone);
  };

  return (
    <div className="modal-overlay">
      <div className="phone-modal-content">
        <p className="phone-modal-title">동일한 정보의 사용자가 있습니다.</p>
        <p className="phone-modal-subtitle">본인의 전화번호를 선택해주세요.</p>
        
        <ul className="phone-selection-list">
          {phoneNumbers.map((phone, index) => (
            <li key={index}>
              <input
                type="radio"
                id={`modal-phone-${index}`}
                name="modalPhoneNumber"
                value={phone}
                checked={selectedPhone === phone}
                onChange={(e) => setSelectedPhone(e.target.value)}
              />
              <label htmlFor={`modal-phone-${index}`}>{phone}</label>
            </li>
          ))}
        </ul>

        <div className="phone-modal-buttons">
            <button onClick={handleConfirm} className="modal-btn confirm">확인</button>
            <button onClick={onCancel} className="modal-btn cancel">취소</button>     
        </div>
      </div>
    </div>
  );
}

export default PhoneSelectionModal;