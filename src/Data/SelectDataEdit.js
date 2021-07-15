import { globalVariable } from "actions";
import { Button, message } from "antd";
import axios from "axios";
import AntFormDisplay from "Form/AntFormDisplay";
import { currentsetting } from "config/index.js";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SelectDataEdit = (props) => {
  const dispatch = useDispatch();
  const [formdt, setFormdt] = useState(null);
  const [editdt, setEditdt] = useState();
  let selecedLoad = useSelector((state) => state.global.selecedLoad);

  useEffect(() => {
    const formLoad = new Promise((resolve, reject) => {
      axios
        .get(
          `${currentsetting.webserviceprefix}bootform/5f4309629461621a00fbe00f`
        )
        .then((response) => {
          resolve(response.data);
        });
    });
    Promise.all([formLoad]).then((result) => {
      const farr = result[0];
      const data = props.data;

      let obj = {
        id: data.ID,
        title: data.Title,
        desc: data.Desc,
      };
      if (farr.data) farr.data.setting.initialValues = obj;
      setFormdt(farr.data);
      setEditdt(obj);
      dispatch(globalVariable({ selecedLoad: false }));
    });
  }, [selecedLoad]);

  const onSummaryChange = (changedValues, allValues) => {
    localStorage.removeItem("persist.root");
    localStorage.setItem("datasummray", JSON.stringify(allValues));
  };

  const onFinish = () => {
    let inputData = localStorage.getItem("datasummray");
    let val;
    if (inputData) {
      inputData = JSON.parse(inputData);
      val = {
        title: inputData.title,
        desc: inputData.desc,
      };
    }

    let newEditData = { ...editdt, ...val };
    localStorage.removeItem("datasummray");

    if (newEditData === "") {
      message.error("Incomplete data.");
      return false;
    }

    let method = "post",
      id = "";
    if (newEditData.hasOwnProperty("id")) {
      method = "put";
      id = newEditData.id;
    }

    let urlType = props.data.Type;
    let config = {
      method: method,
      url: `${currentsetting.webserviceprefix}${urlType}/${id}`,
      data: newEditData,
    };
    setTimeout(() => {
      axios(config).then((r) => {
        message.success("File successfully saved");
        if (props.editSummary) props.editSummary(newEditData);
      });
    }, 500);
    dispatch(globalVariable({ visibleEdit: false }));
  };

  return (
    <div style={{ marginTop: 10, marginRight: 10 }}>
      {formdt && (
        <div style={{ marginLeft: 10 }}>
          <AntFormDisplay
            formArray={formdt}
            //formid="5f4309629461621a00fbe00f"
            onValuesChange={onSummaryChange}
            buttonhide={true}
            changedInitial={true}
          />
          <div style={{ textAlign: "right", marginTop: 5 }}>
            <Button onClick={onFinish}>Save</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectDataEdit;
