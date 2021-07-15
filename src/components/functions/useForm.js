import  { useState } from "react";

const useForm = (callback, props) => {
  const [values, setValues] = useState({});
  const handleSubmit = event => {
    if (event) event.preventDefault();
    callback(...Object.values(values));
  };
  const handleSubmitCallback = async event => {
    if (event) event.preventDefault();
    console.log(props, values);
    values.props = props;
    console.log(...Object.values(values));
    callback(...Object.values(values));
  };
  const handleChange = event => {
    event.persist();
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value
    }));
  };
  return {
    handleChange,
    handleSubmit,
    handleSubmitCallback,
    values
  };
};
export default useForm;
