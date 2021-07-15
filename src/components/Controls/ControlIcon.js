import React from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined";
import SaveIcon from "@material-ui/icons/Save";
import PrintIcon from "@material-ui/icons/Print";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteIcon from "@material-ui/icons/Favorite";
import EditIcon from "@material-ui/icons/Edit";
import LibraryAdd from "@material-ui/icons/LibraryAdd";

import { globalVariable } from "actions";
import useForceUpdate from "use-force-update";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 380,
    transform: "translateZ(0px)",
    flexGrow: 1,
  },
  speedDial: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const actions = [
  { icon: <LibraryAdd />, name: "Add Control" },
  { icon: <EditIcon />, name: "Edit" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
];

export default function ControlIcon(props) {
  const forceUpdate = useForceUpdate();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (name) => {
    console.log(props.ctrList);
    switch (name) {
      case "Add Control":
        props.addNewControl(props.ctrList);
        break;
    }
    setOpen(false);
  };

  return (
    // <div className={classes.root}>
    <div>
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        className={classes.speedDial}
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => handleClose(action.name)}
          />
        ))}
      </SpeedDial>
    </div>
  );
}
