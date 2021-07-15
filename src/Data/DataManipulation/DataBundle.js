/*
- For:
Link data is huge, so when click linkset(layer) if not exists in redux, 
1. request server and include in projectbundle link object.
2. also return currentLink redux, i.e. link data and head for tabling and vis graph
when click nodeset
return currentLink for nodeset data and its head
- Date:18/Jul/2020
- Who:yknam
*/

import React, { useEffect } from "react";
import axios from "axios";

import _ from "lodash";
import { currentsetting } from "config/index.js";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";

export default function MakeProjectBundle({ selectedKey }) {
  const dispatch = useDispatch();
  let ProjectBundle = useSelector((state) => state.global.projectbundle);
  let currentLink = useSelector((state) => state.global.currentLink);

  const visGraphNode = (attr, group) => {
    const N = { ...attr };
    //  /let obj = {};
    N.id = N.seq;
    N.label = N["@LABEL"];
    N.group = group;
    delete N.seq;
    delete N["@LABEL"];
    return N;
  };
  const addtoProjectBundle = (_id, type, list) => {
    if (!ProjectBundle[type]) ProjectBundle[type] = list;
    else ProjectBundle[type] = ProjectBundle[type].concat(list);
    dispatch(globalVariable({ projectbundle: ProjectBundle }));
  };

  const getfromStore = (_id, type) => {
    //type:node, link
    //_id:layer_id or nodeset_id
    let list;
    return new Promise((resolve) => {
      list = _.filter(ProjectBundle[type], (o) => {
        return o.pid === _id;
      });
      resolve(list);
    });
  };
  const getfromServer = (_id, type) => {
    let list;
    return new Promise((resolve, reject) => {
      const config = {
        method: "get",
        url: `${currentsetting.webserviceprefix}${type}/dt?pid=${_id}`,
      };
      axios(config).then((response) => {
        list = response.data;
        addtoProjectBundle(_id, type, list);
        resolve(list);
      });
    });
  };

  const makeColumnFromList = (list) => {
    if (list.length === 0) return false;
    let col = [];
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
  useEffect(() => {
    let narr = [],
      na = [],
      narr1 = [],
      na1 = [],
      sindex,
      sindex1,
      larr = [],
      tarr = ["source", "target"],
      rtn;
    //nodeattribute: {seq:1,@LABEL:"John", Gender:"Male",Duration:21,Age:45
    //,Education:"Master",Job-ranking:1, Department:"Finace"}
    //find layer's parent i.e. nodeset
    //NodeList
    const makeNode = async (pid, pid1) => {
      let arr = [pid];
      if (pid !== pid1) arr.push(pid1);
      const promises = arr.map(async (pid) => {
        let getnode;
        getnode = await getfromStore(pid, "node");
        if (getnode.length === 0) getnode = await getfromServer(pid, "node");
        return getnode;
      });

      const rtn = await Promise.all(promises);

      return _.flatten(rtn, true);
    };

    const laydt = _.find(ProjectBundle.layer, (o) => {
      return o._id === selectedKey;
    });

    if (!laydt) {
      makeNode(selectedKey, selectedKey).then((rsp) => {
        ProjectBundle.node.map((k, i) => {
          if (k.pid === selectedKey) {
            narr.push(k.nodeattribute);
            na.push(k.nodeattribute["@LABEL"]);
          }
          return null;
        });

        rtn = {
          nodeArr: narr,
          nodeTitle: makeColumnFromList(narr),
          linkArr: [],
          linkTitle: [],
        };
        dispatch(globalVariable({ currentLink: rtn }));
      });
    }

    if (laydt) {
      let ndl = [],
        ndl1 = [];
      //nodeList
      makeNode(laydt.pid, laydt.pid1).then((rsp) => {
        ProjectBundle.node.map((k, i) => {
          if (k.pid === laydt.pid) {
            const visNode = visGraphNode(k.nodeattribute, 1);
            ndl.push(visNode);
            narr.push(k.nodeattribute);
            na.push(k.nodeattribute["@LABEL"]);
          }

          if (k.pid === laydt.pid1) {
            if (laydt.pid !== laydt.pid1) {
              const visNode = visGraphNode(k.nodeattribute, 2);
              ndl1.push(visNode);
            }
            narr1.push(k.nodeattribute);
            na1.push(k.nodeattribute["@LABEL"]);
          }
          return null;
        });
        if (narr.length > 0) {
          sindex = _.minBy(narr, "seq").seq;
          sindex1 = _.minBy(narr1, "seq").seq;
        }
      });

      //Linklist
      const makeLink = new Promise((resolve, reject) => {
        getfromStore(selectedKey, "link").then((linkStore) => {
          if (linkStore.length > 0) {
            linkMakeup(linkStore);
          } else {
            getfromServer(selectedKey, "link").then((linkServer) => {
              linkMakeup(linkServer);
            });
          }
        });
        let lkl = [];
        const linkMakeup = (linklist) => {
          linklist.map((k, i) => {
            if (k.pid === selectedKey) {
              let ll = k.linklist;
              ll = ll.slice(1);
              const L = [...ll];
              //var number = Math.random(); // 0.9394456857981651
              // const id = number.toString(36).substr(2, 9); // '0.xtis06h6'
              let obj = { from: L[0], to: L[1], value: L[2] };
              // if (avg !== 1) obj = { ...obj, value: parseInt(L[2]) };
              lkl.push(obj);
              ll.splice(0, 1, na[ll[0] - sindex]);
              ll.splice(1, 1, na1[ll[1] - sindex1]);
              larr.push(ll);
            }
            return null;
          });
          const avg = _.meanBy(lkl, function (o) {
            return o["value"];
          });
          if (avg === 1) _.each(lkl, (o) => delete o.value);
          let merged = [].concat(ndl, ndl1);
          resolve({
            larr: larr,
            visGraphData: { nodes: merged, edges: lkl },
          });
        };
      });

      //Link Title from Layer Attribute ["source","target","@WEIGHT", ....]
      const makeLinkTitle = new Promise((resolve, reject) => {
        ProjectBundle.layer.map((k, i) => {
          if (k._id === selectedKey) {
            k.attribute.map((s, j) => {
              tarr.push(s.fieldname);
              return null;
            });
          }
        });
        resolve(tarr);
      });
      Promise.all([makeLink, makeLinkTitle]).then((result) => {
        const larr = result[0].larr;
        const vis = result[0].visGraphData;
        const tarr = result[1];
        //setSpin(false);
        //setVisGraphData(vis);
        dispatch(globalVariable({ graphdata: vis }));

        rtn = {
          nodeArr: [],
          nodeTitle: [], //makeColumnFromList(narr),
          linkArr: larr,
          linkTitle: tarr,
        };
        dispatch(globalVariable({ currentLink: rtn }));
      });
    }
  }, [selectedKey]);

  return null;
}
