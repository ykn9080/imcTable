import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import $ from "jquery";
import _ from "lodash";
import "antd/dist/antd.css";
import "components/Common/Antd.css";
import axios from "axios";
import { currentsetting } from "config/index.js";
import { Form, Row, Typography, Spin } from "antd";
import AntFormElement from "./AntFormElement";
import { makeBtnArray } from "./AntFormDbOption";
import { localHandle } from "components/functions/LodashUtil";

const { Title, Paragraph } = Typography;

export const labelShowhide = (list, layout) => {
  let nostylelist = _.filter(list, (o) => {
    return o.type === "nostyle";
  });

  nostylelist.map((k, i) => {
    let kk = { ...k };
    if (kk.alllabel === true) {
      //nostyle x, arr o
      //nostyle o, arr[0] x
      if (kk.offset === true) {
        kk.array.map((a, i) => {
          let aa = { ...a };
          if (!a.label) {
            if (a.label1) aa.label = a.label1;
            else if (kk.label) aa.label = kk.label;
            else aa.label = kk.label1;
            kk.array.splice(i, 1, aa);
          }
          return null;
        });
        if (kk.label) kk.label1 = kk.label;
        else kk.label1 = kk.array[0].label;
        delete kk.label;
      } else
        switch (layout) {
          case "horizontal":
            if (!kk.label) {
              kk.label = kk.array[0].label;
              kk.label1 = kk.array[0].label;
            }
            kk.array.map((a, i) => {
              let aa = { ...a };
              if (a.label1 && !a.label) {
                aa.label = a.label1;
                kk.array.splice(i, 1, aa);
              }
              return null;
            });
            kk.array[0].label1 = kk.array[0].label;
            delete kk.array[0].label;
            break;
          default:
            let firstlbl;
            if (kk.label) firstlbl = kk.label;
            else if (kk.label1) firstlbl = kk.label1;
            kk.array.map((a, i) => {
              let aa = { ...a };
              if (!a.label && a.label1) {
                aa.label = a.label1;
                kk.array.splice(i, 1, aa);
              }
              return null;
            });
            kk.label1 = firstlbl;
            delete kk.label;
            break;
        }
    } else {
      //nostyle o, arr x
      if (kk.label1) kk.label = kk.label1;
      else if (kk.array[0].label1) kk.label = kk.array[0].label1;
      else if (kk.array[0].label) kk.label = kk.array[0].label;
      kk.array.map((a, i) => {
        let aa = { ...a };
        if (!a.label1 && a.label) {
          aa.label1 = a.label;
        }
        delete aa.label;
        kk.array.splice(i, 1, aa);
        return null;
      });
    }
    nostylelist.splice(i, 1, kk);
    return null;
  });
  list.map((k, i) => {
    nostylelist.map((a, b) => {
      if (a.seq === k.seq) list.splice(i, 1, a);
      return null;
    });
    return null;
  });
  return list;
};
const boolParse = (myString) => {
  if (!myString) return;
  if (["true", "false"].indexOf(myString) === -1) return myString;
  else return myString === "true";
};
const optionParse = (row, val) => {
  if (!row.optionArray) {
    return humanParse(val);
  } else {
    const rtn = _.find(row.optionArray, (o) => {
      return o.value === val;
    });
    return rtn?.text;
  }
};
const humanParse = (val) => {
  switch (val) {
    case "true":
    case true:
      return "Yes";
    case "false":
    case false:
      return "No";
    default:
      return val;
  }
};
const findShouldRow = (list, name) => {
  const shouldrow = _.find(list, (o) => {
    return o.name === name;
  });
  return shouldrow;
};
export const shouldConditionFilter = (list, savedValue) => {
  //filter saveValue based on
  list.map((k, i) => {
    if (k.shouldfield) {
      const row = findShouldRow(list, k.shouldfield);

      if (!(savedValue?.[row?.name] && savedValue[row.name] === true)) {
        delete savedValue[k.name];
      }
    }
    return null;
  });
  return savedValue;
};

