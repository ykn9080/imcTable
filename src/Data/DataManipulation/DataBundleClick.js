import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { currentsetting } from "config/index.js";
import { globalVariable } from "actions";
import MakeProjectBundle from "Project/ProjectBundle";

const DataBundleClick = ({ linkid }) => {
  const dispatch = useDispatch();
  let projectbundle = useSelector((state) => state.global.projectbundle);
  const [linknode_id, setLinknode_id] = useState();
  const [linkclick, setLinkclick] = useState(false);
  useEffect(() => {
    if (projectbundle === "") getProjectbundle(linkid);
  }, []);

  const getProjectbundle = (linkid) => {
    if (projectbundle === "") {
      const config = {
        method: "post",
        url: `${currentsetting.webserviceprefix}datasetbundle`,
        data: { ids: linkid },
      };
      axios(config).then((response) => {
        const list = response.data;
        dispatch(globalVariable({ projectbundle: list }));
        if (list.layer && list.layer.length > 0) {
          list.layer.map((k) => {
            setLinkclick(true);
            setLinknode_id(k._id);
            return null;
          });
        }
      });
    }
  };

  return linkclick && <MakeProjectBundle selectedKey={linknode_id} />;
};

export default DataBundleClick;
