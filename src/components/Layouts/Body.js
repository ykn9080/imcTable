import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import _ from "lodash";
import { useSelector } from "react-redux";
import CardForm from "components/Common/CardForm";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 250,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  icon: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  iconright: {
    alignItems: "bottom",
  },
  primary: {
    // margin: theme.spacing(1),
  },
  landingImg: {
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  landingH3: {
    fontSize: "1.8em",
    textAlign: "center",
    marginTop: "1em",
  },
  landingTxt: {
    fontSize: "1.2em",
    textAlign: "center",
    width: "50%",
    margin: "auto",
    marginBottom: "1em",
  },
}));

export const CenteredGrid = (props) => {
  const classes = useStyles();
  let keyval = "BreadCrumb";

  keyval = useSelector((state) => state.global.selectedKey);
  const ctrlist = useSelector((state) => state.global.controls);
  // login token
  const token = useSelector((state) => state.global.token);

  // const rowdt = useSelector(state => state.rowdt);
  // MultiDispatch({ rowdt: "vvvvvv" });

  //const [rowdt, setRowdt] = useState([2, 1, 3, 4]);
  const [rowdt, setRowdt] = useState(ctrlist);

  const IconBtn = (props) => {
    const classes = useStyles();
    const addGridHandler = (row, val) => {
      //e.preventDefault();
      let newState = [...rowdt]; // clone the array
      newState[row] = val;
      setRowdt(newState);
    };
    return (
      <Grid item xs={"auto"}>
        <span>
          <Fab
            color="primary"
            size="small"
            aria-label="add"
            className={classes.iconright}
          >
            <AddIcon
              id={props.dt.row + "n" + (props.dt.val + 1)}
              onClick={() => {
                addGridHandler(props.dt.row, props.dt.val + 2);
              }}
            />
          </Fab>
        </span>
      </Grid>
    );
  };

  const GridRow = (props) => {
    return (
      <Grid item xs={props.xssize}>
        <CardForm />
        {/* <Paper className={classes.paper}>
          xs={props.xssize}{" "}
          <div>
            <Fab color="primary" aria-label="add">
              <RemoveIcon
                onClick={() => {
                  removeGridHandler(props.dt);
                }}
              />
            </Fab>
            <Fab color="secondary" aria-label="edit">
              <EditIcon />
            </Fab>
          </div>
        </Paper> */}
      </Grid>
    );
  };

  let newArr = [];
  _.each(rowdt, (val, key) => {
    let i;
    for (i = 0; i < val; i++) {
      newArr.push({ row: key, col: i, val: val - 1, xs: 12 / val });
    }
  });

  return (
    <>
      <div className={classes.primary}>
        {/* This page is {keyval} */}
        {token /* Login Homepage */ ? (
          <>
            {/* <img src={require("images/login_main.png")}></img>
            <DataList title={"Recent Datasets"} caller="body" /> */}
          </>
        ) : (
          /* Landing Page - no login token */
          <>
            {/* <img src={require("images/landing_main.png")}></img> 
            <div className={classes.landingH3}>What is NM365 ?</div>
            <div className={classes.landingTxt}>
              NM365 is a data science platform and helps you make more accurate
              decision with a combination of Graph Analysis and Machine
              Learning.
            </div>
            <img
              className={classes.landingImg}
              src={require("images/whatisnm365.png")}></img>
            <div className={classes.landingH3}>How NM365 works</div>
            <div className={classes.landingTxt}>
              NM365 is designed to extract graph data from big-data and analyze
              them with graph measures. Also, the latest machine learning
              algorithms help you to solve a problem.
            </div>
            <img
              className={classes.landingImg}
              src={require("images/howworks1.png")}
            ></img>
            <img
              className={classes.landingImg}
              src={require("images/howworks2.png")}
            ></img>*/}
          </>
        )}
      </div>
      {/* <Rtable /><RDG /> */}
      {/* //<BootTable /> */}
      <Grid container justify="center" className={classes.root} spacing={2}>
        {newArr.map((dt, index) => {
          return dt.col !== dt.val ? (
            <GridRow dt={dt} xssize={dt.xs} key={dt.col + "_" + index} />
          ) : (
            <>
              <GridRow dt={dt} xssize={dt.xs - 1} key={dt.col + "_" + index} />
              <IconBtn dt={dt} />
            </>
          );
        })}
      </Grid>
    </>
  );
};
