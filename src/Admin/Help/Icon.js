import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import IconButton1 from "components/Common/IconButton1";
import Help from "Admin/Help";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";

import { FaQuestionCircle } from "react-icons/fa";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none",
    backgroundColor: "#cccccc",
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  children: {
    flexGrow: 9,
  },
  appBar: {
    position: "relative",
  },
}));
export const Helpicon = () => {
  const dispatch = useDispatch();
  return (
    <IconButton1
      icon={
        <FaQuestionCircle
          style={{ fontSize: 22, marginTop: 0 }}
          onClick={() => dispatch(globalVariable({ openHelp: true }))}
        />
      }
      tooltip="Help"
      color="inherit"
    />
  );
};

const Helpdialog = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  let open = useSelector((state) => state.global.openHelp);
  //const [open, setOpen] = useState(false);

  const handleClose = () => {
    dispatch(globalVariable({ openHelp: false }));
  };
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar position="static" style={{ backgroundColor: "#161313" }}>
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" className={classes.title}>
            Help
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Help />
    </Dialog>
  );
};

export default Helpdialog;
