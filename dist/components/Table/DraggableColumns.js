function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useState, useEffect } from "react";
import { Table } from "antd";
import ReactDragListView from "react-drag-listview";
import "antd/dist/antd.css";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

const ResizeableTitle = props => {
  const {
    onResize,
    onResizeStop,
    onResizeStart,
    width,
    ...restProps
  } = props;

  if (!width) {
    return /*#__PURE__*/React.createElement("th", restProps);
  }

  return /*#__PURE__*/React.createElement(Resizable, {
    width: width,
    height: 0,
    onResize: onResize,
    onResizeStart: onResizeStart,
    onResizeStop: onResizeStop
  }, /*#__PURE__*/React.createElement("th", _extends({
    key: "a"
  }, restProps)));
};

export const DraggableColumns = props => {
  const [columns, setColumns] = useState(props.columns);
  const [data, setData] = useState(props.data);
  const [tbsetting, setTbsetting] = useState(props.tbsetting);
  const components = {
    header: {
      cell: ResizeableTitle
    }
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

    nodeSelector: "th"
  };

  const handleResize = index => (e, {
    size
  }) => {
    console.log("handle resize");
    setColumns(({
      columns
    }) => {
      const nextColumns = [...columns];
      nextColumns[index] = { ...nextColumns[index],
        width: size.width
      };
      return nextColumns;
    });
  }; // const onResizeStart = (e, data) => {
  //   console.log("start resize");
  //   setIsResizing(true);
  //   e.preventDefault();
  // };
  // const onResizeStop = (e, data) => {
  //   console.log("end resize");
  //   setIsResizing(false);
  // };


  const columns1 = columns.map((col, index) => ({ ...col,
    onHeaderCell: column => ({
      width: column.width,
      onResize: handleResize(index) // onResizeStart: onResizeStart,
      // onResizeStop: onResizeStop,

    })
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ReactDragListView.DragColumn, dragProps, /*#__PURE__*/React.createElement(Table, _extends({
    bordered: true,
    components: components,
    columns: columns1 // pagination={false}
    ,
    dataSource: data
  }, tbsetting))));
};