export const replaceListbyInitValues = (list, changedInitVals) => {
  list.map((k, i) => {
    const val = changedInitVals?.[k.name];
    if (typeof val !== "undefined") {
      k = { ...k, defaultValue: val };
      list.splice(i, 1, k);
    }
    return;
  });
  return list;
};
export const createInitValuesWithDefault = (list, changedInitVals) => {
  let newinitVal = {},
    newinitLabel,
    defVal;
  if (!list) return;
  list.map((k, i) => {
    defVal = k.defaultValue;
    if (typeof changedInitVals !== "undefined") {
      defVal = changedInitVals?.[k.name];
    }
    if (typeof defVal !== "undefined") {
      if (k.type === "form.list") {
        let outList = [],
          outlabelList = [],
          defList = [],
          nameList = [],
          labelList = [];

        defList = defVal.split(";");
        if (k.array) {
          k.array.map((s, j) => {
            nameList.push(s.name);
            labelList.push(s.label);
            return null;
          });
        }
        defList.map((s, j) => {
          let obj = {},
            lobj = {};
          const valarr = s.split(",");
          nameList.map((q, z) => {
            obj = { ...obj, [q]: boolParse(valarr[z]) };
            return null;
          });
          labelList.map((q, z) => {
            lobj = { ...lobj, [q]: optionParse(k, valarr[z]) };
            return null;
          });
          outList.push(obj);
          outlabelList.push(lobj);
          return null;
        });
        newinitVal = { "": outList };
        newinitLabel = { "": outlabelList };
      } else {
        let lbl = optionParse(k, defVal);
        const val = boolParse(defVal);
        if (!lbl) lbl = val;
        k = { ...k, defaultValue: val };
        list.splice(i, 1, k);
        newinitVal = { ...newinitVal, [k.name]: val };
        newinitLabel = {
          ...newinitLabel,
          [k.label]: lbl,
        };
      }
      //}
    }
    if (k.type === "nostyle" && k.array && k.array.length > 0) {
      k.array.map((a, b) => {
        defVal = a.defaultValue;
        if (changedInitVals) defVal = changedInitVals[a.name];
        if (defVal) {
          a.defaultValue = boolParse(defVal);
          newinitVal = {
            ...newinitVal,
            [a.name]: a.type === "input.number" ? defVal : boolParse(defVal),
          };
          newinitLabel = {
            ...newinitLabel,
            [a.label || a.label1]: optionParse(a, defVal),
          };
        }
        return null;
      });
      list.splice(i, 1, k);
    }
    return null;
  });
  let param = localHandle("onFinish");
  if (!param) param = {};
  localHandle("onFinish", { ...param, ...newinitVal });
  return { name: newinitVal, label: newinitLabel, list };
};

/**
 * shouldupdate===true인 field의 child row를
 * @param {Object} list form.data.list
 * @param {Object} k  each row of list
 * @returns {Object} if false return null if true return k
 */
