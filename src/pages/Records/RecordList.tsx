import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import {
  Expence,
  Income,
  Transfer,
  Record,
  IsExpence,
  IsIncome,
  IsTransfer,
} from "../../utils/dataTypes";
import { yyyymmddToYearMonthDayDayofweek } from "../../utils/date";

type RecordType = "expence" | "income" | "transfer";
interface RecordTypes {
  expence: boolean;
  income: boolean;
  transfer: boolean;
}
const getRecords = async () => {
  const promises = ["expence", "income", "transfer"].map(async (recType) => {
    const data = await invoke<Record[]>(`get_${recType}_records`);
    return data;
  });
  const results = await Promise.all(promises);
  const allRecords = results.flat();
  return allRecords;
};

const CreateRecordsTable = ({ recordTypes }: { recordTypes: RecordTypes }) => {
  const [records, setRecords] = useState([] as Record[]);
  const [recordsPerDay, setRecordsPerDay] = useState(
    new Map<number, Record[]>()
  );

  const initialyzeRecords = async () => {
    setRecords((_current) => []);
    try {
      const allRecords = await getRecords();
      setRecords(allRecords);
    } catch (e) {
      console.error("error!!:", e);
    }
  };

  const filterAndGroupRecordsByDate = (records: Record[]) => {
    const filterd = records
      .filter((rec) => recordTypes[rec.record_type as keyof typeof recordTypes])
      .sort((a, b) => b.date - a.date);

    const grouped = new Map<number, Record[]>();
    filterd.forEach((record) => {
      const current = grouped.get(record.date);
      grouped.set(record.date, current ? [...current, record] : [record]);
    });
    return grouped;
  };

  useEffect(() => {
    initialyzeRecords();
  }, []);

  useEffect(() => {
    setRecordsPerDay(filterAndGroupRecordsByDate(records));
  }, [recordTypes, records]);

  return (
    <div className="list-main">
      <button
        onClick={() => {
          initialyzeRecords();
          console.log(recordsPerDay);
        }}
      ></button>
      {recordsPerDay.size === 0 ? (
        <p>No Records</p>
      ) : (
        Array.from(recordsPerDay.entries()).map(([date, records]) => {
          return (
            <section>
              <p>{yyyymmddToYearMonthDayDayofweek(date)}</p>
              <ul>
                {records.map((record) => {
                  if (IsExpence(record)) {
                    return (
                      <li>
                        <span>- ¥ {record.amount}</span>
                        <span> {record.category}</span>
                        <span> {record.account}</span>
                      </li>
                    );
                  } else if (IsIncome(record)) {
                    return (
                      <li>
                        <span>+ ¥ {record.amount}</span>
                        <span> {record.category}</span>
                        <span> {record.account}</span>
                      </li>
                    );
                  } else if (IsTransfer(record)) {
                    return (
                      <li>
                        <span>¥ {record.amount}</span>
                        <span>
                          {record.commission === 0 ||
                            `- ¥ ${record.commission}`}
                        </span>
                        <span>{record.from_account}</span>
                        <span> {`→ ${record.to_account}`}</span>
                      </li>
                    );
                  }
                })}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
};

const RecordList = () => {
  const [recordTypes, setRecordTypes] = useState({
    expence: true,
    income: true,
    transfer: true,
  } as RecordTypes);

  const toggleRecordTypes = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const targetType = ev.currentTarget.value as keyof RecordTypes;
    setRecordTypes({ ...recordTypes, [targetType]: !recordTypes[targetType] });
  };

  return (
    <div className="record-list-container">
      <h2>記録確認</h2>

      <p>収入</p>
      <input
        type="checkbox"
        value="expence"
        onChange={toggleRecordTypes}
        defaultChecked={true}
      />
      <p>支出</p>
      <input
        type="checkbox"
        value="income"
        onChange={toggleRecordTypes}
        defaultChecked={true}
      />
      <p>振替</p>
      <input
        type="checkbox"
        value="transfer"
        onChange={toggleRecordTypes}
        defaultChecked={true}
      />
      <p>
        {Object.entries(recordTypes).map(([k, v]) => (v ? `${k}:◯` : `${k}:✕`))}
      </p>

      <CreateRecordsTable recordTypes={recordTypes}></CreateRecordsTable>
    </div>
  );
};
export default RecordList;
