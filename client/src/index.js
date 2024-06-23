import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from "react-router-dom";
// import reportWebVitals from './reportWebVitals';
// import { sendToVercelAnalytics } from './vitals';

// ReactDOM.render(
  ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>, 
  // document.getElementById('root')
);

// reportWebVitals(sendToVercelAnalytics);
