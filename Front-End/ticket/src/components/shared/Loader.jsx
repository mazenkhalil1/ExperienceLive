import React from 'react';

const Loader = ({
  type = 'spinner',
  size = 'medium',
  color = '#007bff',
  text,
  progress,
}) => {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      gap: '10px',
    },
    spinner: {
      width: sizeMap[size],
      height: sizeMap[size],
      border: `4px solid #f3f3f3`,
      borderTop: `4px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    skeleton: {
      width: '100%',
      height: sizeMap[size],
      backgroundColor: '#f3f3f3',
      borderRadius: '4px',
      position: 'relative',
      overflow: 'hidden',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        animation: 'shimmer 1.5s infinite',
      },
    },
    progress: {
      width: '100%',
      height: '8px',
      backgroundColor: '#f3f3f3',
      borderRadius: '4px',
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: color,
      width: `${progress}%`,
      transition: 'width 0.3s ease',
    },
    text: {
      marginTop: '10px',
      color: '#666',
      fontSize: '14px',
    },
    dots: {
      display: 'flex',
      gap: '5px',
    },
    dot: {
      width: sizeMap.small,
      height: sizeMap.small,
      backgroundColor: color,
      borderRadius: '50%',
      animation: 'bounce 0.5s alternate infinite',
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    '@keyframes shimmer': {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
    '@keyframes bounce': {
      '0%': { transform: 'translateY(0)' },
      '100%': { transform: 'translateY(-10px)' },
    },
  };

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return <div style={styles.spinner} />;
      case 'skeleton':
        return <div style={styles.skeleton} />;
      case 'progress':
        return (
          <div style={styles.progress}>
            <div style={styles.progressBar} />
          </div>
        );
      case 'dots':
        return (
          <div style={styles.dots}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  ...styles.dot,
                  animation: `bounce 0.5s ${i * 0.1}s alternate infinite`,
                }}
              />
            ))}
          </div>
        );
      default:
        return <div style={styles.spinner} />;
    }
  };

  return (
    <div style={styles.container}>
      {renderLoader()}
      {text && <div style={styles.text}>{text}</div>}
    </div>
  );
};

export default Loader; 