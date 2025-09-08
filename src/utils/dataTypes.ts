interface Expence {
  record_type: string;
  date: number;
  category: string;
  amount: number;
  description: string;
  account: string;
  member: string;
  uuid: string;
}

interface Income {
  record_type: string;
  date: number;
  category: string;
  amount: number;
  description: string;
  account: string;
  member: string;
  uuid: string;
}

interface Transfer {
  record_type: string;
  date: number;
  from_account: string;
  to_account: string;
  amount: number;
  commission: number;
  description: string;
  uuid: string;
}

export { type Expence, type Income, type Transfer };
