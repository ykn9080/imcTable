import React, { useState, useEffect } from "react";
import { Table } from "antd";
import ReactDragListView from "react-drag-listview";
import "antd/dist/antd.css";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

const ResizeableTitle = (props) => {
  const { onResize, onResizeStop, onResizeStart, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      onResizeStart={onResizeStart}
      onResizeStop={onResizeStop}
    >
      <th key="a" {...restProps} />
    </Resizable>
  );
};
export const DraggableColumns = (props) => {
  const [isResizing, setIsResizing] = useState(false);
  const [columns, setColumns] = useState(props.columns);
  const [data, setData] = useState(props.data);
  const [tbsetting, setTbsetting] = useState(props.tbsetting);
  const components = {
    header: {
      cell: ResizeableTitle,
    },
  };
  useEffect(() => {
    setColumns(props.columns);
    setData(props.data);
  }, [props.columns, props.data]);
  useEffect(() => {
    setTbsetting(props.tbsetting);
  }, [props.tbsetting]);

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      let cols = [...columns];
      const item = cols.splice(fromIndex, 1)[0];
      cols.splice(toIndex, 0, item);
      setColumns(cols);
      props.onDragEnd(cols);
    },
    nodeSelector: "th",
  };
  const handleResize = (index) => (e, { size }) => {
    console.log("handle resize");
    setColumns(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return nextColumns;
    });
  };

  const onResizeStart = (e, data) => {
    console.log("start resize");
    setIsResizing(true);
    e.preventDefault();
  };

  const onResizeStop = (e, data) => {
    console.log("end resize");
    setIsResizing(false);
  };
  const columns1 = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
      onResizeStart: onResizeStart,
      onResizeStop: onResizeStop,
    }),
  }));
  return (
    <div>
      <ReactDragListView.DragColumn {...dragProps}>
        <Table
          bordered
          components={components}
          columns={columns1}
          // pagination={false}
          dataSource={data}
          {...tbsetting}
        />
      </ReactDragListView.DragColumn>
    </div>
  );
};
export default class Demo extends React.Component {
  constructor(props) {
    super(props);

    const that = this;
    this.dragProps = {
      onDragEnd(fromIndex, toIndex) {
        const columns = that.state.columns;
        const item = columns.splice(fromIndex, 1)[0];
        columns.splice(toIndex, 0, item);
        that.setState({
          columns,
        });
        props.onDragEnd(columns);
      },
      nodeSelector: "th",
    };
  }

  state = {
    isResizing: false,
    columns: this.props.columns,
    // [
    //   {
    //     title: "Key",
    //     dataIndex: "key",
    //   },
    //   {
    //     title: "Name",
    //     dataIndex: "name",
    //     width: 200,
    //   },
    //   {
    //     title: "Gender",
    //     dataIndex: "gender",
    //     width: 100,
    //   },
    //   {
    //     title: "Age",
    //     dataIndex: "age",
    //     width: 75,
    //   },
    //   {
    //     title: "Address",
    //     dataIndex: "address",
    //     width: 100,
    //   },
    // ],
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  data = this.props.data;
  // [
  //   {
  //     key: "1",
  //     name: "Boran",
  //     gender: "male",
  //     age: "12",
  //     address: "New York",
  //   },
  //   {
  //     key: "2",
  //     name: "JayChou",
  //     gender: "male",
  //     age: "38",
  //     address: "TaiWan",
  //   },
  //   {
  //     key: "3",
  //     name: "Lee",
  //     gender: "female",
  //     age: "22",
  //     address: "BeiJing",
  //   },
  //   {
  //     key: "4",
  //     name: "ChouTan",
  //     gender: "male",
  //     age: "31",
  //     address: "HangZhou",
  //   },
  //   {
  //     key: "5",
  //     name: "AiTing",
  //     gender: "female",
  //     age: "22",
  //     address: "Xi’An",
  //   },
  // ];

  handleResize = (index) => (e, { size }) => {
    console.log("handle resize");
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  onResizeStart = (e, data) => {
    console.log("start resize");
    this.setState(({ isResizing }) => {
      return { isResizing: true };
    });
    //e.stopPropagation()
    e.preventDefault();
  };

  onResizeStop = (e, data) => {
    console.log("end resize");
    this.setState(({ isResizing }) => {
      return { isResizing: false };
    });
  };

  render() {
    // const columns = this.state.columns.map((col, index) => ({
    //   ...col,
    //   onHeaderCell: (column) => ({
    //     width: column.width,
    //     onResize: this.handleResize(index),
    //     onResizeStart: this.onResizeStart,
    //     onResizeStop: this.onResizeStop,
    //   }),
    // }));

    return (
      <div>
        <ReactDragListView.DragColumn {...this.dragProps}>
          <Table
            bordered
            components={this.components}
            columns={this.state.columns}
            // pagination={false}
            dataSource={this.props.data}
            {...this.props.tbsetting}
          />
        </ReactDragListView.DragColumn>
      </div>
    );
  }
}
