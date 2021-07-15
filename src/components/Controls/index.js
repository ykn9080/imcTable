import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { useHistory } from "react-router-dom";
import { fade, makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import Switch from "@material-ui/core/Switch";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import ControlList from "./ControlList";
import ControlCard from "./ControlCard";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    color: "white",
    flex: 1,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200,
      },
    },
  },
}));

const Controls = ({ id, type, status, status1 }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [ctype, setCtype] = useState(true);
  //status: for open/close, status1: just for reload purpose
  useEffect(() => {
    switch (type) {
      case "table":
        break;
      case "chart":
        break;
      default:
        break;
    }
  }, [status, status1]);

  const handleClose = () => {
    dispatch(globalVariable({ selectedKey: "m2" }));
    history.push("/Edit");
  };

  return (
    <div>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Control Type
          </Typography>
          <Typography component="div">
            <span
              className="MuiTypography-body1"
              style={{ fontSize: "1.1rem", marginRight: 8 }}
            >
              List
            </span>
            <FormControlLabel
              control={
                <Switch checked={ctype} onChange={() => setCtype(!ctype)} />
              }
              label="Card"
            />
            {/* <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>
              <SubjectIcon />
              </Grid>
              <Grid item>
                <AntSwitch
                  checked={ctype}
                  onChange={() => setCtype(!ctype)}
                />
              </Grid>
              <Grid item>
              <ViewModuleIcon />
              </Grid>
            </Grid> */}
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
          <Button autoFocus color="inherit" onClick={handleClose}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      {ctype ? <ControlCard /> : <ControlList />}
    </div>
  );
};

export default Controls;
