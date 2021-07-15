import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { globalVariable } from "actions";
import _ from "lodash";
import $ from "jquery";
import { makeStyles } from "@material-ui/core/styles";
import "antd/dist/antd.css";
import "components/Common/Antd.css";
import { Button, Col, Row, Tabs, message } from "antd";
import AntFormElement from "./AntFormElement";
import SpeedDialButton from "components/Common/SpeedDial";
import ElementInput from "Form/ElementInput";
import DialogFull from "components/Common/DialogFull";
import AntFormDisplay from "./AntFormDisplay";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { FaRegHandshake } from "react-icons/fa";
import { CgPlayListAdd } from "react-icons/cg";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import DialogSelect from "components/Common/DialogSelect";
import TabAnt from "components/Common/TabAnt";
import Typography from "@material-ui/core/Typography";
import Popup from "components/Common/Popup";

const { TabPane } = Tabs;
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  speedDialWrapper: {
    position: "relative",
    textAlign: "left",
    marginTop: theme.spacing(13),
    height: 380,
  },
  radioGroup: {
    margin: theme.spacing(1, 0),
  },
  speedDial: {
    position: "absolute",
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      bottom: theme.spacing(-292),
      right: theme.spacing(50),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
}));
const AntFormBuild = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  let tabPanelArray = [];
  let data;
  if (props.formdt) {
    data = props.formdt.data;
  }
  const [formArray, setFormArray] = useState(data);
  const [formdt, setFormdt] = useState(props.formdt);
  const [tabarray, setTabarray] = useState("");

  let open = useSelector((state) => state.global.openDialog); //edit
  let open1 = useSelector((state) => state.global.openDialog1); //create new
  let currentData = useSelector((state) => state.global.currentData);
  let showall = useSelector((state) => state.global.showall);

  const buttonSeqChg = (list) => {
    var btnArr = _.remove(list, function (n) {
      return n.type === "button";
    });
    btnArr.map((k, i) => {
      k.seq = k.seq + 1000;
      btnArr.splice(i, 1, k);
      return null;
    });
    list = list.concat(btnArr);
    return list;
  };
  const ReOrder = (start_pos, end_pos) => {
    console.log(start_pos, end_pos);
    let arr = formdt;
    let list = arr.data.list;
    let newArr = [];
    list = buttonSeqChg(list);
    // const rtn = seqCleanup(list, start_pos, end_pos);
    // start_pos = rtn[0];
    // end_pos = rtn[1];
    console.log(start_pos, end_pos);

    //seq rearrange before reorder

    // let list = _.sortBy(arr.data.list, ["seq"]);
    list.map((k, i) => {
      if (k.type !== "button") {
        k.seq = i;
        list.splice(i, 1, k);
      }
      return null;
    });

    if (start_pos < end_pos)
      _.forEach(list, function (value, key) {
        if (value.type !== "button") {
          if (value.seq <= end_pos && value.seq > start_pos) value.seq--;
          else if (value.seq === start_pos) value.seq = end_pos;
        }
        newArr.push(value);
      });
    if (start_pos > end_pos)
      _.forEach(list, function (value, key) {
        if (value.type !== "button") {
          if (value.seq >= end_pos && value.seq < start_pos) value.seq++;
          else if (value.seq === start_pos) value.seq = end_pos;
        }
        newArr.push(value);
      });
    newArr = _.sortBy(newArr, ["seq"]);
    arr.data.list = newArr;
    setFormdt(arr);
    setFormArray(arr.data);
    dispatch(globalVariable({ currentData: arr }));
    //st>ed -> st prev +1 st->ed
  };
  useEffect(() => {
    setFormArray(props.formdt.data);
  }, [props.formdt.data.list, open]);

  useEffect(() => {
    dispatch(globalVariable({ formEdit: true }));
    dispatch(globalVariable({ showall: false }));

    MakeTabPanel1();
    setTabarray(tabPanelArray);
    setTimeout(() => {
      $(".MuiTabs-scroller.MuiTabs-scrollable").css({
        width: "400px",
      });
      let $node = $(".SortForm");
      if (formArray && formArray.setting.colnum > 1)
        $node = $(".SortForm>div:first-child");
      $node.sortable({
        opacity: 0.8,
        placeholder: "ui-state-highlight",
        start: function (event, ui) {
          var start_pos = ui.item.index();
          ui.item.data("start_pos", start_pos);
        },
        update: function (event, ui) {
          var start_pos = ui.item.data("start_pos");
          var end_pos = ui.item.index();
          //$('#sortable li').removeClass('highlights');
          ReOrder(start_pos, end_pos);
        },
      });
      return () => {
        $node.sortable({
          placeholder: "ui-state-highlight",
        });
      };
    }, 500);
  }, [open]);

  //이부분은 elementlist로 분가시킬것
  const MakeTabPanel1 = () => {
    const optGrp = [
      [
        "input",
        "input.password",
        "input.textarea",
        "input.number",
        "input.color",
        "input.sketcher",
      ],
      [
        "select",
        "select.multiple",
        "radio.group",
        "radio.button",
        // "checkbox.group",
      ],
      [
        "datepicker",
        "datetimepicker",
        "monthpicker",
        "rangepicker",
        "timepicker",
      ],
      ["checkbox", "switch"],
      ["slider", "rate"],
      ["plaintext", "button", "divider"],
    ];
    const findMaxSeq = () => {
      let maxseq = 0;
      formArray.list.map((k, i) => {
        if (k.seq >= maxseq) return (maxseq = k.seq + 1);
        return null;
      });

      return maxseq;
    };
    const handleCreateNew = (type) => {
      let newseq = findMaxSeq();

      let eldt = {
        label: "",
        name: "",
        type: type,
        seq: newseq,
      };
      dispatch(globalVariable({ elementData: eldt }));
      dispatch(globalVariable({ openDialog1: false }));
      dispatch(globalVariable({ openDialog: true }));
    };
    const MakeTabPanel = (k) => {
      let opt = {};
      if (
        ["select", "select.multiple", "radio.group", "checkbox.group"].indexOf(
          k.title
        ) > -1
      )
        opt = {
          optionArray: [
            { value: "korea", text: "Korea" },
            { value: "usa", text: "USA" },
            { value: "japan", text: "Japan" },
          ],
        };
      return (
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={6}>
            <Typography noWrap>{k.title}</Typography>
          </Col>
          <Col span={14}>
            <AntFormElement name={k.type} type={k.type} {...opt} />
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={() => handleCreateNew(k.type)}>
              Select
            </Button>
          </Col>
        </Row>
      );
    };

    const tabArray = [
      "input",
      "select",
      "datetime",
      "toggle",
      "level",
      "others",
    ];
    optGrp.map((k, i) => {
      return tabPanelArray.push({
        title: tabArray[i],
        content: k.map((j, i) => {
          return (
            <Row>
              <Col span={24}>
                <MakeTabPanel title={j} type={j} />
              </Col>
            </Row>
          );
        }),
      });
    });
  };
  const makeFormlist = () => {
    makeInline("form.list");
  };
  const makeInline = (type) => {
    if (!type) type = "nostyle";
    let chklist = localStorage.getItem("chklist");
    if (chklist) chklist = JSON.parse(chklist);
    else {
      message.warning("Please select checkbox");
      return;
    }
    let dList = currentData.data.list;
    const inList = _.remove(dList, (o) => {
      return chklist.indexOf(o.seq) > -1;
    });
    if (!inList) return false;
    let lbl = inList[0].label,
      seq = inList[0].seq,
      leng = inList.length;
    let inArr = {
      label: lbl,
      type: type,
      seq: seq,
    };
    let ro = [0],
      rat = 0;
    inList.map((k, i) => {
      let kk = { ...k };
      kk.seq = i;
      kk.label1 = k.label;
      //delete kk.label;
      kk.width = parseInt(100 / leng) + "%";
      inList.splice(i, 1, kk);

      rat += parseInt(100 / leng);
      ro.push(rat);
      return null;
    });
    inArr = { ...inArr, array: inList };
    inArr = { ...inArr, ratio: ro };
    dList.push(inArr);
    dList = _.map(_.sortBy(dList, "seq"));
    dList.map((k, i) => {
      k.seq = i;
      return null;
    });
    //dispatch(globalVariable({ chklist: null }));

    localStorage.removeItem("chklist");
    dispatch(globalVariable({ currentData }));
    history.push("./formview?rtn=formedit");
  };

  const actions = [
    {
      icon: <AddBoxIcon />,
      name: "New",
      handleClick: () => {
        dispatch(globalVariable({ openDialog1: true }));
      },
    },

    {
      icon: <FaRegHandshake />,
      name: "Make Inline",
      handleClick: () => {
        makeInline();
      },
    },
    {
      icon: <CgPlayListAdd />,
      name: "Make Form List",
      handleClick: () => {
        makeFormlist();
      },
    },
    {
      icon: showall ? <EyeOutlined /> : <EyeInvisibleOutlined />,
      name: showall ? "Show All" : "Hide",
      handleClick: () => {
        dispatch(globalVariable({ showall: !showall }));
      },
    },
  ];

  const actbutton = [
    <Button
      onClick={() => {
        dispatch(globalVariable({ openPopup: true }));
      }}
    >
      MultiCreate
    </Button>,
    <Button
      onClick={() => {
        dispatch(globalVariable({ openDialog: true }));
      }}
    >
      Create
    </Button>,
  ];
  const onFinishMultiInsert = (val) => {
    let curlist = currentData.data.list;
    if (!curlist) curlist = [];
    //find max seq
    let maxseq = _.maxBy(curlist, "seq");
    if (!maxseq) maxseq = 0;
    else maxseq = maxseq.seq;
    const keyList = Object.keys(val);
    let outlist = [],
      reordered = [];
    keyList.map((k, i) => {
      const fd = val[k];
      if (fd) {
        const fdarr = fd.split(",");
        fdarr.map((a, j) => {
          const lbl = a.charAt(0).toUpperCase() + a.slice(1);
          return outlist.push({
            type: k,
            label: lbl,
            name: a,
            seq: i + j + maxseq,
          });
        });
      }

      return null;
    });
    reordered = curlist.concat(outlist);
    reordered.map((k, i) => {
      k.seq = i;
      reordered.splice(i, 1, k);

      return null;
    });
    currentData.data.list = reordered;
    dispatch(globalVariable({ currentData: currentData }));
    dispatch(globalVariable({ openPopup: false }));
    dispatch(globalVariable({ openDialog1: false }));
  };
  const onValuesChangeForm = (changedValues, allValues) => {
    // setInitParameter({ script: JSON.stringify(allValues, null, 4) });
    // setInitFormArray(allValues);
  };
  // const onValuesChangeParamter = (changedValues, allValues) => {
  //   const stxt = allValues.script;
  //   const sobj = JSON.parse(allValues.script);
  //   console.log(stxt);
  //   makeParam(JSON.parse(allValues.script));
  // };
  const onUpdate = (val) => {
    setFormArray(val);
    props.reload();
  };
  console.log(props, formArray);
  return (
    <div className={classes.root}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Form" key="1">
          <AntFormDisplay
            {...props}
            formArray={formArray}
            editable={true}
            onValuesChange={onValuesChangeForm}
          />
        </TabPane>
        <TabPane tab="Script" key="2">
          <AntFormDisplay
            formid="5f7be94d85cd1730c8544018"
            // onValuesChange={onValuesChangeParamter}
          />
        </TabPane>
      </Tabs>

      <div className={classes.speedDialWrapper}>
        <SpeedDialButton
          className={classes.speedDial}
          actions={actions}
          direction="left"
          onDoubleClick={actions[0].handleClick}
        />
      </div>

      <DialogFull
        open={open}
        title="Element Edit"
        maxWidth="lg"
        fullWidth={true}
      >
        <ElementInput onUpdate={onUpdate} />
      </DialogFull>
      <DialogSelect open={open1} dialogAction={actbutton}>
        <div className={classes.root}>
          <TabAnt tabArray={tabarray} mode="left" />
        </div>
        <Popup helpLink={"/admin/control/form/formedit?type=multiinsert"}>
          <AntFormDisplay
            formid="5eac0e7868c258495433823f"
            showtitle={true}
            onFinish={onFinishMultiInsert}
            // title="Multiple Insert"
            // desc="Seperate comma multiple input"
          />
        </Popup>
      </DialogSelect>
    </div>
  );
};

export default AntFormBuild;
