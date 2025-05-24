import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({
  type = 'spinner',
  size = 'medium',
  color = 'blue',
  text,
  progress,
}) => {
  const sizeMap = {
    small: 'w-5 h-5',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const colorMap = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    purple: 'border-purple-500',
    gray: 'border-gray-500'
  };

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return (
          <motion.div
            className={`${sizeMap[size]} border-4 border-gray-200 ${colorMap[color]} rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        );
      case 'skeleton':
        return (
          <div className={`${sizeMap[size]} bg-gray-200 rounded-md relative overflow-hidden`}>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        );
      case 'progress':
        return (
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-${color}-500`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
        );
      case 'dots':
        return (
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`${sizeMap.small} bg-${color}-500 rounded-full`}
                animate={{ y: [0, -10] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        );
      default:
        return (
          <motion.div
            className={`${sizeMap[size]} border-4 border-gray-200 ${colorMap[color]} rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-5 gap-2">
      {renderLoader()}
      {text && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );
};

export default Loader; 