import React from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { globalVariable } from "actions";
import ListGen from "components/SKD/ListGen";
import querySearch from "stringquery";

const ModelList = () => {
  const location = useLocation();
  const dataformat = ["_id", "data", "title", "desc", "type"];
  const dispatch = useDispatch();
  dispatch(globalVariable({ currentStep: 0 }));
  dispatch(globalVariable({ selectedKey: null }));
  dispatch(globalVariable({ currentData: null }));
  dispatch(globalVariable({ tempData: null }));
  dispatch(globalVariable({ tempModel: null }));
  dispatch(globalVariable({ paramvalue: null }));

  let setting = {
    size: "small",
    layout: "horizontal",
    pagination: {
      pageSize: 20,
    },
  };
  let query = querySearch(location.search);
  if (query.from) {
    const str = location.search.replace("?from=", "");
    setting = { return: str };
  }
  return (
    <div style={{ backgroundColor: "white" }}>
      <ListGen url="model" dataformat={dataformat} {...setting} />
    </div>
  );
};

export default ModelList;
