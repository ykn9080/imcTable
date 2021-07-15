import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import DenseAppBar from "./AppBar";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogFull(props) {
  let setting = {};
  if (props.fullScreen) setting = { fullScreen: true };
  if (props.maxWidth) setting = { ...setting, maxWidth: props.maxWidth };
  const dispatch = useDispatch();
  //const [open, setOpen] = React.useState(false);
  let open = useSelector((state) => state.global.openDialog);
  //   useEffect(() => {
  //     setOpen(props.open);
  //   }, [props.open]);
  const handleClose = () => {
    open = false;
    dispatch(globalVariable({ openDialog: false }));
  };
  const right = (
    <IconButton
      edge="start"
      color="inherit"
      onClick={handleClose}
      aria-label="close"
    >
      <CloseIcon />
    </IconButton>
  );
  return (
    <>
      <Dialog
        {...setting}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DenseAppBar title={props.title} right={right}></DenseAppBar>
        {props.children}
      </Dialog>
    </>
  );
}
