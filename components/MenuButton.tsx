
import React from 'react';

interface MenuButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    isExit?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick, children, className = '', isExit = false }) => {
    const baseClasses = "w-full text-white font-bold py-4 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105";
    const colorClasses = isExit 
        ? "bg-red-600 hover:bg-red-500" 
        : "bg-blue-600 hover:bg-blue-500";

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${colorClasses} ${className}`}
        >
            {children}
        </button>
    );
};

export default MenuButton;
