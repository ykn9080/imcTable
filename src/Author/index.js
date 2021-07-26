import React from "react";
import AuthorTable from "Author/AuthorTable";

const Author = ({ match }) => {
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
      {(() => {
        switch (title) {
          case "table":
            return (
              <>
                <AuthorTable />
              </>
            );
        }
      })()}
    </>
  );
};

export default Author;
