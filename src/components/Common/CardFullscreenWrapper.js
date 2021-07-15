import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import "components/Common/Antd.css";
import DialogWrap, { ConditionalWrap } from "components/SKD/FullScreenWrap";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingRight: 10,
  },
}));

const CardFullscreenWrapper = (props) => {
  const classes = useStyles();

  return (
    <div>
      <Grid container className={classes.root} spacing={2}>
        {props.content.map((k, i) => {
          return (
            <Grid item xs={props.size} key={i}>
              <ConditionalWrap
                wrap={(children) => <DialogWrap>{children}</DialogWrap>}
                index={props.index}
              >
                <React.Fragment key={i}>{k}</React.Fragment>
              </ConditionalWrap>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default CardFullscreenWrapper;
