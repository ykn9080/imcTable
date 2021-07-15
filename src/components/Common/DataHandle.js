import React from "react";
import BootFormDisplay from "./BootFormDisplay";

const DataHandle = () => {
  const formArray1 = [
    {
      controlId: "url",
      labelText: "URL",
      name: "url",
      controlType: "input",
      placeholder: "url"
    },
    {
      controlId: "method",
      labelText: "Method",
      name: "method",
      controlType: "select",
      optionArray: [
        { text: "Get", value: "get" },
        { text: "Post", value: "post" },
        { text: "Put", value: "put" },
        { text: "Delete", value: "delete" }
      ]
    }
  ];
  let [formArray, setFormArray] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${currentsetting.webserviceprefix}bootform/id?pathname=${props.pathname}`
      )
      .then(function(response) {
        // if (response.data.data != "undefined")
        setFormArray(JSON.parse(response.data[0].data));
      })
      .catch(function(error) {
        console.log(error);
      });
  }, []);
  return <BootFormDisplay formArray={formArray1} />;
};

export default DataHandle;
