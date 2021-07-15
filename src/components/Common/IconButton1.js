import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    "& > .fa": {
      margin: theme.spacing(2),
    },
  },
}));

const IconButton1 = (props) => {
  const classes = useStyles();
  let setting = { color: "inherit" };
  if (props.color) setting = { color: props.color };
  return (
    <div className={classes.root}>
      <Tooltip title={props.tooltip}>
        <IconButton {...setting}>{props.icon}</IconButton>
      </Tooltip>
    </div>
  );
};

export default IconButton1;
