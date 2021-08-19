import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import { MoreOutlined } from "@ant-design/icons";

export default function MoreMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <MoreOutlined onClick={handleClick} />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        // keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.menu.map((k, i) => (
          <MenuItem
            key={`moremenu${i}`}
            onClick={() => {
              k.onClick();
              setAnchorEl(null);
            }}
          >
            {k.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
