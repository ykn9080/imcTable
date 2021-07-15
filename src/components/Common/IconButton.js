import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { loadCSS } from "fg-loadcss";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import { Button } from "antd";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    "& > .fa": {
      margin: theme.spacing(2),
    },
  },
}));

const IconBtn = (props) => {
  //props={tooltip""this is deete", children: < DeleteIcon />,  handleClick: ()=>console.log('hhh')
  //, color:primary,secondary,default,inherit,transparant, aria-label:"screen reader only label", aria-controls:"main" }
  //Example
  // <IconBtn tooltip="this is example" handleClick={() => history.push("/")} color="primary" >
  //   <HomeIcon />;
  // </IconBtn>
  const classes = useStyles();
  React.useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  let iconProps = {},
    handleClick;
  let aweProps = {};
  if (props.fontSize) aweProps = { ...aweProps, fontSize: props.fontSize };
  if (props.style) aweProps = { ...aweProps, style: props.style };
  if (props.onClick) aweProps = { ...aweProps, onClick: props.onClick };
  if (props.style) aweProps = { ...aweProps, style: props.style };
  if (props.id) aweProps = { ...aweProps, id: props.id };

  if (props.handleClick) {
    handleClick = props.handleClick;
    iconProps = { ...iconProps, handleClick };
  }
  if (props.color) iconProps = { ...iconProps, color: props.color };
  if (props["aria-label"]) {
    iconProps = { ...iconProps, "aria-label": props["aria-label"] };
    aweProps = { ...aweProps, "aria-label": props["aria-label"] };
  }
  if (props["aria-controls"]) {
    iconProps = { ...iconProps, "aria-controls": props["aria-controls"] };
    aweProps = { ...aweProps, "aria-controls": props["aria-controls"] };
  }

  if (props.color) iconProps = { ...iconProps, color: props.color };
  const fontawe = `fa fa-${props.awesome}`;

  return (
    <div className={classes.root}>
      <Tooltip title={props.tooltip}>
        {props.btntype === "ant" ? (
          <Button
            {...iconProps}
            icon={
              props.awesome ? (
                <Icon className={fontawe} {...aweProps} />
              ) : (
                props.icon
              )
            }
          >
            {props.children}
          </Button>
        ) : (
          <IconButton {...iconProps}>
            {props.children}
            {props.awesome ? (
              <Icon className={fontawe} {...aweProps} />
            ) : (
              props.icon
            )}
          </IconButton>
        )}
      </Tooltip>
    </div>
  );
};

export default IconBtn;
