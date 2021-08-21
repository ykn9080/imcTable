import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import { Button } from "antd";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
export default function MoreMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  let icon = /*#__PURE__*/React.createElement(MoreVertIcon, null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  }; // useEffect(() => {
  //   if (!openDialog1) setAnchorEl(null);
  // }, [openDialog1]);


  const handleClose = () => {
    setAnchorEl(null);
  };

  if (props.icon) icon = props.icon;
  return /*#__PURE__*/React.createElement("div", null, props.button ? /*#__PURE__*/React.createElement(Button, {
    icon: icon,
    onClick: handleClick
  }) : /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "settings",
    onClick: handleClick
  }, icon), /*#__PURE__*/React.createElement(Menu, {
    id: "simple-menu",
    anchorEl: anchorEl // keepMounted
    ,
    open: Boolean(anchorEl) //open={open}
    ,
    onClose: handleClose
  }, props.menu.map((k, i) => {
    return /*#__PURE__*/React.createElement(MenuItem, {
      key: `moremenu${i}`,
      onClick: () => {
        k.onClick();
        setAnchorEl(null);
      }
    }, k.title);
  })));
}