export const shouldUpdateCheck = (list, k) => {
  if (!k.shouldupdate) return k;
  const shouldParent = _.find(list, (o) => {
    return o.name === k.shouldfield;
  });
  if (shouldParent.defaultValue === k.shouldvalue) return k;
  else return null;
};
const AntFormDisplay = (props) => {
  let showall = useSelector((state) => state.global.showall); //edit
  const [formArray, setFormArray] = useState();
  const [formSummary, setFormSummary] = useState(null);
  const [loading] = useState(false);
  const [fset, setFset] = useState();
  const [list, setList] = useState();
  const [othersetting, setOthersetting] = useState({});
  let [form] = Form.useForm();
  if (props.form) {
    form = props.form;
  }
  useEffect(() => {
    if (props.changedInitial) {
      form.setFieldsValue(props?.formArray?.setting?.initialValues);
    }
    if (formArray) {
      const lh = formArray.setting.lineheight;
      lineHeightSetting(lh);
    }
  });

  useEffect(() => {
    if (props.changedInitial) {
      form.setFieldsValue(props?.formArray?.setting?.initialValues);
    }
  }, [props?.formArray?.setting?.initialValues]);

  useEffect(() => {
    form.resetFields();
    setTimeout(() => {
      if (props.formArray) {
        const lh = props.formArray.setting.lineheight;
        lineHeightSetting(lh);
      } else lineHeightSetting("small");
    }, [0]);
  }, [props.initialValues]);

  useEffect(() => {
    if (props.formArray) {
      makeFormArray(props.formArray);
      setFormArray(props.formArray);
    }
    //execute when dboption applied
    else if (props.formid)
      axios
        .get(`${currentsetting.webserviceprefix}bootform/${props.formid}`)
        .then((response) => {
          settingup(response.data);
        });
  }, [props.formid, props.formArray, props.patchlist, props.initialValues]);

  const lineHeightSetting = (lh) => {
    let ht = 10;
    switch (lh) {
      case "small":
        ht = 5;
        break;
      case "large":
        ht = 25;
        break;
      default:
        break;
    }

    if ($(".ant-row.ant-form-item"))
      $(".ant-row.ant-form-item").css("margin-bottom", ht);
    else
      setTimeout(() => {
        $(".ant-row.ant-form-item").css("margin-bottom", ht);
      }, 200);
  };
  const settingup = (data) => {
    if (props.patchlist) list = makePatchList(props.patchlist, list);
    setFormArray(data.data);
    makeFormArray(data.data);

    let desc = "";
    if (data.desc) desc = data.desc;
    setFormSummary({ title: data.name, desc: desc });
  };

  const makePatchList = (patchlist, list) => {
    //props.list contains obj to replace exisiting one
    //ie [{name:"country",optionArray:[{label:"Korea",value:"korea"}]}]
    const patchReplace = (patchlist, list) => {
      let nochangename = [];
      patchlist.map((a, b) => {
        list.map((k, i) => {
          if (a.name === k.name) {
            nochangename.push(a.name);
            k = { ...k, ...a };
            list.splice(i, 1, k);
          }
          return null;
        });
        return null;
      });
      patchlist.map((a, b) => {
        let except = [];
        if (a.except) except = a.except;
        list.map((k, i) => {
          if (
            a.name === "replaceall" &&
            except.indexOf(k.name) === -1 &&
            k.type.indexOf("select") > -1 &&
            nochangename.indexOf(k.name) === -1
          ) {
            k.name1 = k.name;
            k = { ...k, ...a };
          }
          if (k.name1) {
            k.name = k.name1;
            delete k.name1;
          }
          list.splice(i, 1, k);
          return null;
        });
        return null;
      });
      return list;
    };

    if (
      list.length > 0 &&
      ["form.list", "noStyle"].indexOf(list[0].type) > -1
    ) {
      const rtn = patchReplace(patchlist, list[0].array);
      list[0].array = rtn;
    } else {
      list = patchReplace(patchlist, list);
    }
    return list;
  };
  const makeFormArray = (formArray) => {
    let setting = {
      editable: false,
      name: "antform",
      layout: "",
      formColumn: 1,
      formItemLayout: {},
      tailLayout: {},
      initial: {}, // = props.formArray && createInitValuesWithDefault(props.formArray.list),
      size: "middle",
      title: formSummary ? formSummary.title : "",
      desc: formSummary && formSummary.desc ? formSummary.desc : "",
    };
    if (props.title) setting = { ...setting, title: props.title };
    if (props.desc) setting = { ...setting, desc: props.desc };
    // if (props.initialValues) {
    //   setFset({ ...fset, initialValues: props.initialValues });
    // }

    if (props.dropdownRender)
      setOthersetting({ dropdownRender: props.dropdownRender });

    if (props.name) setting = { ...setting, name: props.name };
    if (props.editable) setting = { ...setting, editable: props.editable };
    let list1;
    if (formArray) {
      list1 = labelShowhide(formArray.list, formArray.setting.layout);
      list1 = _.sortBy(list1, ["seq"]);
      if (props.patchlist) list1 = makePatchList(props.patchlist, list1);
      if (props.initialValues)
        list1 = replaceListbyInitValues(list1, props.initialValues);
      setList(list1);
      if (typeof formArray.setting != "undefined") {
        let st = formArray.setting;
        if (st.layout) setting = { ...setting, layout: st.layout };
        if (st.formColumn) setting = { ...setting, formColumn: st.formColumn };
        if (st.formItemLayout)
          setting = {
            ...setting,
            formItemLayout:
              setting.layout === "horizontal" ? st.formItemLayout : null,
          };
        if (st.tailLayout)
          setting = {
            ...setting,
            tailLayout:
              setting.layout === "horizontal"
                ? {
                    wrapperCol: {
                      span: 14,
                      offset: setting.formItemLayout.labelCol.span,
                    },
                  }
                : null,
          };
        if (st.onFinish) setting = { ...setting, onFinish: st.onFinish };
        if (st.onValuesChange)
          setting = { ...setting, onValuesChange: st.onValuesChange };

        if (st.size) setting = { ...setting, size: st.size };
        if (props.initialValues)
          setting = { ...setting, initialValues: props.initialValues };
        else if ((props.name === "fsummary") | (props.name === "esetup"))
          setting = { ...setting, initialValues: st.initialValues };
        else {
          if (
            formArray.list.length > 0 &&
            formArray.list[0].type === "form.list"
          ) {
            const initial = createInitValuesWithDefault(
              formArray.list,
              props.initialValues
            ).name;
            setting = { ...setting, initialValues: initial };
          } else {
            setting = {
              ...setting,
              initialValues: createInitValuesWithDefault(
                formArray.list,
                props.initialValues
              ).name,
            };
          }
        }
      }
    }

    setFset(setting);

    //onload values that filtered conditional fields
    const filteredval = shouldConditionFilter(list1, {
      ...setting.initialValues,
    });
    if (props.filteredValues) props.filteredValues(filteredval);
  };

  const shouldUpdateWrap = (formitem, k) => {
    return (
      <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 1 === 1}>
        {({ getFieldValue }) => {
          let valarr = [],
            show = false;
          if (k.shouldvalue === true) {
            if (getFieldValue(k.shouldfield) === true) show = true;
          } else if (typeof k.shouldvalue !== "undefined") {
            if (["true", "false"].indexOf(k.shouldvalue) > -1) {
              show = getFieldValue(k.shouldfield);
            } else {
              valarr = k.shouldvalue.split(","); //"treemap,scatter".split(",");
              if (valarr.indexOf(getFieldValue(k.shouldfield)) > -1)
                show = true;
              if (
                getFieldValue(k.shouldfield) &&
                getFieldValue(k.shouldfield).indexOf(k.shouldvalue) === 0
              )
                show = true;
              //if shouldfield value startwith shouldvalue
            }
          }

          return show && formitem;
        }}
      </Form.Item>
    );
  };

  const Element = (props) => {
    let list1 = replaceListbyInitValues(list, props.initialValues);
    list1 = makeBtnArray(list1);
    return list1.map((k, i) => {
      let formitem = <AntFormElement key={i} {...k} {...props} />;
      if (k.shouldupdate && showall !== true)
        formitem = shouldUpdateWrap(formitem, k);
      return formitem;
    });
  };

  const onFinish = (val) => {
    if (props.onFinish) props.onFinish(val);
    handleFormSubmit();
  };
  const handleFormSubmit = async () => {
    const value = await form.validateFields();
    return value;
  };
  const onValuesChange = async (changedValues, allValues) => {
    if (fset.initialValues) {
      allValues = { ...fset.initialValues, ...allValues };
    }
    //shouldConfitionFilter
    allValues = shouldConditionFilter(list, allValues);
    if (props.onValuesChange) {
      props.onValuesChange(changedValues, allValues);
    }
  };

  const formhead = (
    <div style={{ textAlign: "left" }}>
      <Typography>
        <Title level={4}>{fset?.title}</Title>
        <Paragraph>{fset?.desc}</Paragraph>
      </Typography>
    </div>
  );
  const ele = (
    <Element
      key={Math.random()}
      formColumn={fset?.formColumn}
      layout={fset?.layout}
      formItemLayout={fset?.formItemLayout}
      tailLayout={fset?.tailLayout}
      editable={fset?.editable}
      initialValues={fset?.initialValues} //for input.color not working
      {...othersetting}
    />
  );
  const elem =
    fset?.formColumn > 1 ? (
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>{ele}</Row>
    ) : (
      ele
    );
  return (
    <>
      {fset && props.showtitle && formhead}
      {fset && (
        <Form
          name={fset.name}
          className="SortForm"
          {...fset.formItemLayout}
          layout={fset.layout}
          form={form}
          onFinish={props.onFinish ? onFinish : fset.onFinish}
          onValuesChange={
            props.onValuesChange ? onValuesChange : fset.onValuesChange
          }
          initialValues={fset?.initialValues}
          size={fset.size}
        >
          {elem}
        </Form>
      )}
      <Spin spinning={loading} />
    </>
  );
};

export default AntFormDisplay;
