import React from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import ArrowRight from "@material-ui/icons/ArrowRight";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconBtn from "components/Common/IconButton";

const useStyles = makeStyles((theme) => ({
  card: {
    // display: "block",
    // width: "30vw",
    // transitionDuration: "0.3s",
    // height: "45vw",
    // //maxWidth: "100%"
    // maxHeight: 400,
    // minHeight: 300,
    width: "100%",
    height: "100%",
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

export default (props) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  let card = useSelector((state) => state.global.card);
  let avataricon = (
      <Avatar aria-label="recipe" className={classes.avatar}>
        <IconBtn awesome="cat" fontSize="small" />
      </Avatar>
    ),
    moreaction = <MoreVertIcon />,
    title,
    subheader,
    img,
    imgtitle,
    cardcollapse,
    content;
  if (props.avataricon) avataricon = props.avataricon;
  if (props.moreaction) moreaction = props.moreaction;
  if (props.title) title = props.title;
  if (props.subheader) subheader = props.subheader;
  if (props.img) img = props.img;
  if (props.imgtitle) imgtitle = props.imgtitle;
  if (props.cardcollapse) cardcollapse = props.cardcollapse;
  if (props.content) content = props.content;
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const resizeControl = (ctrList, _id, direction) => {
    console.log(_id, direction);
    _.each(ctrList, function (value, key) {
      if (value._id === _id) {
        console.log(value.size);
        switch (direction) {
          case "left":
            if (value.size > 3) value.size = value.size - 1;
            break;
          case "right":
            if (value.size < 12) value.size = value.size + 1;
            break;
          default:
            return null;
        }
        console.log(value, value.size);
      }
    });
    card.resizeItemHandler(ctrList);
  };

  return (
    <>
      <Card className={classes.card} variant="outlined">
        <CardHeader
          avatar={
            avataricon
            // <Avatar aria-label="recipe" className={classes.avatar}>
            //   {avataricon}
            // </Avatar>
          }
          action={moreaction}
          title={title}
          subheader={subheader}
        />
        {img && (
          <CardMedia className={classes.media} image={img} title={imgtitle} />
        )}
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {content}
            {props.children}
          </Typography>
        </CardContent>
        {card.action && (
          <>
            <CardActions disableSpacing>
              <IconButton aria-label="edit">
                <EditIcon onClick={() => card.editItemHandler(card.data)} />
              </IconButton>{" "}
              <IconButton aria-label="delete">
                <DeleteIcon
                  onClick={() =>
                    card.removeItemHandler(card.dtList, card.data._id)
                  }
                />
              </IconButton>
              <IconButton aria-label="delete">
                <ArrowLeft
                  onClick={() =>
                    resizeControl(card.dtList, card.data._id, "left")
                  }
                />
              </IconButton>
              <IconButton aria-label="delete">
                <ArrowRight
                  onClick={() =>
                    resizeControl(card.dtList, card.data._id, "right")
                  }
                />
              </IconButton>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>{cardcollapse}</CardContent>
            </Collapse>
          </>
        )}
      </Card>
    </>
  );
};
