
import React from 'react';

interface KeypadProps {
    onKeyPress: (key: string) => void;
    onEnter: () => void;
    onClear: () => void;
    onBackspace: () => void;
    enterLabel?: string;
}

const KeypadButton: React.FC<{ onClick: () => void, children: React.ReactNode, className?: string }> = ({ onClick, children, className = '' }) => (
    <button
        onClick={onClick}
        className={`bg-gray-600 hover:bg-gray-500 text-white font-bold text-2xl py-4 rounded-lg shadow-md transition-all duration-150 active:bg-gray-700 active:shadow-inner ${className}`}
    >
        {children}
    </button>
);

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, onEnter, onClear, onBackspace, enterLabel = 'ENTER' }) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    return (
        <div className="w-[300px] bg-gray-700 p-4 rounded-lg shadow-lg">
            <div className="grid grid-cols-3 gap-3">
                {keys.map(key => (
                    <KeypadButton key={key} onClick={() => onKeyPress(key)}>
                        {key}
                    </KeypadButton>
                ))}
                <KeypadButton onClick={onBackspace}>⌫</KeypadButton>
                <KeypadButton onClick={() => onKeyPress('0')}>0</KeypadButton>
                <KeypadButton onClick={onClear}>CLR</KeypadButton>
            </div>
            <button
                onClick={onEnter}
                className="w-full mt-3 bg-green-600 hover:bg-green-500 text-white font-bold text-2xl py-4 rounded-lg shadow-md transition-all duration-150 active:bg-green-700"
            >
                {enterLabel}
            </button>
        </div>
    );
};

export default Keypad;
