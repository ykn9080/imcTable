import React from "react";
import { useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { Button, Col, Row, Typography } from "antd";
import { makeStyles } from "@material-ui/core/styles";
import AntFormElement from "Form/AntFormElement";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
      minWidth: theme.spacing(40),
      minHeight: theme.spacing(20),
    },
  },
}));

//이부분은 elementlist로 분가시킬것
export const MakeTabPanel1 = (data) => {
  let tabPanelArray = [];
  const dispatch = useDispatch();
  const optGrp = [
    [
      "input",
      "input.password",
      "input.textarea",
      "inputnumber",
      "input.color",
      "input.sketcher",
    ],
    ["select", "select.multiple", "radio.group", "checkbox.group"],
    [
      "datepicker",
      "datetimepicker",
      "monthpicker",
      "rangepicker",
      "timepicker",
    ],
    ["checkbox", "switch"],
    ["slider", "rate"],
    ["plaintext", "button"],
  ];
  const findSeq = () => {
    let maxseq = 0;
    data.list.map((k, i) => {
      if (k.seq >= maxseq) return (maxseq = k.seq + 1);
    });
    console.log(maxseq);
    return maxseq;
  };
  const handleCreateNew = (type) => {
    let eldt = {
      label: "",
      name: "",
      type: type,
      seq: findSeq(),
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

  const tabArray = ["input", "select", "datetime", "toggle", "level", "others"];
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
  return tabPanelArray;
};

const ElementList = (props) => {
  const classes = useStyles();

  return null;
};

// const [elArray, setElArray] = useState([]);
// const [eltype, setEltype] = useState(props.eltype);
// const [selectedValue, setSelectedValue] = useState(0);

// const handleChange = event => {
//   setSelectedValue(event.target.value);
//   console.log(selectedValue, event.target.value);
// };

// const formrow = dt => {
//   return dt;
// };
// useEffect(() => {
//   let qrystr = "";
//   eltype.map((k, i) => {
//     qrystr += k + "&controlType=";
//   });

//   axios
//     .get(
//       `${currentsetting.webserviceprefix}formelement/id?controlType=${qrystr}`
//     )
//     .then(function(response) {
//       // if (response.data.data != "undefined")
//       console.log(response.data);
//       if (response.data.length > 0) setElArray(formrow(response.data));
//     })
//     .catch(function(error) {
//       console.log(error);
//     });
// }, [eltype]);

// return (
//   <div className={classes.root}>
//     {elArray.map((k, i) => {
//       return (
//         <Paper key={i}>
//           <Grid container spacing={1}>
//             <Grid item xs={2}>
//               <Radio
//                 checked={selectedValue.toString() === i.toString()}
//                 onChange={handleChange}
//                 value={i}
//                 name="radio-button-demo"
//                 inputProps={{ "aria-label": i }}
//               />
//             </Grid>
//             <Grid item xs>
//               <BootFormElement {...k} />
//             </Grid>
//           </Grid>
//         </Paper>
//       );
//     })}
//   </div>
// );

export default ElementList;
