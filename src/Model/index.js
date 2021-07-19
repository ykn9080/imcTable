import React from "react";
import DenseAppBar from "components/Common/AppBar";
import ModelList from "Model/ModelList";
import ModelView from "Model/ModelView";
import ModelEdit from "Model/ModelEdit";
import ModelGraph from "Model/Authoring/ModelGraph";
import ModelAuthor from "Model/Authoring/ModelAuthor";
import ModelDemo from "components/Common/ReactGridLayout2";
import ModelViewDemo from "Model/ModelViewDemo";

const Model = ({ match }) => {
  let title = match.params.name,
    titleUpper = "";
  if (typeof match.params.child != "undefined") title = match.params.child;
  if (typeof match.params.grandchild != "undefined")
    title = match.params.grandchild;

  if (title) {
    titleUpper = title.charAt(0).toUpperCase() + title.slice(1);
    title = title.toLowerCase();
  }
  //const [adminMenu, setAdminMenu] = useState([]);

  return (
    <>
      {/* {["model"].indexOf(title) === -1 ? (
        <PageHead title={titleUpper} />
      ) : null} */}
      {(() => {
        switch (title) {
          case "list":
            return (
              <>
                <DenseAppBar title={"Model"}></DenseAppBar>
                <ModelList type={title} />
              </>
            );
          case "view":
          default:
            return (
              <>
                <ModelView />
              </>
            );

          case "edit":
            return (
              <>
                <ModelEdit />
              </>
            );
          case "demo":
            return (
              <>
                <ModelDemo />
              </>
            );
          case "fix":
            return (
              <>
                <ModelViewDemo />
              </>
            );
          case "graph":
            return (
              <>
                <ModelGraph />
              </>
            );
          case "author":
            return (
              <>
                <ModelAuthor />
              </>
            );
        }
      })()}
    </>
  );
};

export default Model;
