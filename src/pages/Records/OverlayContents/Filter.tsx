import { HandleOverlay, RecordFilter } from "../dataType";
const Filter = ({
  handleOverlay,
  filterHandleSet,
}: {
  handleOverlay: HandleOverlay;
  filterHandleSet: [
    recordFilter: RecordFilter,
    setRecordFilter: (recordFilter: RecordFilter) => void
  ];
}) => {
  const [recordFilter, setRecordFilter] = filterHandleSet;
  const handleRecordFilter = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const targetProp = ev.currentTarget.value as keyof RecordFilter;
    setRecordFilter({
      ...recordFilter,
      [targetProp]: ev.currentTarget.checked,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          handleOverlay("close");
        }}
      >
        OK
      </button>

      <p>
        <input
          type="checkbox"
          name="sort-direction"
          value="desc"
          defaultChecked={true}
          onChange={handleRecordFilter}
          id="input-filter-desc"
        />
        <label htmlFor="input-filter-desc">
          Now: {recordFilter.desc ? "Newest to Oldest" : "Oldest to Newest"}
        </label>
      </p>

      {["expence", "income", "transfer"].map((recordType) => (
        <p key={`input-filter-${recordType}`}>
          <input
            id={`input-filter-${recordType}`}
            type="checkbox"
            value={recordType}
            onChange={handleRecordFilter}
            defaultChecked={true}
          />
          <label htmlFor={`input-filter-${recordType}`}>{recordType}</label>
        </p>
      ))}
    </>
  );
};
export default Filter;
