import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";

// const ControlList = () => {
//   return(
//    null
//   );
// }
const TextList = () => {
  return (
    <List>
      <ListItem button>
        <ListItemText primary="Phone ringtone" secondary="Titania" />
      </ListItem>
      <Divider />
      <ListItem button>
        <ListItemText
          primary="Default notification ringtone"
          secondary="Tethys"
        />
      </ListItem>
    </List>
  );
};

const ControlList = () => {
  return <TextList />;
};

export default ControlList;
