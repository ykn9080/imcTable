import { globalVariable } from "actions";
import { Spin, Switch, Tabs } from "antd";
import axios from "axios";
import AntFormDisplay from "Form/AntFormDisplay";
import AntFormDisplayMulti from "Form/AntFormDisplayMulti";
import { currentsetting } from "config/index.js";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { TabPane } = Tabs;

export const ruleset = [
  {
    type: "number-number",
    model: ["Regression Vector"],
    vector1: "dependentVector",
    vector2: "independentVectors",
  },
  {
    type: "number-text",
    model: ["Anova Vector"],
    vector1: "dependentVector",
    vector2: "independentVector",
  },
  {
    type: "number-text",
    model: ["k-means", "gmm", "pam"],
    vector1: "vectors",
    vector2: "partitionVector",
  },
  {
    type: "text-number",
    model: ["logistic regression"],
    vector1: "dependentVector",
    vector2: "independentVectors",
  },
  {
    type: "text-number",
    model: [
      "naive bayes",
      "discriminant analysis",
      "svms",
      "cart",
      "multilayer perceptron",
    ],
    vector1: "vector",
    vector2: "featureVectors",
  },
  {
    type: "all-all",
    model: ["Crosstabs Vector"],
    vector1: "rowVector",
    vecotr2: "columnVector",
  },
  {
    type: "multi-number",
    model: ["Correlation Vector", "hierarchical vector"],
    vector1: "vectors",
    vector2: "none",
  },
  {
    type: "all-all",
    model: ["MLP"],
    vector1: "independence",
    vector2: "dependence",
  },
  {
    type: "all-number",
    model: ["Linear Regression"],
    vector1: "independence",
    vector2: "dependence",
  },
  {
    type: "all-text",
    model: ["KNN", "Naive Bayes", "SVM", "CART", "Logistic Regression", "GCN"],
    vector1: "independence",
    vector2: "dependence",
  },
];

export const createPatchList = (objkeys, name) => {
  let plist = [],
    arr1 = [];
  if (!name) name = "replaceall";
  objkeys.map((k, i) => {
    if (name === "selectForm") arr1.push({ text: k.name, value: k._id });
    else arr1.push({ text: k, value: k });
    return null;
  });
  plist.push({ name, optionArray: arr1 });
  return plist;
};

export const vectorCreate = (vname, modelname) => {
  let ruletype;
  let plist;
  let vector;
  let vector1;
  let vector2;
  let vnameChk;
  let vnameChk1;
  let vnameChk2;

  ruleset.map((r) => {
    r.model.map((m) => {
      if (modelname === m) {
        ruletype = r.type;
        vector1 = r.vector1;
        vector2 = r.vector2;
      }
    });
  });

  switch (ruletype) {
    case "number-number":
      vnameChk1 = vname.vnameNumber;
      vnameChk2 = vname.vnameNumber;
      break;
    case "number-text":
      vnameChk1 = vname.vnameNumber;
      vnameChk2 = vname.vnameText;
      break;
    case "text-number":
      vnameChk1 = vname.vnameText;
      vnameChk2 = vname.vanmeNumber;
      break;
    case "all-all":
      vnameChk1 = vname.vnameAll;
      vnameChk2 = vname.vnameAll;
      break;
    case "multi-number":
      vnameChk = vname.vnameNumber;
      vector = "vectors";
      break;
    case "all-text":
      vnameChk1 = vname.vnameAll;
      vnameChk2 = vname.vnameText;
      break;
    case "all-number":
      vnameChk1 = vname.vnameAll;
      vnameChk2 = vname.vnameNumber;
      break;
    default:
      vnameChk = vname.vnameAll;
      vector = "vector";
      break;
  }

  if (vnameChk) {
    plist = createPatchList(vnameChk, vector);
  } else if (vnameChk1 && vnameChk2) {
    plist = createPatchList(vnameChk1, vector1);
    plist = plist.concat(createPatchList(vnameChk2, vector2));
  }

  return plist;
  // setSelectedItems(plist);

  // if (tempModel.properties.multiArr) {
  //   let changeMultiArr = tempModel.properties.multiArr.map((m, i) => {
  //     return {
  //       formid: m.formid,
  //       patchlist: plist,
  //       key: i,
  //     };
  //   });
  // tempModel.properties.multiArr = changeMultiArr;
  // let pro = { ...tempModel.properties, multiArr: changeMultiArr };
  // let newtempModel = { ...tempModel, properties: pro };
  // dispatch(globalVariable({ tempModel: newtempModel }));
};

