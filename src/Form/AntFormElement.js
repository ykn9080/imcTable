import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { globalVariable } from "actions";
import _ from "lodash";
import "antd/dist/antd.css";
import "components/Common/Antd.css";
import { makeStyles } from "@material-ui/core/styles";
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  ScissorOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  Select,
  Radio,
  DatePicker,
  TimePicker,
  InputNumber,
  Switch,
  Slider,
  Rate,
  Col,
  Row,
  Tooltip,
  Checkbox,
  Popconfirm,
  Divider,
  Typography,
} from "antd";
import IconBtn from "components/Common/IconButton";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import "rc-color-picker/assets/index.css";
import Sketcher from "components/Color/Sketch.js";
import { pickuniq } from "components/functions/LodashUtil";

const { MonthPicker, RangePicker } = DatePicker;
const { Option, OptGroup } = Select;
const { Text } = Typography;
const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  icon: {
    marginRight: 2,
  },
}));

const AntFormElement = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  let edit = useSelector((state) => state.global.formEdit);
  let open = useSelector((state) => state.global.openDialog);
  let curdt = useSelector((state) => state.global.currentData);

  function onChangeChk(event) {
    let chklist = localStorage.getItem("chklist");
    if (!chklist) chklist = [];
    else chklist = JSON.parse(chklist);
    const chk = event.target.checked;
    const val = parseInt(event.target.value);
    if (chk) chklist.push(val);
    else
      _.remove(chklist, function (num) {
        return num === val;
      });
    localStorage.setItem("chklist", JSON.stringify(chklist));
  }
  const Inliner = (props) => {
    return (
      edit &&
      ["nostyle", "button"].indexOf(props.type) === -1 && (
        <Checkbox
          value={props.seq}
          // checked={checked[props.seq]}
          onChange={onChangeChk}
        />
      )
    );
  };
  const EditDel = (props) => {
    const reorderlist = (list) => {
      list.map((k, i) => {
        k.seq = i;
        list.splice(i, 1, k);
        return null;
      });
      return list;
    };
    const deleteHandler = (props) => {
      let delIndex;
      const delfunc = (props) => {
        curdt.data.list.map((k, i) => {
          if (k.seq === props.seq) {
            delIndex = i;
            return curdt.data.list.splice(i, 1);
          }
          if (i > delIndex) return curdt.data.list.seq--;
          return null;
        });
        curdt.data.list = reorderlist(curdt.data.list);
        dispatch(globalVariable({ currentData: Object.assign({}, curdt) }));
      };
      if (props.type === "button" && props.btnArr) {
        if (props.type === "button" && props.btnArr) {
          if (props.btnArr.length === 1) delfunc(props.btnArr[0]);
          else buttonSelect(props, delfunc);
        }
      } else delfunc(props);
    };
    function buttonSelect(props, callback) {
      // const onChange = (e) => {
      //   callback(e.target.value);
      // };
    }

    const editHandler = (props) => {
      const fromEdit = (val) => {
        dispatch(globalVariable({ elementData: val }));
        dispatch(globalVariable({ openDialog: true }));
        dispatch(globalVariable({ openDialog2: false }));
        open = true;
      };
      if (props.type === "button" && props.btnArr) {
        if (props.btnArr.length === 1) fromEdit(props.btnArr[0]);
        else buttonSelect(props, fromEdit);
      } else fromEdit(props);
    };
    const splitInline = (props) => {
      props.array.map((k, i) => {
        k.seq = props.seq + i;
        if (k.label1) k.label = k.label1;

        delete k.width;
        return null;
      });

      let dList = [];
      dList = curdt.data.list;

      dList = _.orderBy(dList, ["seq"]);
      dList.splice(props.seq, 1, ...props.array);
      dList.map((k, i) => {
        return (k.seq = i);
      });
      curdt.data.list = dList;
      let newObj = {};
      newObj = curdt;
      dispatch(globalVariable({ currentData: newObj }));
      history.push("./formview?rtn=formedit");
    };

    return (
      edit && (
        <div className="dvEditIcon">
          <EditOutlined
            className={classes.icon}
            onClick={() => editHandler(props)}
          />
          {["nostyle", "form.list"].indexOf(props.type) > -1 ? (
            <Tooltip title="split & make elements seperate ">
              <ScissorOutlined onClick={() => splitInline(props)} />
            </Tooltip>
          ) : (
            <Popconfirm
              title="Are you sure delete?"
              onConfirm={() => deleteHandler(props)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined
                className={classes.icon}
                // onClick={() => deleteHandler(props)}
              />
            </Popconfirm>
          )}
        </div>
      )
    );
  };

  const FormItem = (props) => {
    let formItemProps = {
      ...(props.name && { name: props.name }),
      ...(props.rules && { rules: props.rules }),
      ...(props.nostyle && { noStyle: true }),
      ...(props.style && { style: props.style }),
      ...(props.dependencies && { dependencies: props.dependencies }),
      ...(props.onChange && { onChange: props.onChange }),
      ...(props.valuePropName && { valuePropName: props.valuePropName }),
    };
    if (props.type !== "divider") {
      formItemProps = { ...formItemProps, label: props.label };
    }
    if (props.type === "checkbox") {
      formItemProps = { ...formItemProps, valuePropName: "checked" };
    }

    if (props.tooltipmsg) {
      const tlabel = (
        <Row gutter={6}>
          <Col span={18}>{props.label}</Col>
          <Col span={6}>
            <Tooltip title={props.tooltipmsg}>
              <QuestionCircleOutlined />
            </Tooltip>
          </Col>
        </Row>
      );
      formItemProps = { ...formItemProps, label: tlabel };
    }

    let tailLayout = {
      ...((props.type === "button" && props.layout === "horizontal") |
        (["nostyle", "divider"].indexOf(props.type) > -1 && props.offset) && {
        wrapperCol: {
          span: 24 - props?.formItemLayout?.labelCol?.span,
          offset: props?.formItemLayout?.labelCol?.span,
        },
      }),
    };
    let setting = {},
      msgLow = "";
    if (props.msglow) msgLow = props.msglow;
    if (props.placeholder) setting = { placeholder: props.placeholder };
    if (props.onChange) setting = { ...setting, onChange: props.onChange };
    //if (props.name) setting = { ...setting, name: props.name };
    // if (props.addonBefore)
    //   setting = { ...setting, addonBefore: props.addonBefore };

    if (props.disabled) setting = { ...setting, disabled: true };
    if (props.rows) setting = { ...setting, rows: props.rows };
    if (props.minRows)
      setting = {
        ...setting,
        autoSize: { minRows: props.minRows, maxRows: props.maxRows },
      };
    if (props.getPopupContainer)
      setting = {
        ...setting,
        getPopupContainer: props.getPopupContainer,
      };
    if (props.ref) setting = { ...setting, ref: props.ref };
    if (props.popovertop) setting = { ...setting, popovertop: -320 }; ///for form.list input.sketch color
    if (props.id) setting = { ...setting, id: props.id };
    let defaultValue = "";
    if (props.defaultValue) {
      defaultValue = props.devaultValue;
    }
    if (!props.type) return false;

    let item = (() => {
      switch (props.type.toLowerCase()) {
        default:
          return;
        case "plaintext":
          return <span className="ant-form-text">{props.name}</span>;
        case "span":
          return <span>{props.msgright}</span>;
        case "nostyle":
          const cal = (wth) => {
            return Math.round((24 * parseFloat(wth)) / 100);
          };
          let offst = 0;
          if (props.ratio)
            offst = Math.round((24 * parseFloat(props.ratio[0])) / 100);
          return (
            <>
              <Row gutter={4}>
                {props.array.map((k, i) => {
                  if (i > 0) offst = 0;
                  return (
                    <Col offset={offst} span={cal(k.width)}>
                      <FormItem {...k} key={k.name + k.seq} />
                    </Col>
                  );
                })}
              </Row>
            </>
          );
        case "form.list":
          let initArr = props?.initialValues;
          if (initArr) {
            if (Array.isArray(initArr) === false)
              initArr = Object.values(initArr); //props.label, props.initialValues:{Value:[{value:"abc",color:"green"}]}, or [{},{}]
          }
          let spanlist = [],
            onenumlist = ["checkbox", "input.sketcher"];
          const onenum = _.filter(props.array, (o) => {
            return onenumlist.indexOf(o.type) > -1;
          }).length;
          const longsize = 22 - onenum * 2;
          const spansize = parseInt(longsize / (props.array.length - onenum));
          props.array.map((a, b) => {
            if (onenumlist.indexOf(a.type) > -1) spanlist.push(2);
            else spanlist.push(spansize);
            return null;
          });
          return (
            <>
              <Form.List name={props.label}>
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map((field, j) => (
                        <>
                          {props.alllabel === true &&
                            props.colhead === true &&
                            j === 0 && (
                              <Row gutter={4}>
                                {props.array.map((k, i) => {
                                  return (
                                    <Col key={i} span={spanlist[i]}>
                                      <Text strong ellipsis={true}>
                                        {k.label1}
                                      </Text>
                                    </Col>
                                  );
                                })}
                              </Row>
                            )}
                          <Row gutter={4}>
                            {props.array.map((k, i) => {
                              if (k.type.includes("select")) {
                                if (props.dropdownRender && k.dropdownRender) {
                                  k = {
                                    ...k,
                                    dropdownRender: props.dropdownRender,
                                  };
                                }
                              }
                              if (
                                props.alllabel === true &&
                                props.colhead !== true &&
                                i > 0
                              )
                                k = { ...k, label: k.label1 };
                              k = { ...k, popovertop: -320 };
                              return (
                                <Col key={i} span={spanlist[i]}>
                                  <FormItem
                                    {...k}
                                    {...field}
                                    name={[field.name, k.name]}
                                    fieldKey={[field.fieldKey, k.name]}
                                  />
                                </Col>
                              );
                            })}
                            <Col flex="auto">
                              <div style={{ textAlign: "right" }}>
                                <MinusCircleOutlined
                                  onClick={() => {
                                    remove(field.name);
                                  }}
                                />
                              </div>
                            </Col>
                          </Row>
                        </>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add field
                        </Button>
                      </Form.Item>
                    </>
                  );
                }}
              </Form.List>
            </>
          );
        case "icon":
          return (
            <IconBtn
              tooltip={props.tooltip}
              style={{ zIndex: 100000 }}
              awesome={props.iconname}
              fontSize="small"
              aria-controls="back"
              onClick={props.onClick}
            />
          );
        case "input":
          return <Input {...setting} />;
        case "input.password":
          return <Input.Password {...setting} />;
        case "input.textarea":
          return <Input.TextArea {...setting} />;
        case "input.number":
          return props.min ? (
            <InputNumber min={props.min} max={props.max} {...setting} />
          ) : (
            <InputNumber {...setting} />
          );
        case "input.color":
          return (
            // <ColorPicker
            //   animation="slide-down"
            //   {...setting}
            //   style={{ width: 120 }}
            // />
            <input type="color" {...setting} />
          );
        case "input.sketcher":
          return <Sketcher {...setting} />;
        case "datepicker":
          return (
            //<DatePicker format="YYYY-MM-DD" />
            <DatePicker />
          );
        case "datetimepicker":
          return (
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ zIndex: 1000000 }}
            />
          );
        case "monthpicker":
          return <MonthPicker />;
        case "rangepicker":
          return <RangePicker />;
        case "rangetimepicker":
          return <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />;
        case "timepicker":
          return <TimePicker />;

        case "switch":
          return <Switch />;
        case "checkbox":
          return <Checkbox>{props.checkboxmsg}</Checkbox>;
        case "slider":
          let marks = "",
            min = 0,
            max = 100,
            range = false;
          if (typeof props.min != "undefined") {
            min = props.min;
            max = props.max;
          }
          if (props.marks) marks = props.marks;
          if (props.range) range = props.range;
          return <Slider marks={marks} min={min} max={max} range={range} />;
        case "range":
          let prop = {};
          if (props.allowCross)
            prop = { ...prop, allowCross: props.allowCross };
          if (props.count) prop = { ...prop, count: props.count };
          if (props.marks) prop = { ...prop, marks: props.marks };
          if (props.step) prop = { ...prop, step: props.step };
          if (props.dots) prop = { ...prop, dots: props.dots };
          if (props.dotStyle) prop = { ...prop, dotStyle: props.dotStyle };
          if (props.activeDotStyle)
            prop = { ...prop, activeDotStyle: props.activeDotStyle };
          if (props.defaultValue)
            prop = { ...prop, defaultValue: props.defaultValue };
          if (props.onAfterChange)
            prop = {
              ...prop,
              onAfterChange: (val) => props.onAfterChange(val),
            };
          if (props.pushable) prop = { ...prop, pushable: true };
          return <Range {...prop} />;
        case "rate":
          return <Rate />;
        case "select":
          const dropdownRenderFunction = (name) => {
            if (typeof name === "object") name = name[1];
            const func = _.find(props.dropdownRender, (o) => {
              return (o.name = name);
            });
            if (func) func.function();
          };

          if (props.dropdownRender)
            setting = {
              ...setting,
              dropdownRender: (menu) => (
                <div>
                  {menu}
                  <Divider style={{ margin: "4px 0" }} />
                  <div
                    style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}
                  >
                    <a
                      style={{
                        flex: "none",
                        padding: "8px",
                        display: "block",
                        cursor: "pointer",
                      }}
                      onClick={() => dropdownRenderFunction(props.name)}
                    >
                      <PlusOutlined /> Add item
                    </a>
                  </div>
                </div>
              ),
            };
          let grplist;
          const uiq = pickuniq(props.optionArray, "group");
          if (uiq[0] !== undefined) grplist = uiq;
          const sublist = (k) => {
            const rtn = _.filter(props.optionArray, (o) => {
              return o.group === k;
            });
            return rtn;
          };

          const single = (
            <Select
              getPopupContainer={(node) => node.parentNode}
              {...setting}
              defaultValue={defaultValue}
            >
              {typeof props.optionArray === "object" &&
                props.optionArray.map((k, i) => {
                  return (
                    <Select.Option key={k.value} value={k.value}>
                      {k.text || k.label}
                    </Select.Option>
                  );
                })}
            </Select>
          );
          const groupList = (
            <Select {...setting} defaultValue={defaultValue}>
              {grplist &&
                grplist.map((k, i) => {
                  return (
                    <OptGroup label={k}>
                      {sublist(k).map((a, b) => {
                        return (
                          <Option key={a.value} value={a.value}>
                            {a.text || a.label}
                          </Option>
                        );
                      })}
                    </OptGroup>
                  );
                })}
            </Select>
          );
          //return single;
          return grplist && grplist.length > 0 ? groupList : single;
        // <Select
        //   getPopupContainer={(node) => node.parentNode}
        //   {...setting}
        //   defaultValue={defaultValue}
        // >
        //   {typeof props.optionArray === "object" &&
        //     props.optionArray.map((k, i) => {
        //       return (
        //         <Select.Option value={k.value}>{k.text}</Select.Option>
        //       );
        //     })}
        // </Select>
        case "select.multiple":
          return (
            <Select
              mode="multiple"
              {...setting}
              getPopupContainer={(node) => node.parentNode}
            >
              {typeof props.optionArray === "object" &&
                props.optionArray.map((k, i) => {
                  return (
                    <Option key={k.value} value={k.value}>
                      {k.text || k.label}
                    </Option>
                  );
                })}
            </Select>
          );
        case "radio.group":
          return (
            <Radio.Group defaultValue={defaultValue} {...setting}>
              {typeof props.optionArray === "object" &&
                props.optionArray.map((k, i) => {
                  return (
                    <Radio key={k.value} value={k.value}>
                      {k.text || k.label}
                    </Radio>
                  );
                })}
            </Radio.Group>
          );
        case "radio.button":
          return (
            <Radio.Group defaultValue={defaultValue} {...setting}>
              {typeof props.optionArray === "object" &&
                props.optionArray.map((k, i) => {
                  return (
                    <Radio.Button key={k.value} value={k.value}>
                      {k.text || k.label}
                    </Radio.Button>
                  );
                })}
            </Radio.Group>
          );
        case "checkbox.group":
          const Chk = (props) => {
            return (
              typeof props.optionArray === "object" &&
              props.optionArray.map((k, i) => {
                return props.direction === "horizontal" ? (
                  <Checkbox key={k.value} value={k.value}>
                    {k.text || k.label}
                  </Checkbox>
                ) : (
                  <Col span={24}>
                    <Checkbox key={k.value} value={k.value}>
                      {k.text || k.label}
                    </Checkbox>
                  </Col>
                );
              })
            );
          };

          return (
            <Checkbox.Group defaultValue={defaultValue}>
              {typeof props.optionArray === "object" &&
              props.direction === "vertical" ? (
                <Row>
                  <Chk {...props} />
                </Row>
              ) : (
                <Chk {...props} />
              )}
            </Checkbox.Group>
          );
        case "divider":
          return (
            <Divider orientation={props.orientation} {...setting}>
              {props.label}
            </Divider>
          );
        case "button":
          let btnArr = [
            {
              label: "Submit",
              btnStyle: "secondary",
              action: "submit",
              seq: 0,
            },
            {
              label: "Cancel",
              btnStyle: "primary",
              action: "button",
              seq: 1,
            },
          ];
          if (props.btnArr) btnArr = props.btnArr;
          else btnArr = props;

          let blk = false,
            align = "left";
          if (props.align === "right") {
            align = "right";
          }
          if (props.block === true) blk = true;
          const item = (k, i) => {
            let btnProps = { key: i };
            if (k.btnStyle && k.btnStyle !== "primary")
              btnProps = { ...btnProps, type: k.btnStyle };
            if (k.btnColor) btnProps = { ...btnProps, type: k.btnColor };
            if (k.action && k.action === "submit")
              btnProps = { ...btnProps, htmlType: k.action };
            if (k.onClick && k.onClick !== "") {
              btnProps = {
                ...btnProps,
                onClick: () => {
                  eval(k.onClick);
                },
              };
            }

            if (k.hide) btnProps = { ...btnProps, noStyle: true };
            if (blk) {
              btnProps = {
                ...btnProps,
                block: true,
                style: { marginBottom: 10 },
              };
            }
            return btnProps;
          };

          return (
            <>
              <Row gutter={2} justify="space-between">
                <Col flex="auto">
                  <div style={{ textAlign: align }}>
                    {_.orderBy(btnArr, ["seq"]).map((k, i) => {
                      let setid = {};
                      setid = { id: `btn${k.name}` };
                      return (
                        <Button {...setid} {...item(k, i)}>
                          {k.label}
                        </Button>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            </>
          );
      }
    })();
    const wrapItem = (item) => {
      return (
        <Form.Item name={props.name} {...setting} noStyle>
          {item}
        </Form.Item>
      );
    };
    if (props.msgright) {
      let flexset = {};
      if (props.type.includes("select")) flexset = { flex: "auto" };
      item = (
        <Row gutter={4}>
          <Col {...flexset}>{wrapItem(item)}</Col>
          <Col>{props.msgright}</Col>
        </Row>
      );
    }
    if (props.msgtop)
      item = (
        <>
          <Row>{props.msgtop}</Row>
          {wrapItem(item)}
        </>
      );
    if (props.btnright === true) {
      let flexset = {},
        btnset = {};
      if (props.type.includes("select")) flexset = { flex: "auto" };
      if (props.btnevent)
        btnset = {
          onClick: () => {
            try {
              eval(props.btnevent);
            } catch {}
          },
        };

      item = (
        <Row gutter={4}>
          <Col {...flexset}>{wrapItem(item)}</Col>
          <Col>
            {props.iconbtn === true ? (
              <IconBtn
                id={"btn" + props.name}
                tooltip={props.btntooltip}
                btntype="ant"
                style={{ zIndex: 100000, marginTop: 4 }}
                awesome={props.btntitle}
                fontSize="small"
                aria-controls={props.btntitle}
                {...btnset}
              />
            ) : (
              <Tooltip title={props.btntooltip}>
                <Button id={"btn" + props.name} {...btnset}>
                  {props.btntitle}
                </Button>
              </Tooltip>
            )}
          </Col>
        </Row>
      );
    }

    return (
      <Form.Item
        {...formItemProps}
        {...tailLayout}
        key={props.label + props.seq}
        extra={msgLow}
      >
        {item}
      </Form.Item>
    );
  };

  const grid = (
    <>
      <Row gutter={4}>
        <Col span={1}>
          <Inliner {...props} />
        </Col>
        <Col span={22}>
          <FormItem {...props} />
        </Col>
        <Col span={1}>
          <EditDel {...props} />
        </Col>
      </Row>
    </>
  );
  let colnum = 24;
  colnum = colnum / props.formColumn;
  // if (props.formColumn === 1) {
  //   return !props.editable ? <FormItem {...props} /> : grid;
  // } else if (props.formColumn > 1) colnum = colnum / props.formColumn;
  return !props.editable ? (
    <Col span={colnum}>
      <FormItem {...props} />
    </Col>
  ) : (
    <Col span={colnum}>{grid}</Col>
  );
};
export default AntFormElement;
