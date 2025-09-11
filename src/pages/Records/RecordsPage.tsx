import RecordList from "./RecordList";

const RecordsPage = () => {
  return (
    <div className="page-container records-container">
      <div className="calendar-wrapper"></div>
      <div className="record-list-wrapper">
        <RecordList />
      </div>
    </div>
  );
};
export default RecordsPage;
