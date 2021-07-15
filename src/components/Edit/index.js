import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { HeadEdit } from "./Head";
import { Body } from "./Body";
import Footer from "components/Layouts/Footer";
import { SubMenu } from "./SubMenu";
import { globalVariable } from "actions";
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
const Edit = (props) => {
  let title = props.match.params.name;
  if (typeof props.match.params.child != "undefined")
    title = props.match.params.child;

  let tempMenu;
  const dispatch = useDispatch();
  tempMenu = useSelector((state) => state.global.tempMenu);
  let selectedKey = useSelector((state) => state.global.selectedKey);
  let showSidebar = useSelector((state) => state.global.showSidebar);

  const selectedmenu = (id) => {
    dispatch(globalVariable({ selectedKey: id }));
    selectedKey = id;
  };

  const addControl = (newArr) => {
    dispatch(globalVariable({ control: newArr }));
  };
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <HeadEdit selectedmenu={selectedmenu} title={title} />
          </Grid>
          {showSidebar ? (
            <Grid item xs={3}>
              <SubMenu selectedmenu={selectedmenu} tempMenu={tempMenu} />
            </Grid>
          ) : null}
          <Grid item xs>
            <Body addControl={addControl} />
          </Grid>
        </Grid>
      </div>
      <Footer />
    </>
  );
};

export default Edit;
