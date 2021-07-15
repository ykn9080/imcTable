import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 30,
    transform: "translateZ(0px)",
    flexGrow: 1,
  },
  speedDial: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const SpeedDialButton = (props) => {
  const actions = props.actions;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (name) => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        className={classes.speedDial}
        hidden={hidden}
        icon={<SpeedDialIcon openIcon={<AddIcon />} />}
        onClose={handleClose}
        onOpen={handleOpen}
        direction={props.direction}
        onDoubleClick={props.onDoubleClick}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.handleClick}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default SpeedDialButton;
