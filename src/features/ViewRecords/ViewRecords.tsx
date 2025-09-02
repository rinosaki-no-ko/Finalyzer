import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { Expence } from "../../utils/dataTypes";

const ViewRecords = () => {
  const [data, setData] = useState([] as Expence[]);
  invoke("get_records")
    .then((val) => {
      setData(val as Expence[]);
    })
    .catch((e) => console.error(e));
  return (
    <>
      <h2>記録確認</h2>
      <button
        onClick={() => {
          invoke("get_records")
            .then((val) => {
              console.log(val);
              setData(val as Expence[]);
            })
            .catch((e) => console.error(e));
        }}
      >
        更新！
      </button>
      {data.map((val) => {
        return (
          <div key={val.uuid}>
            <hr />
            {Object.entries(val).map(([key, val]) => {
              return (
                <p key={`${val.uuid}${key}`}>
                  {key}:{val}
                </p>
              );
            })}
          </div>
        );
      })}
    </>
  );
};
export default ViewRecords;
