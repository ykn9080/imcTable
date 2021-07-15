import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    height: 300,
  },
  tabpanels: {
    width: "100%",
  },
}));

export default function MuTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  //let tf1 = useSelector((state) => state.global.tf1); //create new
  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
    console.log(event, newValue);
  };
  //   var tabArray = ["tab1", "tab2"];
  //   var tabpanelArray = [
  //     <CardGroup />,
  //     <CardGroup gridStyle={{ width: "200px" }} />,
  //   ];
  console.log(props.tabPanelArray);
  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        {props.tabArray.map((k, i) => {
          return <Tab label={k} {...a11yProps(i)} />;
        })}
      </Tabs>
      {props.tabPanelArray.map((k, i) => {
        return (
          <TabPanel className={classes.tabpanels} value={value} index={i}>
            {k}
          </TabPanel>
        );
      })}
    </div>
  );
}
