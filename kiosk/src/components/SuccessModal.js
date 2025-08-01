// src/components/SuccessModal.js (전체 코드)

import React from 'react';
import './SuccessModal.css';

function SuccessModal({ name, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-message">{name}님 반갑습니다!</p>
        <div className="modal-divider"></div>
        <button className="modal-button" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}

// ✨✨✨ 바로 이 부분! export 'default'가 반드시 있어야 합니다. ✨✨✨
export default SuccessModal; 