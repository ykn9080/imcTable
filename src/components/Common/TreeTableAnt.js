import React from "react";
import { Table } from "antd";
import { useSelector } from "react-redux";

let columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: "30%",
  },
];

const TreeData = (props) => {
  let data = useSelector((state) => state.global.treeData);
  let radiotype; //= "checkbox";
  if (props.radiotype) radiotype = props.radiotype;
  if (props.columns) columns = props.columns;
  if (props.data) data = props.data;
  // rowSelection objects indicates the need for row selection
  let rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    onSelect: (record, selected, selectedRows) => {
      if (props.onSelect) props.onSelect(record, selected, selectedRows);
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
  if (radiotype) rowSelection = { type: radiotype, ...rowSelection };
  //   const [checkStrictly, setCheckStrictly] = React.useState(false);
  return (
    <>
      {/* <Space align="center" style={{ marginBottom: 16 }}>
        CheckStrictly:{" "}
        <Switch checked={checkStrictly} onChange={setCheckStrictly} />
      </Space> */}
      <Table columns={columns} rowSelection={rowSelection} dataSource={data} />
    </>
  );
};

export default TreeData;
