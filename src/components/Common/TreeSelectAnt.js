import React, { useEffect, useState } from "react";
import { TreeSelect } from "antd";
import _ from "lodash";
import { makeFlatFromTree } from "components/Common/TreeAnt";
import { loop } from "components/Common/TreeAnt";

const { SHOW_PARENT } = TreeSelect;

const TreeSelectAnt = (props) => {
  const [treeNode, setTreeNode] = useState();

  useEffect(() => {
    setTreeNode(loop(props.flatData));
  }, []);
  const onChange = (value) => {
    const flatData = makeFlatFromTree(props.flatData);
    if (props.onChange) {
      const nodeval = _.find(flatData, (o) => {
        return o.key === value;
      });
      props.onChange(nodeval, value);
    }
  };

  let tProps = {
    treeData: props.flatData,
    // value: value,
    treeIcon: true,
    onChange: onChange,
    // treeCheckable: true,
    treeDefaultExpandAll: true,
    dropdownStyle: { maxHeight: 400, overflow: "auto" },
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select",
    style: {
      width: "100%",
    },
  };
  if (props.defaultValue)
    tProps = {
      ...tProps,
      defaultValue: props.defaultValue,
      value: props.defaultValue,
    };
  if (
    (props.treeDefaultExpandAll === true) |
    (props.treeDefaultExpandAll === false)
  )
    tProps = { ...tProps, treeDefaultExpandAll: props.treeDefaultExpandAll };
  return <TreeSelect {...tProps}>{treeNode}</TreeSelect>;
};

export default TreeSelectAnt;
