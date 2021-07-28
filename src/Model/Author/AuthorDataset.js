import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import "components/Common/Antd.css";
import { Select } from "antd";
import { rename } from "components/functions/dataUtil";
import DraggableColumns from "components/Table/DraggableColumns";
const { Option } = Select;
export const cluster = (left, right, keyarr) => {
  left.map((k, i) => {
    k = rename(k, "seq", "id");
    k = rename(k, "@LABEL", "label");
    right.map((a, b) => {
      if (a.indexOf(k.id) > -1) k.group = b;
      return null;
    });
    left.splice(i, 1, k);
    return null;
  });
  return left;
};
export const grouping = (node, key) => {
  let newnode = [];
  node.map((k, i) => {
    newnode.push({ id: k.seq, label: k["@LABEL"], group: k[key] });
    return null;
  });
  return newnode;
};
export const visNode = (node) => {
  let newnode = [];
  node.map((k, i) => {
    let obj = { id: k.seq, label: k["@LABEL"] };
    newnode.push(obj);
  });
  return newnode;
};
export const visEdge = (edge) => {
  let newnode = [];
  edge.map((k, i) => {
    let obj = { from: k.src, to: k.to };
    if (k.wgt) obj.value = k.wgt;
    newnode.push(obj);
    return null;
  });
  return newnode;
};
const AuthorDataset = ({ authObj, edit, title }) => {
  let tempModel = useSelector((state) => state.global.tempModel);

  useEffect(() => {
    const children = [],
      deflist = [];
    if (tempModel.properties.resultsAuthor) {
      tempModel.properties.resultsAuthor.map((k, i) => {
        let type = k.type;
        if (type === "chart") type = k.setting.charttype;
        children.push(
          <Option
            key={k.id}
          >{`[${k.results}_${type}] ${k.setting.title}`}</Option>
        );
        if (k.checked === true) deflist.push(k.id);
        return null;
      });
    }
  }, []);

  return (
    <>
      <DraggableColumns />
    </>
  );
};

export default AuthorDataset;
