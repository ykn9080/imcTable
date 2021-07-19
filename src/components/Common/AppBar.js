import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import IconArray from "components/SKD/IconArray";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none",
    backgroundColor: "#cccccc",
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  children: {
    flexGrow: 9,
  },
  appBar: {
    position: "relative",
  },
}));

export default function DenseAppBar(props) {
  //props={left:}
  const classes = useStyles();
  const history = useHistory();
  let left = props.left;
  let children = props.children;
  let right = props.right;
  if (typeof left === "undefined")
    left = <HomeIcon onClick={() => history.push("/")} />;
  else if (left === "showhide") left = <IconArray />;

  if (typeof children === "undefined") children = "";
  if (typeof right === "undefined") {
    if (props.left === "showhide")
      right = (
        <>
          <HomeIcon onClick={() => history.push("/")} />
        </>
      );
    else right = "";
  }

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#161313" }}>
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            {left}
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.title}>
            {props.title}
          </Typography>
          {children}
          {right}
        </Toolbar>
      </AppBar>
    </>
  );
}
