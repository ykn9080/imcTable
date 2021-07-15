import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { useHistory } from "react-router-dom";
import axios from "axios";
import cloneDeep from "lodash/cloneDeep";
import { currentsetting } from "config/index.js";
import { Button, Tooltip, message } from "antd";
import { DesktopOutlined, SaveOutlined, CopyOutlined } from "@ant-design/icons";
import PageHead from "components/Common/PageHeader";
import AntFormBuild from "Form/AntFormBuild";
import AntFormDisplay from "Form/AntFormDisplay";

import "components/Common/Antd.css";
import useForceUpdate from "use-force-update";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const FormEdit = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const forceUpdate = useForceUpdate();
  let iconSpin = {},
    btnDisabled = {};

  //for snackbar open/close
  const [open, setOpen] = useState(false);
  const [fsummaryInit, setFsummaryInit] = useState();
  const [update, setUpdate] = useState(false);
  const [idcode, setIdcode] = useState();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  let formdt1 = {
    data: {
      setting: {
        formItemLayout: {
          labelCol: { span: 2 },
          wrapperCol: { span: 22 },
        },
        layout: "horizontal",
        formColumn: 1,
        type: "",
        size: "middle",
        lineheight: "middle",
      },
      list: [],
    },
  };

  let formdt = useSelector((state) => state.global.currentData);

  if (formdt === "") {
    formdt = formdt1;
    dispatch(globalVariable({ currentData: formdt }));
  }
  let selectedKey = useSelector((state) => state.global.selectedKey);
  if (!selectedKey) history.push("/admin/control/form");
  if (selectedKey === "imsi") selectedKey = "";
  //리로드 귀찮아서 해둰거 개발완료시 지울것!!!!!!!!!!!!!!!!!
  // if (formdt === "") {
  //   formdt = JSON.parse(localStorage.getItem("imsi"));
  //   dispatch(globalVariable({ currentData: formdt }));
  // }
  let initialValue = {};

  let summaryData = {
    setting: {
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      layout: "horizontal",
      type: "embed",
      formColumn: 2,
      size: "middle",
      lineheight: "middle",
      initialValues: {
        ...{ initialValue },
      },
      // onFieldsChange: (changedFields, allFields) => {
      //   const cf1 = changedFields[0];
      //   if (["title", "desc"].indexOf(cf1.name[0]) === -1) {
      //     formdt[cf1.name[0]] = cf1.value;
      //     dispatch(globalVariable({ currentData: formdt }));
      //     console.log("field", changedFields, allFields);
      //   }
      // },
      onValuesChange: (changedValues, allValues) => {
        formdt.name = allValues.name;
        formdt.desc = allValues.desc;
        let sett = formdt.data.setting;
        sett.formItemLayout.labelCol.span = allValues.labelwidth;
        sett.formItemLayout.wrapperCol.span = 24 - allValues.labelwidth;
        sett.type = allValues.type;
        sett.formColumn = allValues.column;
        sett.layout = allValues.layout;
        sett.size = allValues.size;
        sett.lineheight = allValues.lineheight;
        dispatch(globalVariable({ currentData: formdt }));
        if (["name", "desc"].indexOf(Object.keys(changedValues)[0]) === -1)
          forceUpdate();
      },
      onFinish: (values) => {
        console.log("Received values of form: ", values);
      },
      onFinishFailed: (values, errorFields, outOfDate) => {
        console.log(values, errorFields, outOfDate);
      },
    },

    list: [
      { label: "Id", name: "id", type: "input", seq: -1, disabled: true },
      { label: "Title", name: "name", type: "input", seq: 0 },
      {
        label: "Desc",
        name: "desc",
        type: "input.textarea",
        seq: 1,
      },
      {
        label: "Type",
        name: "type",
        type: "select",
        defaultValue: 1,
        optionArray: [
          { text: "Embed", value: "embed" },
          { text: "Paramter", value: "parameter" },
          { text: "Type1", value: "type1" },
          { text: "Type2", value: "type2" },
          { text: "Others", value: "others" },
        ],
        seq: 2,
      },
      {
        label: "Column",
        name: "column",
        type: "select",
        defaultValue: 1,
        optionArray: [
          { text: "1", value: 1 },
          { text: "2", value: 2 },
          { text: "3", value: 3 },
        ],
        seq: 3,
      },
      {
        label: "Layout",
        name: "layout",
        type: "radio.button",
        defaultValue: "horizontal",
        optionArray: [
          { text: "horizontal", value: "horizontal" },
          { text: "vertical", value: "vertical" },
          { text: "inline", value: "inline" },
        ],
        seq: 4,
      },
      {
        label: "Label Width",
        name: "labelwidth",
        type: "slider",
        min: 0,
        max: 24,
        defaultValue: 6,
        marks: {
          0: 0,
          2: 2,
          4: 4,
          6: 6,
          8: 8,
          10: 10,
          12: 12,
          14: 14,
          16: 16,
          18: 18,
          20: 20,
          22: 22,
          24: 24,
        },
        seq: 5,
      },
      {
        label: "Size",
        name: "size",
        type: "radio.button",
        defaultValue: "middle",
        optionArray: [
          { text: "small", value: "small" },
          { text: "middle", value: "middle" },
          { text: "large", value: "large" },
        ],
        seq: 6,
      },
      {
        label: "LineHeight",
        name: "lineheight",
        type: "radio.button",
        defaultValue: "middle",
        optionArray: [
          { text: "small", value: "small" },
          { text: "middle", value: "middle" },
          { text: "large", value: "large" },
        ],
        seq: 7,
      },
    ],
  };

  let updateInitialValues = (summaryData, formdt) => {
    const initialValue = {
      id: formdt._id,
      name: formdt.name,
      desc: formdt.desc,
      type: formdt.data.setting.type,
      column: formdt.data.setting.formColumn,
      labelwidth: formdt.data.setting.formItemLayout.labelCol.span,
      layout: formdt.data.setting.layout,
      size: formdt.data.setting.size,
      lineheight: formdt.data.setting.lineheight,
    };

    summaryData.setting.initialValues = initialValue;
    return summaryData;
  };
  if (formdt !== "") {
    summaryData = updateInitialValues(summaryData, formdt);
  }
  const [sumdt, setSumdt] = useState(summaryData);

  useEffect(() => {
    dispatch(globalVariable({ formEdit: true }));
    //temporary use for editing phase only for
    //initialValue setting, pls delete when save
    formdt.data.setting = {
      ...formdt.data.setting,
      onValuesChange: (changedValues, allValues) => {
        formdt.data.setting.initialValues = {
          ...formdt.data.setting.initialValues,
          ...changedValues,
        };
        dispatch(globalVariable({ currentData: formdt }));
      },
    };

    setSumdt(updateInitialValues(sumdt, formdt));
    if (formdt._id) setUpdate(true);
  }, [formdt]);

  if (typeof formdt._id === "undefined") {
    // iconSpin = { spin: true };
    btnDisabled = { disabled: true };
  }
  const cleanuplist = (list) => {
    const deletetrash = (k) => {
      let kk = { ...k };
      delete kk.formColumn;
      delete kk.layout;
      delete kk.formItemLayout;
      delete kk.tailLayout;
      delete kk.editable;
      return kk;
    };
    list.map((k, i) => {
      let kk = { ...k };
      if (k.type === "nostyle")
        kk.array.map((a, b) => {
          let newa = deletetrash(a);
          kk.array.splice(b, 1, newa);
          return null;
        });
      kk = deletetrash(kk);
      list.splice(i, 1, kk);
      return null;
    });
    return list;
  };
  const extra = [
    <Tooltip title="Save" key="1save">
      <Button
        shape="circle"
        icon={<SaveOutlined {...iconSpin} />}
        onClick={() => {
          message.config({
            top: 100,
            duration: 3,
            maxCount: 3,
            rtl: true,
          });
          // //remove onValuesChange
          //inorderto set initialValues, append onValuesChange eventhandler
          //must remove onValuesChange when to save to database
          delete formdt.data.setting.onValuesChange;
          //cleanup list
          const list = cleanuplist(formdt.data.list);
          formdt.data.list = list;
          formdt.type = "form";
          let formid = formdt._id;
          if (idcode) formid = idcode;
          let config;
          config = {
            method: "put",
            url: `${currentsetting.webserviceprefix}bootform/${formid}`,
            data: formdt,
          };

          //fsummaryInit ? (config = configput) : (config = configpost);
          //   ?
          //   : {
          //       method: "post",
          //       url: `${currentsetting.webserviceprefix}bootform`,
          //       data: formdt,
          //     };
          if (typeof formdt._id === "undefined" && update === false)
            config = {
              ...config,
              ...{
                method: "post",
                url: `${currentsetting.webserviceprefix}bootform`,
              },
            };
          axios(config).then((r) => {
            const dt = r.data;
            if (config.method === "post" && update === false) {
              setFsummaryInit({
                id: dt._id,
                name: dt.name,
                desc: dt.desc,
                column: dt.data.setting?.formColumn,
                layout: dt.data.setting?.layout,
                labelwidth: dt.data.setting.formItemLayout.labelCol.span,
                size: dt.data.setting?.size,
                lineheight: dt.data.setting?.lineheight,
              });
              setUpdate(true);
              setIdcode(dt._id);
              // history.push("/open/blank");
            }
            message.info("File Saved");
          });
        }}
      />
    </Tooltip>,
    <Tooltip title="Save As" key="1saveas">
      <Button
        {...btnDisabled}
        shape="circle"
        icon={<CopyOutlined />}
        onClick={() => {
          //remove onValuesChange
          let curr = cloneDeep(formdt);
          delete curr.data.setting.onValuesChange;
          delete curr._id;

          curr.name += " Copy";
          sumdt.setting.initialValues.name += " Copy";
          curr.data.setting.initialValues = sumdt.setting.initialValues;

          setOpen(true);
          dispatch(globalVariable({ currentData: curr }));
        }}
      />
    </Tooltip>,
    <Tooltip title="View" key="2view">
      <Button
        {...btnDisabled}
        shape="circle"
        icon={<DesktopOutlined />}
        onClick={() => history.push("/admin/control/form/formview")}
      />
    </Tooltip>,
  ];
  const SaveAsCancel = () => {
    formdt._id = selectedKey;
    formdt.name = formdt.name.replace(" Copy", "");
    dispatch(globalVariable({ currentData: formdt }));
    setOpen(false);
  };

  const snack = (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={open}
      autoHideDuration={10000}
      onClose={handleClose}
      message="Click save button to finish!!!"
      action={
        <React.Fragment>
          <Button color="secondary" size="small" onClick={SaveAsCancel}>
            Undo
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    >
      {/* <Alert onClose={handleClose} severity="warning">
        Click save button to finish!!!
      </Alert> */}
    </Snackbar>
  );
  const onReload = () => {
    history.push("/admin/control/form/formview?rtn=formEdit");
  };
  return (
    <>
      <div className="site-page-header-ghost-wrapper">
        <PageHead title="FormEdit" onBack={true} extra={extra} ghost={false}>
          <AntFormDisplay
            formArray={sumdt}
            name={"fsummary"}
            //initialValues={fsummaryInit}
          />
        </PageHead>
      </div>
      <div style={{ margin: 10 }}>
        <AntFormBuild formdt={formdt} reload={onReload} />
      </div>
      <Button onClick={() => console.log(update)}>update</Button>
      {snack}
    </>
  );
};

export default FormEdit;
