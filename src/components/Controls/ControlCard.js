import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { globalVariable } from "actions";
import useForceUpdate from "use-force-update";
import $ from "jquery";
import _ from "lodash";
import CardList from "components/Common/CardList";
import { ObjectID } from "bson"; //_id maker for MongoDB


const ControlCard = props => {
  const forceUpdate = useForceUpdate();
  const history = useHistory();
  let ctrList;
  const dispatch = useDispatch();

  ctrList = useSelector(state => state.global.control);
  let selectedKey = useSelector(state => state.global.selectedKey);
  if (typeof ctrList == "undefined") ctrList = [];
  useEffect(() => {
    $(".MuiGrid-container").css({ overflow: "hidden" });
  }, [selectedKey]);
  ctrList = _.sortBy(ctrList, ["seq"]);

  const createControl = ctrList => {
    let maxseq = _.maxBy(ctrList, "seq");

    if (typeof maxseq === "undefined") maxseq = -1;
    else maxseq = maxseq.seq;
    const _id = new ObjectID();
    return {
      _id: _id,
      ctrid: "",
      type: "",
      seq: maxseq + 1,
      size: 6
    };
  };
  const newData = createControl(ctrList);
  const addNewControl = ctrList => {
    //ctrList.push(makeNewControl(ctrList));
    dispatch(globalVariable({ control: ctrList }));
    forceUpdate();
  };
  const removeControl = ctrList => {
    dispatch(globalVariable({ control: ctrList }));
    forceUpdate();
  };

  const editControl = data => {
    //history.push("/controls", { data });
    console.log(data);
    history.push("/controledit1", { data });
  };
  const resizeControl = ctrList => {
    dispatch(globalVariable({ control: ctrList }));
    forceUpdate();
  };
  return (
    <div>
      <CardList
        cardType={"complex"}
        dtList={ctrList}
        removeItemHandler={removeControl}
        resizeItemHandler={resizeControl}
        newData={newData}
        addItemHandler={addNewControl}
        editItemHandler={editControl}
      />
    </div>
  );
};

export default ControlCard;
