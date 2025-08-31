
import React, { useState, useCallback } from 'react';
import type { Screen, Transaction } from './types';
import ScreenWrapper from './components/ScreenWrapper';
import Keypad from './components/Keypad';
import MenuButton from './components/MenuButton';

// --- Hardcoded Data ---
const CORRECT_PIN = '1234';
const INITIAL_BALANCE = 5210.73;

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('PIN');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pin, setPin] = useState<string>('');
  const [balance, setBalance] = useState<number>(INITIAL_BALANCE);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [amountInput, setAmountInput] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setIsAuthenticated(false);
    setScreen('PIN');
    setPin('');
    setError(null);
    setAmountInput('');
    setSuccessMessage(null);
  }, []);

  const showSuccessAndReturnToMenu = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
      setScreen('MENU');
      setAmountInput('');
    }, 2500);
  };
  
  const addTransaction = useCallback((type: 'DEPOSIT' | 'WITHDRAWAL', amount: number) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      type,
      amount,
      date: new Date().toLocaleString(),
    };
    setTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);
  }, []);

  const handlePinSubmit = () => {
    if (pin === CORRECT_PIN) {
      setIsAuthenticated(true);
      setScreen('MENU');
      setError(null);
      setPin('');
    } else {
      setError('Invalid PIN. Please try again.');
      setPin('');
    }
  };

  const handleWithdraw = useCallback((amount: number) => {
    if (amount <= 0) {
      setError('Withdrawal amount must be positive.');
      return;
    }
    if (balance < amount) {
      setError('Insufficient funds.');
      setTimeout(() => {
          setError(null);
          setAmountInput('');
          setScreen('WITHDRAW');
      }, 2000);
      return;
    }
    setBalance(prev => prev - amount);
    addTransaction('WITHDRAWAL', amount);
    showSuccessAndReturnToMenu(`Successfully withdrew $${amount.toFixed(2)}`);
  }, [balance, addTransaction]);
  
  const handleDeposit = useCallback((amount: number) => {
    if (amount <= 0) {
      setError('Deposit amount must be positive.');
      return;
    }
    setBalance(prev => prev + amount);
    addTransaction('DEPOSIT', amount);
    showSuccessAndReturnToMenu(`Successfully deposited $${amount.toFixed(2)}`);
  }, [addTransaction]);
  

  const handlePinKeyPress = (key: string) => {
    setError(null);
    if (pin.length < 4) {
      setPin(prev => prev + key);
    }
  };

  const handleAmountKeyPress = (key: string) => {
     setError(null);
     setAmountInput(prev => prev + key);
  }

  const renderScreen = () => {
    if (successMessage) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-3xl font-bold text-green-300">{successMessage}</h2>
          <p className="text-lg mt-2 text-gray-300">Returning to main menu...</p>
        </div>
      );
    }
    
    switch (screen) {
      case 'PIN':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-4xl font-bold text-cyan-300 mb-4">Welcome to React Bank</h1>
            <p className="text-xl text-gray-300 mb-6">Please Enter Your PIN</p>
            <div className="h-16 w-64 bg-gray-900 rounded-lg flex items-center justify-center text-4xl tracking-[1.5rem] text-cyan-300 font-mono">
              {'*'.repeat(pin.length).padEnd(4, ' ')}
            </div>
            {error && <p className="text-red-400 mt-4 text-lg animate-pulse">{error}</p>}
          </div>
        );
      case 'MENU':
        return (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-cyan-300 mb-8">Main Menu</h1>
            <div className="grid grid-cols-2 gap-6">
              <MenuButton onClick={() => setScreen('BALANCE')}>Check Balance</MenuButton>
              <MenuButton onClick={() => setScreen('WITHDRAW')}>Withdraw Cash</MenuButton>
              <MenuButton onClick={() => setScreen('DEPOSIT')}>Deposit Cash</MenuButton>
              <MenuButton onClick={() => setScreen('HISTORY')}>Transactions</MenuButton>
              <div className="col-span-2 mt-4">
                 <MenuButton onClick={resetState} isExit={true}>Exit Session</MenuButton>
              </div>
            </div>
          </div>
        );
      case 'BALANCE':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-2xl text-gray-300 mb-4">Your current balance is:</p>
            <h2 className="text-6xl font-mono font-bold text-green-300 tracking-wider">
              {balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </h2>
            <MenuButton onClick={() => setScreen('MENU')} className="mt-12">Back to Menu</MenuButton>
          </div>
        );
      case 'WITHDRAW':
      case 'DEPOSIT':
        const isWithdraw = screen === 'WITHDRAW';
        const amounts = isWithdraw ? [20, 40, 60, 100, 200] : [20, 50, 100, 200, 500];
        const actionFunc = isWithdraw ? handleWithdraw : handleDeposit;
        return (
            <div className="text-center">
                <h1 className="text-4xl font-bold text-cyan-300 mb-2">{isWithdraw ? 'Withdraw Cash' : 'Deposit Cash'}</h1>
                <p className="text-lg text-gray-400 mb-8">Select an amount or enter a custom value.</p>
                <div className="grid grid-cols-2 gap-6">
                    {amounts.map(amount => (
                        <MenuButton key={amount} onClick={() => actionFunc(amount)}>
                            ${amount}
                        </MenuButton>
                    ))}
                    <MenuButton onClick={() => setScreen(isWithdraw ? 'CUSTOM_WITHDRAW' : 'CUSTOM_DEPOSIT')}>
                        Custom Amount
                    </MenuButton>
                </div>
                <MenuButton onClick={() => setScreen('MENU')} className="mt-8">Back to Menu</MenuButton>
            </div>
        );
      case 'CUSTOM_WITHDRAW':
      case 'CUSTOM_DEPOSIT':
          const isCustomWithdraw = screen === 'CUSTOM_WITHDRAW';
          return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h1 className="text-3xl font-bold text-cyan-300 mb-4">
                  Enter {isCustomWithdraw ? 'Withdrawal' : 'Deposit'} Amount
                </h1>
                <div className="h-16 w-80 bg-gray-900 rounded-lg flex items-center justify-center text-4xl text-green-300 font-mono p-4">
                    ${amountInput || '0.00'}
                </div>
                {error && <p className="text-red-400 mt-4 text-lg">{error}</p>}
                <div className="flex gap-4 mt-8">
                    <MenuButton onClick={() => setScreen(isCustomWithdraw ? 'WITHDRAW' : 'DEPOSIT')}>Back</MenuButton>
                </div>
            </div>
          );
      case 'HISTORY':
        return (
          <div className="flex flex-col h-full">
            <h1 className="text-4xl font-bold text-cyan-300 text-center mb-6">Transaction History</h1>
            <div className="flex-grow bg-black bg-opacity-20 rounded-lg p-4 overflow-y-auto">
              {transactions.length === 0 ? (
                <p className="text-gray-400 text-center text-xl mt-16">No recent transactions found.</p>
              ) : (
                <ul className="space-y-3">
                  {transactions.map(t => (
                    <li key={t.id} className="flex justify-between items-center bg-gray-800 p-3 rounded-md">
                      <div>
                        <p className={`font-semibold ${t.type === 'DEPOSIT' ? 'text-green-400' : 'text-red-400'}`}>{t.type}</p>
                        <p className="text-sm text-gray-400">{t.date}</p>
                      </div>
                      <p className={`text-xl font-mono ${t.type === 'DEPOSIT' ? 'text-green-400' : 'text-red-400'}`}>
                        {t.type === 'DEPOSIT' ? '+' : '-'}{t.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <MenuButton onClick={() => setScreen('MENU')} className="mt-6 self-center">Back to Menu</MenuButton>
          </div>
        );
      default:
        return null;
    }
  };

  const renderKeypad = () => {
    switch (screen) {
        case 'PIN':
            return <Keypad 
                onKeyPress={handlePinKeyPress} 
                onEnter={handlePinSubmit} 
                onClear={() => setPin('')}
                onBackspace={() => setPin(p => p.slice(0, -1))}
                enterLabel="ENTER"
            />
        case 'CUSTOM_WITHDRAW':
        case 'CUSTOM_DEPOSIT':
            const action = screen === 'CUSTOM_WITHDRAW' ? handleWithdraw : handleDeposit;
            return <Keypad 
                onKeyPress={handleAmountKeyPress}
                onEnter={() => {
                    const amount = parseFloat(amountInput);
                    if (!isNaN(amount)) action(amount);
                }}
                onClear={() => setAmountInput('')}
                onBackspace={() => setAmountInput(p => p.slice(0, -1))}
                enterLabel="CONFIRM"
            />
        default:
            return <div className="w-[300px]"></div>; // Placeholder to maintain layout
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center font-sans text-white p-4">
      <div className="bg-gray-800 border-4 border-gray-700 rounded-2xl shadow-2xl p-6 flex items-center gap-8">
        <ScreenWrapper>
            {renderScreen()}
        </ScreenWrapper>
        {renderKeypad()}
      </div>
    </div>
  );
};

export default App;
