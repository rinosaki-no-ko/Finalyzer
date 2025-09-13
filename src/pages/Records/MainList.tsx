import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Record, IsExpence, IsIncome, IsTransfer } from "../../utils/dataTypes";
import { yyyymmddToYearMonthDayDayofweek } from "../../utils/date";
import { HandleOverlay } from "./dataType";
import { RecordFilter } from "./dataType";

const getRecords = async () => {
  const promises = ["expence", "income", "transfer"].map(async (recType) => {
    const data = await invoke<Record[]>(`get_${recType}_records`);
    return data;
  });
  const results = await Promise.all(promises);
  const allRecords = results.flat();
  return allRecords;
};

const CreateMainList = ({ recordFilter }: { recordFilter: RecordFilter }) => {
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
      .filter(
        (rec) => recordFilter[rec.record_type as keyof typeof recordFilter]
      )
      .sort((a, b) => (recordFilter.desc ? b.date - a.date : a.date - b.date));

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
  }, [recordFilter, records]);

  return (
    <div className="list-main">
      {recordsPerDay.size === 0 ? (
        <p>No Records</p>
      ) : (
        Array.from(recordsPerDay.entries()).map(([date, records]) => {
          return (
            <section key={`list-${date}`}>
              <p>
                {(() => {
                  const [year, month, day, dayOfWeekIndex] =
                    yyyymmddToYearMonthDayDayofweek(date);
                  const dayOfWeek = [
                    "Sun.",
                    "Mon.",
                    "Tue.",
                    "Wed.",
                    "Thu.",
                    "Fri.",
                    "Sat.",
                  ][dayOfWeekIndex];
                  return `${year}.${month}.${day} ${dayOfWeek}`;
                })()}
              </p>
              <ul>
                {records.map((record) => {
                  if (IsExpence(record)) {
                    return (
                      <li key={`record-${record.uuid}`}>
                        <span>- ¥ {record.amount}</span>
                        <span> {record.category}</span>
                        <span> {record.account}</span>
                        <button type="button">...</button>
                      </li>
                    );
                  } else if (IsIncome(record)) {
                    return (
                      <li key={`record-${record.uuid}`}>
                        <span>+ ¥ {record.amount}</span>
                        <span> {record.category}</span>
                        <span> {record.account}</span>
                        <button type="button">...</button>
                      </li>
                    );
                  } else if (IsTransfer(record)) {
                    return (
                      <li key={`record-${record.uuid}`}>
                        <span>¥ {record.amount}</span>
                        <span>
                          {record.commission === 0 ||
                            `- ¥ ${record.commission}`}
                        </span>
                        <span>{record.from_account}</span>
                        <span> {`→ ${record.to_account}`}</span>
                        <button type="button">...</button>
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

const MainList = ({
  openOverlay,
  recordFilter,
}: {
  openOverlay: HandleOverlay;
  recordFilter: RecordFilter;
}) => {
  return (
    <div className="record-list-container">
      <div className="record-list-functions">
        <button
          type="button"
          onClick={() => {
            openOverlay("new");
          }}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => {
            openOverlay("filter");
          }}
        >
          filter
        </button>
      </div>

      <CreateMainList recordFilter={recordFilter}></CreateMainList>
    </div>
  );
};

export default MainList;
