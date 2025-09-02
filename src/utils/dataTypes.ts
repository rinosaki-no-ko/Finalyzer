interface Expence {
  date: string;
  category: string;
  amount: number;
  description: string;
  account: string;
  member: string;
  uuid: string;
}

interface Income {
  date: string;
  category: string;
  amount: number;
  description: string;
  account: string;
  member: string;
  uuid: string;
}

interface Transfer {
  date: string;
  from_account: string;
  to_account: string;
  amount: number;
  commission: number;
  description: string;
  uuid: string;
}

export { type Expence, type Income, type Transfer };
