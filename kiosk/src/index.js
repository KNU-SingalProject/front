// src/index.js (이 코드가 정답입니다)

import React from 'react';
import ReactDOM from 'react-dom/client';

// 'HomePage'가 아닌, 페이지 이동을 관리하는 'App'을 불러와야 합니다.
import App from './App'; 

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 화면에 보여줄 것은 App 컴포넌트 하나입니다. */}
    <App />
  </React.StrictMode>
);

reportWebVitals();