import React from "react";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import useForceUpdate from "use-force-update";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import AddIcon from "@material-ui/icons/Add";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
    minHeight: 340,
    width: "auto",
  },
  cardDot: {
    borderStyle: "dashed",
    paddingTop: 50,
    maxHeight: 400,
    minHeight: 300,
    color: "grey",
  },
  icon: {
    margin: "0 auto",
  },
  media: {
    height: 0,
    //paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const CardSimple = (props) => {
  const classes = useStyles();
  const forceUpdate = useForceUpdate();
  const dispatch = useDispatch();
  const history = useHistory();
  const [expanded, setExpanded] = React.useState(false);
  const [checked, setChecked] = React.useState({});
  const handleChange = (event) => {
    setChecked({ ...checked, [event.target.name]: event.target.checked });
    console.log(checked, props);
  };
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const removeHandler = () => {
    setExpanded(!expanded);
  };
  const BlankCard = (data) => {
    return (
      <Card className={classes.cardDot}>
        <CardHeader style={{ textAlign: "center" }} title="Add New" />
        <CardActions>
          <IconButton aria-label="add" className={classes.icon}>
            <AddIcon
              style={{ fontSize: 50 }}
              onClick={() => {
                history.push("/controls", { data });
              }}
            />
          </IconButton>
        </CardActions>
      </Card>
    );
  };

  //if (props.data.ctrid === "") return <BlankCard data={props.data} />;

  return (
    <div className="gridcontent">
      <Card className={classes.card}>
        <CardContent>{props.children}</CardContent>
      </Card>
    </div>
  );
};

export default CardSimple;
