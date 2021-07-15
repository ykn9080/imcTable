import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ConditionalWrap = ({ wrap, children, index }) => {
  let open = useSelector((state) => state.global.fullscreen);
  open = open.index;
  return open ? wrap(children) : children;
};
const DialogWrap = ({ children, index }) => {
  const dispatch = useDispatch();
  let fullscreen = useSelector((state) => state.global.fullscreen);
  let open = fullscreen.index;
  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(globalVariable({ fullscreen: { index: !fullscreen } }));
      }}
      TransitionComponent={Transition}
    >
      {children}
    </Dialog>
  );
};

export const AppBarWrap = ({ children }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  let open = useSelector((state) => state.global.fullscreen);
  const [fulldialog, setFulldialog] = useState(false);
  return (
    <Dialog
      fullScreen={fulldialog}
      open={open}
      onClose={() => dispatch(globalVariable({ fullscreen: false }))}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => dispatch(globalVariable({ fullscreen: false }))}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.title}>
            Sound
          </Typography>
          <Button
            autoFocus
            color="inherit"
            onClick={() => dispatch(globalVariable({ fullscreen: false }))}
          >
            save
          </Button>
          <Button
            autoFocus
            color="inherit"
            onClick={() => setFulldialog(!fulldialog)}
          >
            fullscreen
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </Dialog>
  );
};
export function CustomizedDialogs({ children }) {
  const dispatch = useDispatch();
  let open = useSelector((state) => state.global.fullscreen);

  const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });
  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent);

  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  const handleClose = () => {
    dispatch(globalVariable({ fullscreen: false }));
  };

  return (
    <div>
      <Dialog
        aria-labelledby="customized-dialog-title"
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Modal title
        </DialogTitle>
        <DialogContent dividers>{children}</DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DialogWrap;
