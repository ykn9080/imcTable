import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { currentsetting } from "config/index.js";

const useStyles = makeStyles((theme) => ({
  footer: {
    textAlign: "center",
    width: "100%",
    height: "50px !important",

    padding: "10px 10px 0px 10px",
    background: "grey",
  },
}));
const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.footer}>
      <Typography variant="title">
        Footer Text **current server:<b>{currentsetting.webserviceprefix}</b>
      </Typography>
    </div>
  );
};

export default Footer;
