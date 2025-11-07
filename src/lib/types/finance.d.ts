export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: 'IDR' | 'USD';
  createdAt: string;
}


