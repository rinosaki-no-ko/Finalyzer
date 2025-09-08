import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Expence, Income, Transfer } from "../../utils/dataTypes";

type RecordType = "expence" | "income" | "transfer";

interface RecordTypes {
  expence: boolean;
  income: boolean;
  transfer: boolean;
}
const CreateRecordsTable = ({
  recordTypes,
  desc,
}: {
  recordTypes: RecordTypes;
  desc: boolean;
}) => {
  const [records, setRecords] = useState([] as (Expence | Income | Transfer)[]);
  const [filteredRecords, setFilteredRecords] = useState(
    [] as (Expence | Income | Transfer)[]
  );

  const initialyzeRecords = async () => {
    setRecords((_current) => []);

    try {
      const promises = ["expence", "income", "transfer"].map(
        async (recType) => {
          const data = await invoke<(Expence | Income | Transfer)[]>(
            `get_${recType}_records`
          );
          return data;
        }
      );

      const results = await Promise.all(promises);

      const allRecords = results.flat();
      setRecords(allRecords);
    } catch (e) {
      console.error("error!!:", e);
    }
  };

  const showRecords = () => {
    setFilteredRecords((_current) => []);
    const filterd = records
      .filter((rec) => recordTypes[rec.record_type as keyof typeof recordTypes])
      .sort((a, b) => (desc ? b.date - a.date : a.date - b.date));
    setFilteredRecords((_current) => filterd);
  };

  useEffect(() => {
    initialyzeRecords();
  }, []);

  useEffect(() => {
    showRecords();
  }, [recordTypes, desc, records]);

  return (
    <>
      {filteredRecords.length === 0 ? (
        <p>該当するデータがありません</p>
      ) : (
        filteredRecords.map((rec) => {
          return (
            <div key={rec.uuid}>
              <hr />
              <p>reord type = {rec.record_type}</p>
              {Object.entries(rec).map(([key, val]) => {
                return (
                  <p key={`${rec.uuid}${key}`}>
                    {key}:{val}
                  </p>
                );
              })}
            </div>
          );
        })
      )}
    </>
  );
};

const ViewRecords = () => {
  const [recordTypes, setRecordTypes] = useState({
    expence: true,
    income: true,
    transfer: true,
  } as RecordTypes);

  const toggleRecordTypes = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const targetType = ev.currentTarget.value as keyof RecordTypes;
    setRecordTypes({ ...recordTypes, [targetType]: !recordTypes[targetType] });
  };

  const [desc, setDesc] = useState(true);

  return (
    <>
      <h2>記録確認</h2>
      <p>{desc ? "新しい順" : "古い順"}</p>
      <input
        type="checkbox"
        onChange={() => {
          setDesc(!desc);
        }}
        defaultChecked={true}
      />
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

      <CreateRecordsTable
        recordTypes={recordTypes}
        desc={desc}
      ></CreateRecordsTable>
    </>
  );
};
export default ViewRecords;
