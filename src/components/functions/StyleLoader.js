import React from "react";
//send css url thru props
//<StyleLoader path={"https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.css"} />
const StyleLoader = ({ path }) => {
  return <link rel="stylesheet" type="text/css" href={path} />;
};
export const JSLoader = ({ path }) => {
  return <script type="text/javascript" src={path} />;
};

//********* */ use case append/remove Script ****************
// useEffect(() => {
//   const scriptt="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.css"
//   appendScript(scriptt)
// return () => {
//   removeScript(scriptt)
//   }
// }, []);
export const appendScript = (scriptToAppend) => {
  const script = document.createElement("script");
  script.src = scriptToAppend;
  script.async = true;
  document.body.appendChild(script);
};
export const removeScript = (scriptToremove) => {
  let allsuspects = document.getElementsByTagName("script");
  for (let i = allsuspects.length; i >= 0; i--) {
    if (
      allsuspects[i] &&
      allsuspects[i].getAttribute("src") !== null &&
      allsuspects[i].getAttribute("src").indexOf(`${scriptToremove}`) !== -1
    ) {
      allsuspects[i].parentNode.removeChild(allsuspects[i]);
    }
  }
};
export default StyleLoader;
