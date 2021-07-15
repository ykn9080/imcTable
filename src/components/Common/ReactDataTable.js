import React, { useState, useCallback, useEffect } from "react";
import _ from "lodash";
import DataTable from "react-data-table-component";

const ReactDataTable = (props) => {
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    console.log("state", selectedRows);
  }, [selectedRows]);

  const handleChange = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const makeColumnFromList = (list) => {
    let col = [];
    if (!(list && list.length > 0)) return col;
    Object.keys(list[0])
      .reverse()
      .map((k, i) => {
        col.push({ name: k, selector: k, sortable: true, right: true });
        return null;
      });
    col.map((k, i) => {
      if (_.indexOf(["@LABEL", "seq"], k.name) !== -1) col.splice(i, 1);
      return null;
    });
    col.unshift({
      name: "@LABEL",
      selector: "@LABEL",
      sortable: true,
      right: false,
    });

    col.unshift({ name: "seq", selector: "seq", sortable: true, right: true });

    return col;
  };
  const columnss = makeColumnFromList(props.list);
  console.log(props.list, columnss);
  let seqlist = [];
  if (props.list)
    props.list.map((k, i) => {
      seqlist.push({ seq: i + 1, ...k });
      return null;
    });

  //<p>{JSON.stringify(data)}</p>;
  return (
    <DataTable
      data={seqlist}
      columns={columnss}
      onSelectedRowsChange={handleChange}
      pagination={true}
      // selectableRows
      // expandableRows
      // expandableRowsComponent={<ExpanableComponent />}
    />
  );
};

export default ReactDataTable;
