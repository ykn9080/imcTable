import React from "react";
import { useSelector } from "react-redux";
import { Column, Table } from "react-virtualized";
import "react-virtualized/styles.css"; // only needs to be imported once

const ReactVirtual = (props) => {
  let list = [
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
    [
      "Brian Vaughn",
      "Software Engineer",
      "San Jose",
      "CA",
      95125,
      "Software Engineer",
    ],
  ];
  let title = ["name", "job", "address", "state", "zip", "jobagain"];
  //if (props.hasOwnProperty("list")) {
  list = props.list;
  title = props.title;

  const makeColumnFromList = (list) => {
    let col = [];
    if (!list) return false;
    Object.keys(list[0])
      .reverse()
      .map((k, i) => {
        col.push(k);
        return null;
      });
    col.map((k, i) => {
      if (k === "@LABEL") col.splice(i, 1);
      if (k === "seq") col.splice(i, 1);
      return null;
    });
    col.unshift("@LABEL");
    col.unshift("seq");
    return col;
  };
  const list1 = useSelector((state) => state.global.specialcase);
  const title1 = makeColumnFromList(list1);
  if (list1) {
    list = list1;
    title = title1;
  }

  const arrayToObjArr = (list, titleArr) => {
    list.map((k, i) => {
      let obj = {};
      titleArr.map((s, j) => {
        obj[s] = k[j];
        return null;
      });
      list.splice(i, 1, obj);
      return null;
    });
    return list;
  };
  list = arrayToObjArr(list, title);
  const Cap = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <Table
        width={800}
        height={300}
        headerHeight={20}
        rowHeight={30}
        rowCount={list.length}
        rowGetter={({ index }) => list[index]}
      >
        {title.map((k, i) => {
          return <Column label={Cap(k)} key={k} dataKey={k} width={100} />;
        })}
      </Table>
    </>
  );
};

export default ReactVirtual;