export const stringParser = (str, obj) => {
  //convert a.b.c => {a:{b:"c"}}
  if (str === "") {
    return obj;
  }
  let st = str.split(".");
  if (st.length === 1 && !obj) return str;
  const key = st.pop();
  if (!obj) {
    const key1 = st.pop();
    obj = { [key1]: key };
  } else {
    obj = { [key]: obj };
  }
  return stringParser(st.join("."), obj);
};
export const mergeObject = (allValues, objarr) => {
  let j = objarr.length,
    newmerged,
    used = [];
  while (j > 0) {
    used.map((k) => {
      objarr.splice(k, 1);
      return null;
    });
    objarr.map((k, i) => {
      if (newmerged) {
        newmerged = _.merge(newmerged, k);
        used.push(i);
      } else {
        newmerged = { ...k };
        used.push(i);
      }
      return null;
    });
    j--;
    allValues = _.assign(allValues, newmerged);
  }
  return allValues;
};
export const makeParam = (allValues) => {
  if (!allValues) return false;
  let arr = [];
  let keyarr = Object.keys(allValues);
  let valarr = Object.values(allValues);
  let obj = { ...allValues };
  keyarr.map((key, i) => {
    //if key="a.b.c" convert to {a:{b:"c"}}
    if (key.split(".").length > 1) {
      const keyval = stringParser(key + "." + valarr[i]);
      arr.push(keyval);
      delete obj[key];
    } else if (key.split("_").length > 1) {
      const keyval = stringParser(key + "_" + valarr[i]);
      arr.push(keyval);
      delete obj[key];
    }
    return null;
  });
  console.log(_.cloneDeep(obj));
  obj = mergeObject(obj, arr);
  console.log(obj, arr);
  localStorage.removeItem("persist:root");
  localStorage.setItem("parameter", JSON.stringify(obj));
  return obj;
};
const ModelParameter = (props) => {
  //model setup summary
  const dispatch = useDispatch();
  let tempModel = useSelector((state) => state.global.tempModel);
  let paramvalue = useSelector((state) => state.global.paramvalue);
  const [initParameter, setInitParameter] = useState();
  const [tabkey, setTabkey] = useState();
  const [selectedItems, setSelectedItems] = useState(null);
  const [listItems, setListItems] = useState(null);
  const [multiArr, setMultiArr] = useState();
  const [paramtype, setParamtype] = useState(true);
  const [allForm, setAllForm] = useState();
  const [loading, setLoading] = useState(false);

  const onValuesChangeParam = (changedValues, allValues) => {
    if (props.onValuesChange) props.onValuesChange(allValues);
    makeParam(allValues);
    setInitParameter({ script: JSON.stringify(allValues, null, 4) });
  };

  useEffect(() => {
    getFormList(paramtype);
    vectorUpdate();
  }, [paramtype, paramvalue]);

  const getFormList = async (type) => {
    const filterForm = (fdata) => {
      let imsiData1 = [];
      fdata.map((k, i) => {
        return imsiData1.push({
          _id: k._id,
          name: k.name,
        });
      });
      const rtn = createPatchList(imsiData1, "selectForm");

      setListItems(rtn);
      setLoading(false);
    };
    if (!allForm) {
      setLoading(true);
      const formlist = await axios.get(
        `${currentsetting.webserviceprefix}bootform/`
      );
      setAllForm(formlist.data);
      filterForm(formlist.data);
    } else {
      if (type === true) filterForm(allForm);
      else {
        const fdata = _.filter(allForm, (o) => {
          return o?.data?.setting?.type && o.data.setting.type === "parameter";
        });
        filterForm(fdata);
      }
    }
  };

  const vectorUpdate = () => {
    const vname = tempModel?.properties?.linknode?.vname;
    if (!vname) return;
    const plist = vectorCreate(vname, tempModel.title);
    if (!plist) return;
    setSelectedItems(plist);

    if (tempModel.properties?.multiArr) {
      let changeMultiArr = tempModel.properties.multiArr.map((m, i) => {
        return {
          formid: m.formid,
          patchlist: plist,
          key: i,
        };
      });
      tempModel.properties.multiArr = changeMultiArr;
      dispatch(globalVariable({ tempModel }));
      // let pro = { ...tempModel.properties, multiArr: changeMultiArr };
      // let newtempModel = { ...tempModel, properties: pro };
      //dispatch(globalVariable({ tempModel: newtempModel }));
    }
  };
  const onParamTypeChange = (val) => {
    setParamtype(val);
  };
  const operations = !tempModel?.properties?.multiArr && (
    <Switch
      checkedChildren="All"
      unCheckedChildren="Parameter"
      defaultChecked
      onChange={onParamTypeChange}
    />
  );
  const onValuesChangeParamter = (changedValues, allValues) => {
    // const stxt = allValues.script;
    // const sobj = JSON.parse(allValues.script);
    makeParam(JSON.parse(allValues.script));
  };

  const onFormgetFinish = (val) => {
    let multiData = [];
    val.selectForm.map((v, i) => {
      return multiData.push({
        formid: v,
        patchlist: selectedItems,
        key: i,
      });
    });
    setMultiArr(multiData);
    let pro = { ...tempModel.properties, multiArr: multiData };
    let newtempModel = { ...tempModel, properties: pro };
    dispatch(globalVariable({ tempModel: newtempModel }));
  };
  return (
    <>
      <Tabs
        defaultActiveKey="1"
        onChange={(key) => {
          setTabkey(key);
        }}
        style={{ minHeight: 500 }}
        tabBarExtraContent={operations}
      >
        <TabPane tab="Form" key="1">
          {tempModel?.properties?.multiArr ? (
            <AntFormDisplayMulti
              multiArr={tempModel.properties.multiArr}
              editmode={props.editmode}
            />
          ) : (
            <>
              {listItems && (
                <AntFormDisplay
                  formid={tempModel.param}
                  patchlist={listItems}
                  onFinish={onFormgetFinish}
                  onValuesChange={onValuesChangeParam}
                />
              )}

              <Spin spinning={loading} />
            </>
          )}
        </TabPane>
        <TabPane tab="Script" key="2">
          <AntFormDisplay
            formid="5f7be94d85cd1730c8544018"
            onValuesChange={onValuesChangeParamter}
            initialValues={initParameter}
          />
        </TabPane>
      </Tabs>
    </>
  );
};

export default ModelParameter;
