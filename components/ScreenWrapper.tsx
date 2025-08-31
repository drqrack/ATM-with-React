
import React from 'react';

interface ScreenWrapperProps {
  children: React.ReactNode;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
  return (
    <div className="w-[600px] h-[450px] bg-blue-900 bg-opacity-75 border-4 border-gray-600 rounded-lg shadow-inner p-8">
      {children}
    </div>
  );
};

export default ScreenWrapper;
