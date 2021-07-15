import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsIcon from "@material-ui/icons/Directions";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";
import { currentsetting } from "config/index.js";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    margin: theme.spacing(4, 0, 4),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(5),
  },
  submit: {
    margin: theme.spacing(1, 0, 1),
  },
}));
const Summary = () => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({});
  const handleChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };
  // const keyEnter = event => {
  //   if (event.key === "Enter") {
  //     handleSubmit(event);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(values);
    axios
      .post(`${currentsetting.webserviceprefix}login`, values)
      .then(function (response) {})
      .catch((e) => console.log(e.message));
  };
  const classes = useStyles();
  return (
    <form className={classes.form} noValidate onSubmit={handleSubmit}>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="title"
        label="Title"
        name="title"
        autoComplete="title"
        autoFocus
        onChange={handleChange}
      />
      <TextField
        variant="outlined"
        margin="normal"
        multiline
        rows="4"
        fullWidth
        name="desc"
        label="Description"
        id="desc"
        autoComplete="description"
        onChange={handleChange}
      />
    </form>
  );
};

export default Summary;
