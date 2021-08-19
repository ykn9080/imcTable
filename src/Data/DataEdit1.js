import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import axios from "axios";
import { currentsetting } from "config/index.js";
import { Spin, Row, message } from "antd";
import MultipleTable from "Data/DataEdit1_MultipleTable";
import JoinData from "Data/DataManipulation";
import { Groupby } from "Data/DataManipulation";
import { pickAndRename } from "components/functions/dataUtil";

export function GroupDataList(dtList, groupby) {
  let rtn = dtList;
  if (groupby) {
    const opt = {
      groupfields: groupby.fields,
      valuefields: groupby.values,
      groupbytype: groupby.groupby,
    };
    rtn = Groupby(dtList, opt);
  }
  return rtn;
}
export function GroupColumnList(columnlist, groupby) {
  let rtn = columnlist;
  if (groupby) {
    const gfields = groupby.values.concat(groupby.fields);
    rtn = _.remove(columnlist, function (n) {
      return gfields.indexOf(n.key) > -1;
    });
  }
  return rtn;
}
//  arrayToObject([[1,2],[3,4,5]],["grp"])
// output[{"grp":0,"value":1},{"grp":0,"value":2},{"grp":1,"value":3},{"grp":1,"value":4},{"grp":1,"value":5}]
export const arrayToObjectFilter = (data) => {
  if (data.setting && data.setting.arraytoobject) {
    const rtn = arrayToObject(data.dtlist, data.setting.arraytoobject);
    return rtn.dt;
  } else return data.dtlist;
};
export const arrayToObject = (array, indexnames) => {
  const initColumn = (dtt) => {
    let colArr1 = [],
      colArr = [];
    if (dtt.length > 0) colArr = Object.keys(dtt[0]);
    colArr.map((k, i) => {
      colArr1.push({ title: k, origin: k, dataIndex: k, key: k });
      return null;
    });
    return colArr1;
  };
  let idxname0 = indexnames.shift();
  if (!idxname0) idxname0 = "group";
  const idxname1 = indexnames.shift();
  let dt = [],
    cols = [];
  if (array && idxname0)
    array.map((k, i) => {
      if (typeof k === "string") return dt.push({ [idxname0]: i, value: k });
      else if (Array.isArray(k)) {
        k.map((a, b) => {
          if (!idxname1) {
            dt.push({ [idxname0]: i, value: a });
          } else {
            dt.push({ [idxname0]: i, [idxname1]: b, value: a });
          }
          return null;
        });
      } else dt = array;
      return null;
    });
  if (dt.length > 0) cols = initColumn(dt);
  return { dt, cols };
};
const filterList = (filList, columnList) => {
  let filList1 = [];
  const filterColumn = (type, decimal, data) => {
    Boolean.parse = function (str) {
      switch (str.toLowerCase()) {
        case "true":
          return true;
        case "false":
        default:
          return false;
      }
    };

    switch (type) {
      case "string":
        return data?.toString();
      case "int":
        return parseInt(data);
      case "float":
        return parseFloat(data).toFixed(parseInt(decimal));
      case "bool":
        return Boolean.parse(data);
      case "datetime":
        return Date.parse(data);
      default:
        break;
    }
  };

  if (filList && typeof filList === "object")
    filList.map((a, j) => {
      columnList.map((b, m) => {
        if (b.calculaterule) {
          a = {
            ...a,
            [b.key]: calcMaker(b.calculaterule, a),
          };
        }
        if (b.datatype) {
          a = {
            ...a,
            [b.key]: filterColumn(b.datatype, b.decimal, a[b.key]),
          };
        }
        return null;
      });
      filList1.push(a);
      return null;
    });

  return filList1;
};
const calcMaker = (rule, row) => {
  //const rule="$wgt/3+10",row={wgt:3,src:1,tgt:2}
  if (!rule) return false;
  let spl1 = [],
    cond = [],
    rtn;
  const rkey = Object.keys(row);
  const rval = Object.values(row);
  const parseRule = (splitt) => {
    spl1 = splitt.split("$");
    //["", "wgt/3+10"];
    spl1.map((k, i) => {
      rkey.map((s, j) => {
        if (k.toLowerCase().indexOf(s.toLocaleLowerCase()) > -1)
          spl1.splice(i, 1, k.replace(s, rval[j]));
        return null;
      });
      return null;
    });
    return spl1.join("");
  };
  const tryEval = (str) => {
    try {
      str = eval(str);
    } catch (e) {
      console.log(e);
    }
    return str;
  };

  cond = rule.split(",");
  if (cond.length === 3) {
    if (tryEval(parseRule(cond[0]))) {
      rtn = tryEval(parseRule(cond[1]));
    } else rtn = tryEval(parseRule(cond[2]));
  } else {
    rtn = parseRule(rule);
    rtn = tryEval(rtn);
  }

  return rtn;
};
const makeColumn = (columns, colsetting) => {
  let col = [],
    dtt = [];
  // if (editable === false) col = columns;
  // else {
  columns.map((column, i) => {
    if (i === 0 && column.titletext === "0") column.titletext = "";
    let obj = {
      title: column.titletext,
      titletext: column.titletext,
      origin: column.origin,
      dataIndex: column.dataIndex,
      key: column.key,
      sort: column.sort,
      datatype: column.datatype,
      decimal: column.decimal,
      render(text, record) {
        let styleset = {};
        if (record[`color.${obj.origin}`])
          styleset = { background: record[`color.${obj.origin}`] };
        return {
          props: {
            style: { ...styleset },
          },
          children: <div>{text}</div>,
        };
      },
    };
    if (!obj.title | !obj.titletext) {
      obj.title = obj.origin;
      obj.titletext = obj.origin;
    }
    if (colsetting.order) {
      obj.sort = colsetting.order.indexOf(obj.key);
    }
    if (obj.sort) obj.sorter = (a, b) => a[column] - b[column];
    if (column.origin.indexOf("color") > -1) return false;
    col.push(obj);

    dtt.push({
      key: i,
      ...column,
    });
    return null;
  });

  col = _.sortBy(col, ["sort"]);
  return col;
  //return { col: col, dt: dtt };
};
export const UpdateColnData = (data) => {
  let columnList = [];
  let colArr = data?.setting?.column;
  let dttlist = data.dtlist;
  if (!colArr) return false;
  let ds = data.setting;

  colArr.map((k, i) => {
    if (!(ds && ds.delarr && ds.delarr.indexOf(k.key) > -1) | ds.reset)
      columnList.push(k);
    return null;
  });
  columnList = GroupColumnList(columnList, ds.groupby);
  dttlist = GroupDataList(dttlist, ds.groupby);
  const filList = filterList(dttlist, columnList);
  const cols = makeColumn(columnList, data.setting);
  //if (ds.groupby) makeGroupby(ds.groupby, filList);
  //setColumns(rtn.col);

  // if (filList === dttlist) setFiltered(dttlist);
  // else setFiltered(filList);
  return { dtlist: filList, column: cols };
};
export const UpdateColnDataAndApplyToDataList = (data) => {
  //After UpdateColnData, apply column to dtlist
  if (!data) return;

  const updated = UpdateColnData(data);
  //ex:array=[{a:1,b:2,c:3},{a:11,b:21,c:31}]
  //pickAndRename(array, ["a","b"],["aa","bb"])
  //result: [{aa: 1, bb: 2},{aa: 11, bb: 21}]
  let cobj = {};
  const sorted = _.orderBy(updated.column, ["sort"]);
  sorted.map((k, i) => {
    cobj = { ...cobj, [k.origin]: k.title };
    return null;
  });
  const rtn = pickAndRename(
    updated.dtlist,
    Object.keys(cobj),
    Object.values(cobj)
  );
  return rtn;
};
export const baseData = (data1) => {
  let setting = {};
  if (!data1) return false;
  if (data1.setting) setting = data1.setting;
  let colArr,
    colCompare,
    colArr1 = [],
    diffnum = 0;

  //setting.reset = delColumnShow;
  //if (!size) size = "small";
  colArr = setting.column;
  if (colArr && data1.dtlist && data1.dtlist.length > 0) {
    colCompare = Object.keys(data1.dtlist[0]);
    let colArrColumn = [];
    colArr.map((k, i) => {
      colArrColumn.push(k.key);
      return null;
    });
    diffnum = _.difference(colArrColumn, colCompare).length;
  }
  if (!colArr | (diffnum > 0)) {
    if (setting.arraytoobject) {
      const rtn = arrayToObject(data1.dtlist, setting.arraytoobject);
      setting = { ...setting, column: rtn.cols };

      data1 = { ...data1, dtlist: rtn.dt };
      //column = rtn.cols;
      // setData(data1);
      // setColumns(rtn.cols);
    } else if (data1.dtlist && data1.dtlist.length > 0 && !colArr) {
      colArr = setting.colArr || Object.keys(data1.dtlist[0]);
      colArr.map((k, i) => {
        colArr1.push({
          title: k,
          titletext: k,
          origin: k,
          dataIndex: k,
          key: k,
        });
        return null;
      });
      setting.column = colArr1;
      data1.setting = setting;
      //column = setting.column;
      // setData(data1);
      // setColumns(setting.column);
    }
  }
  //else setData(data1);
  //return { data: data1, column: column };
  return data1;
};

