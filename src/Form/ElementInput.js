import React, { useState, useEffect, useMemo } from "react";
import { cloneDeep } from "lodash";
import $ from "jquery";
import "jquery-ui-bundle";
import "jquery-ui-bundle/jquery-ui.min.css";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import "antd/dist/antd.css";
import { Button, Tooltip, Form } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import PageHead from "components/Common/PageHeader";
import AntFormDisplay from "Form/AntFormDisplay";
import Popup from "components/Common/Popup";
import Swal from "sweetalert2";

const ElementInput = (props) => {
  const dispatch = useDispatch();
  let elementData = useSelector((state) => state.global.elementData);
  let currentData = useSelector((state) => state.global.currentData);

  const [name, setName] = useState("");
  //const [initialdbOption, setInitialdbOption] = useState(elementData.dboption);
  const [setupData, setSetupData] = useState();
  let [form] = Form.useForm();

  let btnList = [
    {
      label: "Type",
      name: "type",
      type: "select",
      optionArray: [
        { text: "ss", value: "ss" },
        { text: "ss2", value: "ss1" },
      ],
      seq: 0,
    },
    {
      label: "Action",
      name: "action",
      type: "select",
      optionArray: [
        { text: "submit", value: "submit" },
        { text: "cancel", value: "cancel" },
        { text: "custom", value: "custom" },
      ],
      onChange: (val) => {
        setName(val);
      },
      seq: 1,
    },
    {
      label: "Name",
      name: "name",
      type: "input",
      seq: 2,
    },
    {
      label: "Label",
      name: "label",
      type: "input",
      defaultValue: { name },
      seq: 3,
    },
    {
      label: "Style",
      name: "btnStyle",
      type: "select",
      optionArray: [
        { text: <Button type="secondary">Line</Button>, value: "primary" },
        {
          text: <Button type="dashed">Dashed</Button>,
          value: "dashed",
        },
        { text: <Button type="text">Text</Button>, value: "text" },
        { text: <Button type="link">Link</Button>, value: "link" },
      ],
      defaultValue: "primary",
      seq: 4,
    },
    {
      label: "Color",
      name: "btnColor",
      type: "select",
      optionArray: [
        { text: <Button type="primary">primary</Button>, value: "primary" },
        {
          text: <Button>secondary</Button>,
          value: "secondary",
        },
        {
          text: <Button danger>danger</Button>,
          value: "danger",
        },
      ],
      defaultValue: "primary",
      seq: 5,
    },
    {
      label: "onClick/action",
      name: "onClick",
      type: "input.textarea",
      rows: 4,
      seq: 6,
    },
    {
      label: "Align",
      name: "align",
      type: "radio.button",
      optionArray: [
        { text: "Left", value: "left" },
        {
          text: "Right",
          value: "right",
        },
      ],
      defaultValue: "left",
      seq: 7,
    },
    { label: "Hide", name: "hide", type: "checkbox", seq: 8 },
    { label: "Block", name: "block", type: "checkbox", seq: 9 },
  ];
  const onFinishElement = (val) => {
    console.log("onFinishElement", val);
  };

  const curr = useMemo(() => {
    let curr = cloneDeep(currentData);
    let eleData = elementData;
    curr.data.list = [eleData];
    curr.data.setting = currentData.data.setting;
    const lbl = localStorage.getItem("esetup_label");
    if (lbl) {
      $("#esetup_label").val(lbl);
      localStorage.removeItem("esetup_label");
    }

    return curr.data;
  }, [elementData]);

  useEffect(() => {
    dispatch(
      globalVariable({
        helpLink: "/admin/control/form/formedit?type=elementedit",
      })
    );
    setTimeout(() => {
      $("#esetup_name, #esetup_action").on("keyup change", function (e) {
        e.preventDefault();
        const upc =
          e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
        $("#esetup_label").val(upc);
        localStorage.setItem("esetup_label", upc);
      });
      $("#esetup_label").on("click keyup change", function (e) {
        e.preventDefault();
        localStorage.setItem("esetup_label", e.target.value);
      });
    }, 500);
  }, []);
  const [instantView, setInstantView] = useState({ ...curr });

  const summaryData = (eldt) => {
    let rule = [],
      eleData = elementData;
    if (eldt) eleData = eldt;
    if (eleData.rules && eleData.rules.length > 0) rule = eleData.rules[0];
    //nostyle setting
    let ratio = eleData.ratio;
    if (!ratio && eleData.array) {
      ratio = [0];
      eleData.array.map((k, i) => {
        if (i < eleData.array.length - 1) ratio.push(parseFloat(k.width));
        return null;
      });
      ratio.push(100);
    }

    const summaryData1 = {
      setting: {
        formItemLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        },
        layout: "horizontal",
        formColumn: 2,
        size: "middle",
        lineheight: "small",
        initialValues: eleData,
        onValuesChange: (changedValues, allValues) => {
          let requireobj = {},
            instantlist,
            instant = instantView.list[0];
          const obj = Object.keys(changedValues)[0];
          if (obj === "required") {
            requireobj = { required: changedValues[obj] };
            if (
              allValues["requiredmsg"] !== "undefined" &&
              allValues["requiredmsg"] !== ""
            )
              requireobj = {
                ...requireobj,
                message: allValues["requiredmsg"],
              };

            instantlist = { ...instant, rules: [requireobj] };
            instantView.list = [instantlist];
          } else {
            instantlist = { ...instant, ...changedValues };
            instantView.list = [instantlist];
          }
          setInstantView(instantView);
          if (setupData) {
            const setupinitialValues = {
              ...setupData.setting.initialValues,
              ...changedValues,
            };
            setupData.setting.initialValues = setupinitialValues;
            setSetupData(setupData);
          }
        },

        onFinish: (values) => {
          onFinishElement(values);
        },
        onFinishFailed: (values, errorFields, outOfDate) => {
          console.log(values, errorFields, outOfDate);
        },
      },
      list: [
        {
          label: "Type",
          name: "type",
          type: "select",
          placeholder: "select type",
          optionArray: [
            { text: "input", value: "input" },
            { text: "input.password", value: "input.password" },
            { text: "input.textarea", value: "input.textarea" },
            { text: "input.number", value: "input.number" },
            { text: "input.color", value: "input.color" },
            { text: "input.sketcher", value: "input.sketcher" },
            { text: "select", value: "select" },
            { text: "select.multiple", value: "select.multiple" },
            { text: "radio.group", value: "radio.group" },
            { text: "checkbox.group", value: "checkbox.group" },
            { text: "datepicker", value: "datepicker" },
            { text: "datetimepicker", value: "datetimepicker" },
            { text: "monthpicker", value: "monthpicker" },
            { text: "rangepicker", value: "rangepicker" },
            { text: "timepicker", value: "timepicker" },
            { text: "checkbox", value: "checkbox" },
            { text: "switch", value: "switch" },
            { text: "slider", value: "slider" },
            { text: "rate", value: "rate" },
            { text: "button", value: "button" },
          ],
          //onChange: onChangeType,
          seq: 0,
        },
        { label: "Name", name: "name", type: "input", seq: 1 },
        {
          label: "Label",
          name: "label",
          type: "input",
          dependencies: ["name"],
          seq: 2,
        },
        { label: "Placeholder", name: "placeholder", type: "input", seq: 3 },
        { label: "DefaultValue", name: "defaultValue", type: "input", seq: 4 },
        { label: "Bottom msg", name: "msglow", type: "input", seq: 5 },
        { label: "Right msg", name: "msgright", type: "input", seq: 6 },
        { label: "Top msg", name: "msgtop", type: "input", seq: 7 },

        {
          label: "Tooltip",
          type: "input",
          name: "tooltipmsg",
          placeholder: "write tooltip message",
          seq: 8,
        },
        {
          label: "Required",
          type: "nostyle",

          array: [
            {
              label: "Required",
              name: "required",
              type: "checkbox",
              width: "15%",
              seq: 0,
            },
            {
              name: "requiredmsg",
              type: "input",
              seq: 1,
              width: "85%",
              defaultValue: "is required",
              placeholder: "write error message!",
            },
          ],
          seq: 9,
        },
        {
          label: "Right Button",
          type: "checkbox",
          name: "btnright",
          seq: 10,
        },
        {
          name: "btntitle",
          shouldupdate: true,
          shouldfield: "btnright",
          shouldvalue: true,
          seq: 11,
          type: "nostyle",
          array: [
            {
              label: "Title/Icon",
              name: "iconbtn",
              type: "checkbox",
              width: "15%",
              seq: 0,
            },
            {
              name: "btntitle",
              type: "input",
              seq: 1,
              width: "85%",
              placeholder: "iconname or title!",
            },
          ],
        },
        // {
        //   label: "Button Title",
        //   addonBefore: { prefixTitle },
        //   name: "btntitle",
        //   shouldupdate: true,
        //   shouldfield: "btnright",
        //   shouldvalue: true,
        //   type: "input",
        //   seq: 11,
        // },
        {
          label: "BtnTooltip",
          name: "btntooltip",
          shouldupdate: true,
          shouldfield: "btnright",
          shouldvalue: true,
          type: "input",
          seq: 12,
        },

        {
          label: "Click Event",
          name: "btnevent",
          shouldupdate: true,
          shouldfield: "btnright",
          shouldvalue: true,
          type: "input",
          seq: 13,
        },
        {
          label: "Condtional",
          type: "checkbox",
          name: "shouldupdate",
          seq: 14,
        },

        {
          label: "CondField",
          shouldupdate: true,
          shouldfield: "shouldupdate",
          shouldvalue: true,
          type: "input",
          name: "shouldfield",
          placeholder: "field for condition",
          seq: 15,
        },
        {
          label: "CondValue",
          shouldupdate: true,
          shouldfield: "shouldupdate",
          shouldvalue: true,
          type: "input",
          name: "shouldvalue",
          placeholder: "values to show",
          seq: 16,
        },
      ],
    };
    return summaryData1;
  };

  const summaryListbyType = (summaryData, type) => {
    switch (type) {
      default:
        return;
      case "select":
      case "select.multiple":
      case "radio.button":
      case "radio.group":
      case "checkbox.group":
        const optarr = {
          label: "optionArray",
          alllabel: true,
          type: "nostyle",
          shouldupdate: true,
          shouldfield: "type",
          shouldvalue:
            "select,select.multiple,radio.button,radio.group,checkbox.group",
          array: [
            {
              name: "optionArray",
              // tooltipmsg: "setting database for option value",
              type: "input",
              width: "80%",
              seq: 0,
            },
            {
              type: "icon",
              iconname: "question-circle",
              seq: 1,
              width: "20%",
              onClick: (e) => {
                e.preventDefault();
                Swal.fire({
                  icon: "info",
                  title: "Option Guide",
                  html:
                    "<b>Simple:</b> korea;japan;usa(value;) \n" +
                    "<b>Advance:</b>1,korea;2,japan;3,usa(value,text;) \n" +
                    "<b>Group:</b>1,korea,asia;2,japan,asia;3,usa,america(value,text,group;)",
                });

                $(".swal2-container").css({ "z-index": 100000 });
                //dispatch(globalVariable({ openDialog2: !openDialog2 }));
              },
            },
          ],
          seq: 3,
        };

        summaryData.list.splice(3, 0, optarr);
        summaryData.list.map((k, i) => {
          k.seq = i;
          return null;
        });
        let optsplit = "";

        if (
          elementData.optionArray &&
          elementData.optionArray.length > 0 &&
          typeof elementData.optionArray === "object"
        ) {
          elementData.optionArray.map((k, i) => {
            if (k.value === k.text) optsplit += k.value;
            else optsplit += k.value + "," + k.text;
            if (k.group) optsplit += "," + k.group + ";";
            else optsplit += ";";
            return null;
          });
        }
        if (optsplit !== "") optsplit = optsplit.slice(0, -1);

        summaryData.setting.initialValues = {
          ...summaryData.setting.initialValues,
          optionArray: optsplit,
        };

        // add button side by optionarray

        // add button at the bottom of select dropdown
        if (type.indexOf("select") > -1) {
          summaryData.list.splice(11, 1, {
            label: "Add Func",
            name: "dropdownRender",
            type: "checkbox",
            seq: 11,
          });
        }

        break;
      case "input.textarea":
        summaryData.list.splice(3, 1, {
          label: "minRows",
          name: "minRows",
          type: "input.number",
          seq: 3,
        });
        summaryData.list.splice(4, 1, {
          label: "MaxRows",
          name: "maxRows",
          type: "input.number",
          seq: 4,
        });
        break;
      case "button":
        summaryData.list = btnList;
        break;
      case "divider":
        summaryData.list.splice(2, 0, {
          label: "Position",
          name: "orientation",
          type: "radio.button",
          optionArray: [
            { value: "left", text: "left" },
            { value: "center", text: "center" },
            { value: "right", text: "right" },
          ],
          seq: 3,
        });
        [16, 15, 14, 9, 8, 7, 6, 5, 4].map((k) => {
          summaryData.list.splice(k, 1);
          return null;
        });
        summaryData.list.push({
          label: "Offset",
          name: "offset",
          type: "checkbox",
          seq: 3,
        });
        break;

      case "nostyle":
      case "form.list":
        const marks = {
          0: "0%",
          20: "20%",
          50: <strong>50%</strong>,
          80: "80%",
          100: "100%",
        };

        summaryData.list.splice(8, 0, {
          label: "Ratio",
          name: "ratio",
          type: "range",
          step: 2,
          dots: true,
          dotStyle: { borderColor: "grey" },
          // activeDotStyle: { borderColor: "orange" },
          marks: marks,
          // step: null,
          allowCross: false,
          defaultValue: summaryData.setting.initialValues.ratio,
          // onAfterChange: onAfterChange,
          pushable: true,
          seq: 9,
        });
        // [9, 4, 3, 1].map((k) => {
        //   summaryData.list.splice(k, 1);
        // });
        summaryData.list.push({
          label: "All Label",
          name: "alllabel",
          type: "checkbox",
          seq: 10,
        });
        summaryData.list.push({
          label: "Column Head",
          name: "colhead",
          type: "checkbox",
          seq: 10,
        });
        summaryData.list.push({
          label: "Offset",
          name: "offset",
          type: "checkbox",
          seq: 11,
        });

        summaryData.list.map((k, i) => {
          k.seq = i;
          return null;
        });
        break;
    }
    return summaryData;
  };
  useEffect(() => {
    const summaryInitial = summaryListbyType(summaryData(), elementData.type);
    setSetupData(summaryInitial);
  }, [currentData]);

  const SaveChange = () => {
    let view = instantView.list[0];
    let opt = view.optionArray;
    const lbl = localStorage.getItem("esetup_label");
    if (lbl) {
      view = { ...view, label: lbl };
    }
    if (typeof opt === "string") {
      let array = [];
      opt.split(";").map((k, i) => {
        let val = k,
          txt = k,
          grp;
        if (k.indexOf(",") > -1) {
          val = k.split(",")[0];
          txt = k.split(",")[1];
          grp = k.split(",")[2];
        }
        let row = { value: val, text: txt };
        if (grp) row = { ...row, group: grp };
        return array.push(row);
      });
      view.optionArray = array;
    }
    dispatch(globalVariable({ elementData: view }));

    let isExist = false;
    if (view.type === "nostyle") {
      let ro = view.ratio;
      if (!ro && view.array) {
        ro = [0];
        view.array.map((k, i) => {
          if (i < view.array.length - 1) ro.push(parseFloat(k.width));
          return null;
        });
        ro.push(100);
      }
      let newro = [];
      ro.map((k, i) => {
        if (i > 0) {
          newro.push(k - ro[i - 1]);
        }
        return null;
      });
      view.array.map((k, i) => {
        k.width = newro[i] + "%";
        return null;
      });
      //show/hide all label
      //view = labelShowhide([view], currentData.data.setting.layout)[0];
    }
    // if (view.type != "button")
    currentData.data.list.map((k, i) => {
      if (k.seq === view.seq) {
        isExist = true;
        return currentData.data.list.splice(i, 1, view);
      }
      return null;
    });
    if (!isExist) currentData.data.list.push(view);
    console.log(currentData);
    props.onUpdate(currentData.data);
    //dispatch(globalVariable({ currentData }));
  };

  const extra = [
    <Tooltip title="Save" key="1save">
      <Button
        shape="circle"
        icon={<SaveOutlined />}
        onClick={() => SaveChange(false)}
      />
    </Tooltip>,
  ];

  // const onFinishOption = (val) => {
  //   let newel = JSON.parse(JSON.stringify(elementData));
  //   let newinst = JSON.parse(JSON.stringify(instantView));
  //   newel.dboption = val; //JSON.stringify(val);
  //   newinst.list = [newel];
  //   setInstantView(newinst);
  //   setInitialdbOption(val);
  //   dispatch(globalVariable({ elementData: newel }));
  //   dispatch(globalVariable({ openDialog2: false }));
  // };
  return (
    <>
      <div className="site-page-header-ghost-wrapper">
        <PageHead title="Element Edit" extra={extra} ghost={false}>
          {setupData && (
            <AntFormDisplay formArray={setupData} form={form} name={"esetup"} />
          )}
        </PageHead>
      </div>
      <div style={{ marginRight: 30, marginLeft: 10 }}>
        <AntFormDisplay formArray={instantView} name={"instantview"} />
      </div>
      <div style={{ marginBottom: 5, textAlign: "right" }}>
        <Button
          onClick={() => {
            SaveChange(false);
            dispatch(globalVariable({ openDialog: false }));
            setTimeout(function () {
              if ($(".ant-modal-confirm-btns>button"))
                $(".ant-modal-confirm-btns>button").click();
            }, 500);
          }}
        >
          Apply
        </Button>

        {/* <Popup helpLink="/admin/control/form/formedit?type=dboption">
          <AntFormDisplay
            formid="5ea0e1a12c3b2808b4da0826"
            showtitle={true}
            initialValues={initialdbOption}
            onFinish={onFinishOption}
          />
        </Popup> */}
      </div>
    </>
  );
};

export default ElementInput;
