import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { useHistory } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconBtn from "components/Common/IconButton";

const IconArray1 = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleReset = () => {
    dispatch(globalVariable({ control: [] }));
    dispatch(globalVariable({ menuedit: false }));
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuEdit = () => {
    dispatch(globalVariable({ menuedit: true }));
    dispatch(globalVariable({ control: [] }));
    handleClose();
  };
  const handleNavigate = (e) => {
    //e.preventDefault();
    history.push("/controls");
    handleClose();
  };

  const editMenu = (
    <Menu
      id="editMenu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleMenuEdit}>Edit</MenuItem>
      <MenuItem onClick={handleReset}>Reset</MenuItem>
      <MenuItem onClick={handleNavigate}>Navigate</MenuItem>
    </Menu>
  );

  const MakeBtn = ({ btnArr }) => {
    return btnArr.map((k, i) => {
      return <IconBtn key={i} {...k} />;
    });
  };
  return (
    <>
      <MakeBtn btnArr={props.btnArr} />
      {editMenu}
    </>
  );
};

export default IconArray1;
