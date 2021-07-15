import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { globalVariable } from "actions";
import axios from "axios";
import { currentsetting } from "config/index.js";

import AntFormDisplay from "Form/AntFormDisplay";
import { PageHeader } from "antd";
import { isEmptyObject } from "jquery";

const ModelEdit0 = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const forceUpdate = useForceUpdate();
  const [formdt, setFormdt] = useState(null);
  const [initval, setInitval] = useState();
  let currentStep = useSelector((state) => state.global.currentStep);
  let selectedKey = useSelector((state) => state.global.selectedKey);

  //if (!selectedKey) history.push("/model");
  let tempModel = useSelector((state) => state.global.tempModel);
  //let currentData = useSelector((state) => state.global.currentData);
  //set tempModel same with currentData

  useEffect(() => {
    //dispatch(globalVariable({ tempModel: currentData }));
    const formLoad = new Promise((resolve, reject) => {
      axios
        .get(
          `${currentsetting.webserviceprefix}bootform/5ef427e5deec0934442b9216`
        )
        .then((response) => {
          resolve(response.data);
        });
    });
    const modelLoad = new Promise((resolve, reject) => {
      if (tempModel) {
        resolve(tempModel);
      } else if (selectedKey)
        axios
          .get(`${currentsetting.webserviceprefix}model/${selectedKey}`)
          .then((response) => {
            resolve(response.data);
          });
      else resolve([]);
    });
    Promise.all([formLoad, modelLoad]).then((result) => {
      const farr = result[0];
      const arr = result[1];
      let type, model, multiple, modetype, multiArr;
      if (arr.properties) {
        type = arr.properties.type;
        model = arr.properties.model;
        multiple = arr.properties.multiple;
        modetype = arr.properties.modetype;
        multiArr = arr.properties.multiArr;
      }
      let obj = {
        title: arr.title,
        desc: arr.desc,
        type,
        model,
        multiple,
        modetype,
      };
      //if (farr.data) farr.data.setting.initialValues = obj;
      setInitval(obj);
      setFormdt(farr.data);
      dispatch(globalVariable({ tempModel: arr }));
    });
  }, []);

  const onFinish = (val) => {
    let val1 = {
      title: val.title,
      desc: val.desc,
    };
    let newtempModel;
    if (tempModel && !isEmptyObject(tempModel)) {
      tempModel.properties.modetype = val.modetype;
      tempModel.properties = { ...tempModel.properties, ...val };
      newtempModel = { ...tempModel, ...val1 };
    } else {
      newtempModel = {
        ...val1,
        properties: {
          type: val.type,
          model: val.model,
          multiple: val.multiple,
          modetype: val.modetype,
        },
      };
    }
    console.log(val, newtempModel);
    dispatch(globalVariable({ currentStep: currentStep + 1 }));
    dispatch(globalVariable({ tempModel: newtempModel }));
  };
  return (
    <div style={{ marginTop: 10, marginRight: 10 }}>
      <PageHeader className="site-page-header" title="Summary" />,
      {formdt && (
        <div style={{ marginLeft: 10 }}>
          <AntFormDisplay
            formArray={formdt}
            onFinish={onFinish}
            initialValues={initval}
          />
        </div>
      )}
    </div>
  );
};

export default ModelEdit0;
