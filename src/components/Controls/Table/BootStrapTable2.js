import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";

const BootTable = ({ dt, apiUrl, keyfield, attr }) => {
  // let condensed = "";
  // if (props.condensed) condensed = props.condensed;
  let hover = false,
    striped = false;
  let selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    clickToEdit: true
  };
  if (typeof keyfield == "undefined") keyfield = "id";
  if (typeof attr != "undefined") {
    if (typeof attr.hover != "undefined") hover = attr.hover;
    if (typeof attr.striped != "undefined") striped = attr.striped;
  }
  const [state, setState] = useState(dt);
  useEffect(() => {
    axios.get(apiUrl).then(response => {
      setState({ ...state, dataList: response.data.results });
    });
    // axios.get("http://localhost:3001/results").then(response => {
    //   console.log(response);
    //   setState({ ...state, products: response.data.results });
    // });
  }, [apiUrl]);

  return (
    <div className="container" style={{ marginTop: 50 }}>
      <BootstrapTable
        striped={striped}
        hover={hover}
        keyField={keyfield}
        data={state.dataList}
        columns={state.columns}
        filter={filterFactory()}
        pagination={paginationFactory()}
        cellEdit={cellEditFactory({
          mode: "dbclick",
          blurToSave: true,
          onStartEdit: (row, column, rowIndex, columnIndex) => {
            console.log("start:", row, column, rowIndex, columnIndex);
          },
          beforeSaveCell: (oldValue, newValue, row, column) => {
            console.log("Before:", oldValue, newValue, row, column);
          },
          afterSaveCell: (oldValue, newValue, row, column) => {
            console.log("After:", oldValue, newValue, row, column);
          }
        })}
        selectRow={selectRow}
      />
      <Button
        onClick={() => {
          axios.get("http://localhost:3001/results").then(response => {
            console.log(response);
            setState({ ...state, dataList: response.data.results });
          });
        }}
      >
        click
      </Button>
    </div>
  );
};

export default BootTable;
