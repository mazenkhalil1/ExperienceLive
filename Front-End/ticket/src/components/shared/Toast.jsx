import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultConfig = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const createToastContent = (message, action) => {
  if (!action) return message;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{message}</span>
      <button
        onClick={action.onClick}
        style={{
          marginLeft: '1rem',
          padding: '0.25rem 0.75rem',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.875rem',
        }}
      >
        {action.label}
      </button>
    </div>
  );
};

export const showToast = {
  success: (message, action = null, config = {}) => {
    toast.success(createToastContent(message, action), {
      ...defaultConfig,
      ...config,
      className: 'toast-success',
      style: {
        background: '#4caf50',
        color: '#fff',
      },
    });
  },

  error: (message, action = null, config = {}) => {
    toast.error(createToastContent(message, action), {
      ...defaultConfig,
      ...config,
      className: 'toast-error',
      style: {
        background: '#f44336',
        color: '#fff',
      },
    });
  },

  warning: (message, action = null, config = {}) => {
    toast.warning(createToastContent(message, action), {
      ...defaultConfig,
      ...config,
      className: 'toast-warning',
      style: {
        background: '#ff9800',
        color: '#fff',
      },
    });
  },

  info: (message, action = null, config = {}) => {
    toast.info(createToastContent(message, action), {
      ...defaultConfig,
      ...config,
      className: 'toast-info',
      style: {
        background: '#2196f3',
        color: '#fff',
      },
    });
  },

  custom: (message, options = {}) => {
    const {
      type = 'default',
      action = null,
      icon = null,
      style = {},
      ...rest
    } = options;

    toast(
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {icon && <span className="toast-icon">{icon}</span>}
        {createToastContent(message, action)}
      </div>,
      {
        ...defaultConfig,
        ...rest,
        className: `toast-${type}`,
        style: {
          background: '#fff',
          color: '#333',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          ...style,
        },
      }
    );
  },
};

// CSS to be added to your global styles
const toastStyles = `
  .Toastify__toast {
    border-radius: 8px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .Toastify__toast-body {
    font-size: 0.9rem;
    padding: 0.5rem 0;
  }

  .Toastify__progress-bar {
    height: 3px;
  }

  .toast-success .Toastify__progress-bar {
    background: rgba(255,255,255,0.7);
  }

  .toast-error .Toastify__progress-bar {
    background: rgba(255,255,255,0.7);
  }

  .toast-warning .Toastify__progress-bar {
    background: rgba(255,255,255,0.7);
  }

  .toast-info .Toastify__progress-bar {
    background: rgba(255,255,255,0.7);
  }

  .toast-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }
`;

// Add styles to document
const style = document.createElement('style');
style.textContent = toastStyles;
document.head.appendChild(style);

// Toast container component
const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default Toast; 