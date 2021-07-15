import _ from "lodash";
import axios from "axios";
import { currentsetting } from "config/index.js";
import { pick } from "components/functions/LodashUtil";

export const makeBtnArray = (list) => {
  //if already has btnArr, pass

  //combine all button as array
  const btn = _.filter(list, (o) => {
    return o.type === "button";
  });
  if (btn.length === 0) return list;
  if (btn.length > 0 && btn[0].btnArr) {
    //this is at ElementInput.js instantView at  bottom
    //add onClick event to load and edit each button one by one
    return list;
  } else {
    const others = _.filter(list, (o) => {
      return o.type !== "button";
    });
    let setting = {};
    const align = _.filter(btn, (o) => {
      return o.align === "right";
    });
    const block = _.filter(btn, (o) => {
      return o.block === true;
    });
    if (align.length > 0) setting = { align: "right" };
    if (block.length > 0) setting = { ...setting, block: true };
    if (btn.length > 0) setting = { ...setting, seq: btn[0].seq };
    others.push({ type: "button", btnArr: btn, ...setting });
    return others;
  }
};

// const makeNode = async (_id, list) => {
//   let outlist;
//   const promises = list.map(async (pid) => {
//     let getdata;
//     getdata = await getfromServer(pid, "node");
//     getdata = optionBind(getdata);
//     return getdata;
//   });

//   const rtn = await Promise.all(promises);

//   return _.flatten(rtn, true);
// };

// const makeNode = async (getnode, _id) => {
//   const promises = arr.map(async (_id) => {
//     if (getnode.length === 0) getnode = await getfromServer(_id);
//     return getnode;
//   });

//   const rtn = await Promise.all(promises);

//   return _.flatten(rtn, true);
// };

// const getfromStore = (_id, type) => {
//   //type:node, link
//   //_id:layer_id or nodeset_id
//   // console.log(state.optArr);
//   // let list;
//   // return new Promise((resolve) => {
//   //   list = _.filter(state.optArr, (o) => {
//   //     return o.pid === _id;
//   //   });
//   //   resolve(list);
//   // });
// };
const getfromServer = (collection, _id, idtype, getmethod) => {
  //type:node, link
  //_id:layer_id or nodeset_id
  let param = "any";
  if (getmethod === "singlerow") param = 1; //apply limit(1) in mongodb
  return new Promise((resolve, reject) => {
    let url = `${currentsetting.webserviceprefix}${collection}/${param}?${idtype}=${_id}`;
    axios.get(url).then((response) => {
      resolve(response.data);
    });
  });
};

export const optionBind = async (list, dbArray, optlist) => {
  //if option is based on database, make array by query
  const output = (data, optobj) => {
    //const rtn = await makeNode();
    let field = "nodeattribute",
      getmethod = "singlerow",
      deletefield = [],
      keyval = "key",
      outlist;

    field = optobj.field;
    getmethod = optobj.getmethod;
    keyval = optobj.keyval;
    if (optobj.deletefield !== "") deletefield = optobj.deletefield.split(",");

    switch (getmethod) {
      case "distinct":
        break;
      case "singlerow":
        outlist = data[0][field];
        break;
      default:
        break;
    }
    deletefield.map((k) => {
      return delete outlist[k];
    });
    if (keyval === "key") outlist = Object.keys(outlist);
    else outlist = Object.values(outlist);
    return outlist;
  };
  const optionMake = (arr) => {
    let rtn = [];
    arr.map((k, i) => {
      rtn.push({ text: k.charAt(0).toUpperCase() + k.slice(1), value: k });
      return null;
    });
    return rtn;
  };
  const dblist = pick(dbArray, "name");
  const idlist = pick(dbArray, "id");
  const idtypelist = pick(dbArray, "idtype");
  dblist.map(async (k, i) => {
    //optlist: redux saved outputlist, for reuse
    //if exist no need to fetch server
    let outputlist = _.find(optlist, (o) => {
      return o.name === k;
    });
    if (!outputlist) {
      let optobj = _.find(list, (o) => {
        return o.name === k;
      });
      if (
        optobj &&
        optobj.hasOwnProperty("optionArray") &&
        optobj.optionArray !== ""
      ) {
        optobj = JSON.parse(optobj.optionArray[0].value);

        let output1 = await getfromServer(
          optobj.collection,
          idlist[i],
          idtypelist[i]
        );
        outputlist = output(output1, optobj);
        optlist = { ...optlist, [k]: outputlist };
      }

      list.map((a, i) => {
        if (a.name === k) a.optionArray = optionMake(outputlist);
        list.splice(k, i, 1);
        return null;
      });
    }
  });
  return { list: list, optlist: optlist };
};

export default function Blank() {
  return null;
}
