
export type Screen = 'PIN' | 'MENU' | 'BALANCE' | 'WITHDRAW' | 'DEPOSIT' | 'HISTORY' | 'CUSTOM_WITHDRAW' | 'CUSTOM_DEPOSIT';

export interface Transaction {
  id: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  date: string;
}
