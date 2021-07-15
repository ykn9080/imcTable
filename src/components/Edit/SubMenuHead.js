import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import AddBox from "@material-ui/icons/AddBox";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import { ObjectID } from "bson"; //_id maker for MongoDB

const useStyles = makeStyles(theme => ({
  border: {
    borderRight: "1px solid #EFEFEF"
  },
  extendedIcon: {
    marginRight: theme.spacing(0)
  }
}));
const SubMenuHead = props => {
  const classes = useStyles();
  const dispatch = useDispatch();
  let tempMenu = useSelector(state => state.global.tempMenu);
  let selectedKey = useSelector(state => state.global.selectedKey);
  const handleAddSubMenu = () => {
    const id = new ObjectID();
    const length = _.filter(tempMenu, function(o) {
      return o.pid === selectedKey;
    }).length;

    let newmenu = {
      _id: id,
      id: "imsi" + Math.random().toString(),
      comp: "1",
      creator: "ykn",
      desc: "",
      pid: selectedKey,
      private: false,
      seq: length,
      title: "New submenu",
      layout: [],
      access: []
    };
    tempMenu.push(newmenu);
    dispatch(globalVariable({ tempMenu: tempMenu }));
    props.callBack(true);
  };
  const handleCollapse = () => {
    dispatch(globalVariable({ showSidebar: false }));
  };
  return (
    <div>
      <Box display="flex" p={1} className={classes.border}>
        <Box p={1} flexGrow={1}>
          <Typography>Sub Menu</Typography>
        </Box>
        <Box p={0}>
          <Tooltip title="Add new SubMenu">
            <IconButton aria-label="add new SubMenu" onClick={handleAddSubMenu}>
              <AddBox />
            </IconButton>
          </Tooltip>
        </Box>
        <Box p={0}>
          <Tooltip title="Hide Sidebar">
            <IconButton aria-label="Hide Sidebar" onClick={handleCollapse}>
              <KeyboardArrowLeft />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Divider />
    </div>
  );
};

export default SubMenuHead;
