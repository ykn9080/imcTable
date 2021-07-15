import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// const GreenCheckbox = withStyles({
//   root: {
//     color: green[400],
//     "&$checked": {
//       color: green[600]
//     }
//   },
//   checked: {}
// })(props => <Checkbox color="primary" {...props} />);

const CheckboxLabels = props => {
  const [state, setState] = React.useState(false);

  const handleChange = event => {
    setState(!state);
    props.handleChange(!state);
  };

  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox checked={state} onChange={handleChange} name="checkedA" />
        }
        label="Edit"
      />
    </FormGroup>
  );
};

export default CheckboxLabels;
