import React from 'react';

const Loader = ({ size = 'medium', color = '#007bff' }) => {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    },
    spinner: {
      width: sizeMap[size],
      height: sizeMap[size],
      border: `4px solid #f3f3f3`,
      borderTop: `4px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.spinner} />
    </div>
  );
};

export default Loader; 