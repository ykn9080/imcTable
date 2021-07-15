import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { sortableHandle } from "react-sortable-hoc";
import { MenuOutlined } from "@ant-design/icons";
import { css } from "@emotion/react";
const header = css({
  backgroundColor: "rgb(100, 108, 140)",
  color: "white",
  margin: "50px",
});
const tableCSS = css({
  margin: "40px 120px",
  backgroundColor: "white",
  "& table": {
    borderCollapse: "collapse",
  },
  "& thead > tr > th": {
    backgroundColor: "darkblue",
    color: "white",
  },
  "& thead > tr": {
    borderWidth: "2px",
    borderColor: "yellow",
    borderStyle: "solid",
  },
});
const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: "pointer", color: "#999" }} />
));

const TableAntSort = (props) => {
  const [dataSource, setDataSource] = useState();
  const [columns, setColumns] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState();

  useEffect(() => {
    if (props.rowSelection) {
      setSelectedRowKeys(props.rowSelection.selectedRowKeys);
    }
    if (props.data) setDataSource(props.data);
    if (props.columns) setColumns(props.columns);
  }, [props]);

  const onSelectChange = (keys, rows) => {
    setSelectedRowKeys({ keys });
    if (props.onSelectChange) props.onSelectChange(keys, rows);
  };
  let rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  let tableSetting = {};
  if (props.rowSelection) {
    tableSetting = { rowSelection: rowSelection };
    if (props.rowSelection.onChange)
      tableSetting = { rowSelection: props.rowSelection };
  }

  let setting = {};
  if (props.size) setting = { ...setting, size: props.size };
  if (props.footer) setting = { ...setting, footer: props.footer };
  //if (props.expandable)
  setting = { ...setting, expandable: props.expandable };

  return (
    <Table
      pagination={false}
      dataSource={dataSource}
      columns={columns}
      rowKey="key"
      {...setting}
      className={tableCSS}
      headerClassName={header}
      // components={{
      //   body: {
      //     wrapper: DraggableContainer,
      //     row: DragableBodyRow,
      //   },
      // }}
      {...tableSetting}
    />
  );
};

export default TableAntSort;
