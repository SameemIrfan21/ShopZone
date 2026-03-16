import React from 'react';
import './Notification.css';

export default function Notification({ message, type = 'success' }) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`notification notification-${type}`}>
      <span className="notif-icon">{icons[type]}</span>
      <span className="notif-msg">{message}</span>
    </div>
  );
}
