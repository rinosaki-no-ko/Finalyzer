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

type Record = Expence | Income | Transfer;

function IsExpence(maybeExpence: Record): maybeExpence is Expence {
  return maybeExpence.record_type === "expence";
}
function IsIncome(maybeIncome: Record): maybeIncome is Income {
  return maybeIncome.record_type === "income";
}
function IsTransfer(maybeTransfer: Record): maybeTransfer is Transfer {
  return maybeTransfer.record_type === "transfer";
}
export {
  type Expence,
  type Income,
  type Transfer,
  type Record,
  IsExpence,
  IsIncome,
  IsTransfer,
};
