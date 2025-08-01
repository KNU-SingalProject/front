// src/components/ErrorModal.js (전체 코드)

import React from 'react';
import './ErrorModal.css';

function ErrorModal({ message, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="error-modal-content">
        <p className="error-modal-title">오류</p>
        <p className="error-modal-message">{message}</p>
        <div className="modal-divider"></div>
        <button className="modal-button" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}

// ✨ 이 파일의 맨 아래에 export default가 있는지 꼭 확인해주세요.
export default ErrorModal;