import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Helpdialog, { Helpicon } from "Admin/Help/Icon";

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
  helpButton: {
    position: "absolute",
    right: theme.spacing(4),
    top: theme.spacing(-0.3),
    color: theme.palette.grey[500],
  },
});
export default function DialogSelect(props) {
  const dispatch = useDispatch();
  let open1 = useSelector((state) => state.global.openDialog1);
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    setOpen(open1);
  }, [open1]);
  useEffect(() => {
    dispatch(
      globalVariable({ helpLink: "/admin/control/form/formedit?type=control" })
    );
  }, []);
  const handleClose = () => {
    setOpen(false);
    dispatch(globalVariable({ openDialog1: false }));
  };

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
        <IconButton
          aria-label="help"
          className={classes.helpButton}
          onClick={() => {
            dispatch(globalVariable({ openHelp: true }));
          }}
        >
          <Helpicon />
        </IconButton>
      </MuiDialogTitle>
    );
  });
  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth={true}
        maxWidth={"xl"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Fill the form
        </DialogTitle>
        <DialogContent>{props.children}</DialogContent>
        <DialogActions>
          {props.dialogAction}
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Helpdialog />
    </div>
  );
}