export const SingleData = (data) => {
  if (!data) return;
  const basedt = baseData(data);
  if (basedt) {
    return UpdateColnData(basedt);
  }
};
let finishedArr = [];

const fetchDatalist = async (k, i) => {
  if (!k.type) {
    return { index: i, dtlist: [] };
  }
  if (k.type.stype === "result") {
    let resultdt = [];
    if (!k.dtlist && k.dtorigin) {
      k.dtlist = k.dtorigin;
    }
    resultdt = await new Promise((resolve, reject) => {
      //if (!k.type.subresult | (k.type.subresult === "root"))
      resolve({ index: i, dtlist: k.dtlist });
      // else resolve({ index: i, dtlist: k.dtlist[k.type.subresult] });
    });
    finishedArr.push(k.key);
    return resultdt;
  } else if (!(k.dtlist && k.dtlist.length > 0)) {
    switch (k.type.stype) {
      case "current data":
        if (k.type.subtype === "layer") {
          const getdata = await new Promise((resolve, reject) => {
            axios
              .get(
                `${currentsetting.webserviceprefix}link/any?pid=${k.type.code}`
              )
              .then((res) => {
                let nudeArr = [];
                res.data.map((k, i) => {
                  const s = k.linkAttribute;
                  nudeArr.push({
                    key: i,
                    src: s.src,
                    tgt: s.tgt,
                    wgt: s.wgt,
                  });
                  return null;
                });

                finishedArr.push(k.key);
                resolve({ index: i, dtlist: nudeArr });
              });
          });
          return getdata;
        } else {
          const getdata3 = await new Promise((resolve, reject) => {
            axios
              .get(
                `${currentsetting.webserviceprefix}node/any?pid=${k.type.code}`
              )
              .then((res) => {
                let nudeArr = [];
                res.data.map((k, i) => {
                  nudeArr.push({ key: i, ...k.nodeattribute });
                  return null;
                });

                finishedArr.push(k.key);
                resolve({ index: i, dtlist: nudeArr });
              });
          });
          return getdata3;
        }

      case "upload":
        const getdata1 = await new Promise((resolve, reject) => {
          //const getdata1 = await axios
          axios
            .post(`${currentsetting.webserviceprefix}allread`, {
              filepath: "." + k.type.filepath,
            })
            .then((res) => {
              console.log(res);
              let subtype = k?.type?.subtype?.key;
              if (!subtype) subtype = "Sheet1";

              finishedArr.push(k.key);
              resolve({ index: i, dtlist: res.data[subtype] });
              //return { index: i, dtlist: res.data[subtype] };
            })
            .catch((e) => {
              //reject(e);
              console.log(e);
            });
        });
        return getdata1;
      case "api":
        const getdata2 = await new Promise((resolve, reject) => {
          axios
            .get("https://cors-anywhere.herokuapp.com/" + k.type.api, {
              crossdomain: true,
            })
            .then((res) => {
              const dtarr = Object.keys(res.data);
              if (dtarr.length > 0) {
                finishedArr.push(k.key);
                resolve({ index: i, dtlist: res.data[dtarr[0]].row });
              } else reject("failed");
            });
        });
        return getdata2;
      default:
        break;
    }
  } else {
    const getdata = await new Promise((resolve, reject) => {
      finishedArr.push(k.key);
      resolve({ index: i, dtlist: k.dtlist });
    });
    return getdata;
  }
};
export const fillDatalist = async (dt) => {
  //because tempData.source.datalist is empty, find and fill in
  let promises;
  if (dt?.source) {
    let list = dt.source;
    promises = list.map(async (k, i) => {
      const rtn = fetchDatalist(k, i);
      return rtn;
    });
  }

  if (!promises) {
    if (dt?.source)
      message.error({
        content: "No data found",
        duration: 5,
        style: {
          marginTop: "20vh",
        },
      });
    //setShowloading(false);
    return false;
  }
  const getdatas = await Promise.all(promises);
  if (getdatas[0]) {
    getdatas.map((k, i) => {
      if (k) {
        dt.source.map((a, b) => {
          if (k.index === b) {
            a.dtorigin = k.dtlist;
            a.dtlist = k.dtlist;
            const rtn = SingleData(a);
            a.dtlist = rtn.dtlist;

            dt.source.splice(b, 1, a);
          }
          return null;
        });
      }
      return null;
    });

    //   while (finishedArr.length === tempData.source.length) {
    dt.source.map((k, i) => {
      //if (!k.type) return false;
      // if (!(k.dtlist && k.dtlist.length > 0)) {
      switch (k?.type?.stype) {
        case "copy":
          if (finishedArr.indexOf(k.type.code) === -1) return false;
          const origin = _.find(dt.source, { key: k.type.code });
          if (origin) {
            k.dtlist = origin.dtlist;
          }
          const rtn = SingleData(k);
          k.dtlist = rtn.dtlist;
          dt.source.splice(i, 1, k);
          finishedArr.push(k.key);
          break;
        case "join":
          if (
            (finishedArr.indexOf(k.type.lefttable) === -1) |
            (finishedArr.indexOf(k.type.righttable) === -1)
          )
            return false;
          const left = _.find(dt.source, { key: k.type.lefttable });
          const right = _.find(dt.source, {
            key: k.type.righttable,
          });

          if (
            left &&
            right &&
            left.dtlist &&
            right.dtlist &&
            k.type.leftkey &&
            k.type.rightkey
          ) {
            switch (k.type.method) {
              case "inner":
                let key = k.type.leftkey;
                if (key !== k.type.rightkey) key = [key, k.type.rightkey];

                k.dtlist = JoinData(left.dtlist, right.dtlist, key);

                const rtn = SingleData(k);
                k.dtlist = rtn.dtlist;
                break;
              default:
                break;
            }
            dt.source.splice(i, 1, k);
            finishedArr.push(k.key);
          }
          break;
        default:
          break;
      }
      return null;
    });
  }
  return dt;
};
const DataEdit1 = (props) => {
  const [fetchdone, setFetchdone] = useState();
  const [showloading, setShowloading] = useState(false);
  let tempData = useSelector((state) => state.global.tempData);
  let allData = useSelector((state) => state.global.allData);
  let selectedKey = useSelector((state) => state.global.selectedKey);
  let curdatalist, nodesetlist, layerlist;
  useEffect(() => {
    setShowloading(true);
    initLoad();
  }, [tempData]);
  const initLoad = async () => {
    const dt = await fillDatalist(tempData);
    if (dt !== false) setFetchdone(dt);
    setShowloading(false);
  };
  // const arrayToObjectFilter = (data) => {
  //   if (data.setting.arraytoobject) {
  //     const rtn = arrayToObject(data.dtlist, data.setting.arraytoobject);
  //     return rtn.dt;
  //   } else return data.dtlist;
  // };
  if (allData) {
    nodesetlist = _.filter(allData.nodeset, { pid: selectedKey });
    let nodes = [];
    nodesetlist.map((k) => {
      nodes.push({ text: `[node]${k.title}`, value: k._id });
      return null;
    });
    const keylist = nodesetlist.map((k) => {
      return k._id;
    });
    layerlist = [];
    allData.layer.map((k, i) => {
      if ((keylist.indexOf(k.pid) > -1) | (keylist.indexOf(k.pid1) > -1))
        layerlist.push({ text: `[layer]${k.title}`, value: k._id });
      return null;
    });
    curdatalist = nodes.concat(layerlist);
  }
  return (
    <div>
      {/* <PageHeader className="site-page-header" title="Table Edit" /> */}
      <div>
        {/* {fetchdone && (
          <MultipleTable curdatalist={curdatalist} tempData1={fetchdone} />
        )} */}
        <MultipleTable curdatalist={curdatalist} tempData1={fetchdone} />
      </div>
      {showloading && (
        <Row justify="center">
          <Spin tip="Data Loading..."></Spin>
        </Row>
      )}
    </div>
  );
};

export default DataEdit1;
