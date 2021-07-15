import { message } from "antd";
import axios from "axios";
import _ from "lodash";
import { currentsetting } from "config/index.js";
import { idMake, renameObjToArray } from "components/functions/dataUtil";

export const MainMaker = (source) => {
  const newid = idMake();
  let datas = [];
  if (source) {
    source.map((s, j) => {
      if (!Array.isArray(s.title) && s.title.startsWith("[main]"))
        datas.push(s.key);
    });
  }
  return {
    checked: true,
    type: "html",
    datas: datas,
    setting: { title: "Summary", column: "2", format: "2" },
    x: 0,
    y: 0,
    w: 12,
    h: 24,
    i: "0",
    id: newid,
    key: newid,
  };
};

const tableParse = (obj, labels) => {
  let rtnarr = [];
  const rcount = obj.table[0].length;
  const ccount = obj.table.length;
  let column;
  let contMap = new Map(); // Base datum of ordered column header
  for (let i = 0; i < rcount; i++) {
    let cont = {};
    if (obj.rowHeader) {
      cont = { "-": obj.rowHeader[i] };
      if (i === 0) contMap.set(0, { "-": obj.rowHeader[i] });
    } else if (labels.length > 0) {
      cont = { "-": labels[i] };
      if (i === 0) contMap.set(0, { "-": labels[i] });
    }
    for (let j = 0; j < ccount; j++) {
      const cell = obj.table[j][i];
      let value = cell;
      if (obj.columnHeader) {
        const key = obj.columnHeader[j];

        //null check
        if (!cell) {
          value = "";
        } else if (typeof cell === "object") {
          value = cell.value;
        }
        cont = { ...cont, [key]: value };
        if (i === 0) contMap.set(j + 1, { [key]: value });
        if (cell && typeof cell === "object" && cell.color) {
          cont = { ...cont, [`color.${key}`]: cell.color };
          if (i === 0)
            contMap.set(j + ccount + 1, { [`color.${key}`]: cell.color });
        }
      }
    }

    // create column information
    if (i === 0) {
      column = _.flatten(
        Array.from(contMap).map(([key, value]) => Object.keys(value)),
        true
      );
    }

    rtnarr.push(cont);
  }
  return { arr: rtnarr, column: column };
};

const matrixParse = (obj, labels) => {
  const srcSize = obj.srcSize;
  const tgtSize = obj.tgtSize ? obj.tgtSize : obj.srcSize;
  let table = new Array(tgtSize);
  for (var i = 0; i < table.length; i++) {
    table[i] = Array.from(Array(srcSize), () => 0);
  }
  obj.edgelist.forEach((e) => {
    table[e.tgt][e.src] = e.wgt;
  });
  const columnHeader = obj.tgtLabels ? obj.tgtLabels : obj.labels;
  const rtnarr = tableParse(
    { table: table, columnHeader: columnHeader, rowHeader: obj.labels },
    labels
  );

  return rtnarr;
};
const makeupResults = (results, node) => {
  if (!results) return false;
  // TODO: M/L 요청사항 해당부분 보이지 않게 처리
  if (results.toSaveInfo) {
    let toSaveInfo = results.toSaveInfo;
    delete results.toSaveInfo;
  }
  if (results.inputData) {
    let inputData = results.inputData;
    delete results.inputData;
  }

  let newresults = [],
    columns = [],
    labels = [],
    rtn;
  //results.push(testdt);
  const rArr = Object.keys(results);
  if (node) {
    node.map((k) => {
      labels.push(k.nodeattribute["@LABEL"]);
      return null;
    });
  }
  //let oldnew = "old";
  rArr.map((k, i) => {
    const obj = results[k];
    if (k === "main") {
      newresults = results.main;

      Object.keys(newresults).map((a, b) => {
        renameObjToArray(newresults, a, "[main]" + a);
        return null;
      });
      //oldnew = "new";
      return false;
    }
    if (obj.table) rtn = tableParse(obj, labels);
    else if (obj.edgelist) rtn = matrixParse(obj, labels);

    newresults = { ...newresults, [k]: rtn.arr };
    columns = { ...columns, [k]: rtn.column };

    return null;
  });
  //if (oldnew === "old") newresults = results;

  return [newresults, columns];
};

const ModelRun = async (setting, modelscript, dataset) => {
  //const dispatch = useDispatch();
  console.log(
    "ModelRun: ",
    "setting: ",
    setting,
    "dataset: ",
    dataset,
    "moelscript: ",
    JSON.stringify(modelscript)
  );

  const prop = setting.properties;
  // const data = JsonMaker(setting, dataset);
  const data = setting;

  let config1 = {
    method: "post",
    url:
      prop.modetype === "sv" || prop.modetype === "gp"
        ? `${prop.apiurl}`
        : `http://src.netminer.com:8088${prop.apiurl}`.concat("/mongo"),
    data: modelscript,
  };
  //if (modelscript) config1.data = modelscript;
  let config = {
    method: "post",
    url: `${currentsetting.webserviceprefix}micro`,
    data: config1,
  };

  const modelresult = new Promise((resolve, reject) => {
    axios(config)
      .then((rsp) => {
        const results = rsp.data;
        console.log("results: ", results);
        resolve(results);
      })
      .catch((e) => {
        message.error("error happened! ");
        console.log(e);
        //dispatch(globalVariable({ showSpin: false }));
      });
  });
  const datasetfind = new Promise((resolve, reject) => {
    let nodesetid;
    if (data && data.simplebundle)
      nodesetid = data.simplebundle.nodeset[0]["pid"];
    if (nodesetid)
      axios
        .get(`${currentsetting.webserviceprefix}dataset/${nodesetid}`)
        .then((rsp) => {
          resolve(rsp.data);
        });
    else resolve([]);
  });
  return Promise.all([modelresult, datasetfind]).then((result) => {
    const result0 = makeupResults(result[0], dataset?.node);
    //const result0 = makeupResults(testdt, dataset.node);
    const datasetinfo = result[1];
    let author;
    if (datasetinfo.length > 0) {
      data.simplebundle.dataset = datasetinfo;
      setting.properties.origindata = data.simplebundle;
    }
    setting.properties.results = result0[0];
    setting.properties.colArr = result0[1];
    // if (data.modelfile) setting.properties.senddata = data.modelfile;
    if (modelscript) setting.properties.modelscript = modelscript;
    author = setting?.properties?.resultsAuthor;
    if (!author) {
      setting.properties.resultsAuthor = [];
      author = setting.properties.resultsAuthor;
    }
    setting.properties.resultsAuthor.map((k, i) => {
      if (k.results && k.node) {
        k.dtlist = result0[0][k.results][k.node];
        setting.properties.resultsAuthor.splice(i, 1, k);
      }
      return null;
    });

    setting.newrun = true;
    return setting;
  });

  return null;
};

export default ModelRun;
