// src/components/SuccessModal.js (메시지 표시 방식 수정)

import React from 'react';
import './SuccessModal.css';

// ✨ 1. prop의 이름을 'name'에서 'message'로 변경하여 의미를 명확히 합니다.
function SuccessModal({ message, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* ✨ 2. "님 반갑습니다!"를 직접 추가하는 대신, 받은 message를 그대로 표시합니다. */}
        <p className="modal-message">{message}</p>
        <div className="modal-divider"></div>
        <button className="modal-button" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;