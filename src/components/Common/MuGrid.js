import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function MuGrid(props) {
  const classes = useStyles();
  let xs,
    sm,
    wth = { xs: 12, sm: xs / 2 };
  let cont = {
    spacing: 3,
    direction: "row",
    justify: "center",
    alignItems: "center",
  };
  if (props.xs) wth = { ...wth, xs: props.xs };
  if (props.sm) wth = { ...wth, sm: props.sm };
  if (props.spacing) cont = { ...cont, spacing: props.spacing };
  if (props.direction) cont = { ...cont, direction: props.direction };
  if (props.justify) cont = { ...cont, justify: props.justify };
  if (props.alignItems) cont = { ...cont, alignItems: props.alignItems };
  return (
    <div className={classes.root}>
      <Grid container {...cont}>
        {props.array.map((k, i) => {
          return (
            <Grid item {...wth}>
              {k}
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
