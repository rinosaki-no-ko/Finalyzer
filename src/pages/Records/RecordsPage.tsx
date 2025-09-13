import { JSX, useState } from "react";
import Calender from "./Calender";
import MainList from "./MainList";
import Overlay from "../../utils/Overlay";
import SaveNewRecord from "./OverlayContents/SaveNewRecord";
import { HandleOverlay, OverlayState, RecordFilter } from "./dataType";
import Filter from "./OverlayContents/Filter";

const createOverlay = (
  overlay: OverlayState,
  handleOverlay: HandleOverlay,
  filterHandleSet: [
    recordfilter: RecordFilter,
    setRecordFilter: (recordfilter: RecordFilter) => void
  ]
) => {
  let children: JSX.Element;

  if (overlay === "close") {
    return <></>;
  } else if (overlay === "new") {
    children = <SaveNewRecord handleOverlay={handleOverlay} />;
  } else if (overlay === "edit") {
    children = <h3>edit</h3>;
  } else if (overlay === "filter") {
    children = (
      <Filter filterHandleSet={filterHandleSet} handleOverlay={handleOverlay} />
    );
  } else {
    children = (
      <button
        type="button"
        onClick={() => {
          handleOverlay("close");
        }}
      >
        close
      </button>
    );
  }

  return <Overlay>{children}</Overlay>;
};

const RecordsPage = () => {
  const [overlay, setOverlay] = useState("close" as OverlayState);
  const handleOverlay = (overlay: OverlayState) => {
    setOverlay(overlay);
  };

  const [recordFilter, setRecordFilter] = useState({
    expence: true,
    income: true,
    transfer: true,
    desc: true,
  } as RecordFilter);

  return (
    <div className="page-container records-container">
      {createOverlay(overlay, setOverlay, [recordFilter, setRecordFilter])}
      <div className="calendar-wrapper">
        <Calender />
      </div>
      <div className="record-list-wrapper">
        <MainList openOverlay={handleOverlay} recordFilter={recordFilter} />
      </div>
    </div>
  );
};
export default RecordsPage;
