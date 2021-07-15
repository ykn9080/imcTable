import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { globalVariable } from "actions";
import useForceUpdate from "use-force-update";
import $ from "jquery";
import _ from "lodash";
import CardList from "components/Common/CardList";
import { ObjectID } from "bson"; //_id maker for MongoDB

const Body = (props) => {
  const forceUpdate = useForceUpdate();
  const history = useHistory();
  let ctrList;
  const dispatch = useDispatch();

  // const [editMode, setEditMode] = useState(false);
  // const [expanded, setExpanded] = useState(false);
  ctrList = useSelector((state) => state.global.control);
  let selectedKey = useSelector((state) => state.global.selectedKey);
  if (typeof ctrList == "undefined") ctrList = [];
  useEffect(() => {
    $(".MuiGrid-container").css({ overflow: "hidden" });
  }, [selectedKey]);
  ctrList = _.sortBy(ctrList, ["seq"]);
  // const handleExpandClick = () => {
  //   setExpanded(!expanded);
  // };
  const createControl = (ctrList) => {
    let maxseq = _.maxBy(ctrList, "seq");

    if (typeof maxseq === "undefined") maxseq = -1;
    else maxseq = maxseq.seq;
    const _id = new ObjectID();
    return {
      _id: _id,
      ctrid: "",
      type: "",
      seq: maxseq + 1,
      size: 6,
    };
  };
  const newData = createControl(ctrList);
  const addNewControl = (ctrList) => {
    //ctrList.push(makeNewControl(ctrList));
    console.log("addnew");
  };
  const removeControl = (ctrList) => {
    // // console.log(ctrList, _id);
    // ctrList.map((e, i) => {
    //   if (e.seq === _id) ctrList.splice(i, 1);
    // });
    dispatch(globalVariable({ control: ctrList }));
    forceUpdate();
  };

  const editControl = (data) => {
    history.push("/admin/form/formedit", { data });
  };
  const resizeControl = (ctrList) => {
    //dispatch(globalVariable({ control: ctrList }));
    //forceUpdate();
  };

  return (
    <div>
      <CardList
        cardType={"complex"}
        // dtList={ctrList}
        removeItemHandler={removeControl}
        resizeItemHandler={resizeControl}
        newData={newData}
        addItemHandler={addNewControl}
        editItemHandler={editControl}
      />
    </div>
  );
};

export default Body;

/* #region  drag drop sample */
// const applyDrag = (arr, dragResult) => {
//   const { removedIndex, addedIndex, payload } = dragResult;
//   if (removedIndex === null && addedIndex === null) return arr;
//   const result = [...arr];
//   let itemToAdd = payload;
//   if (removedIndex !== null) {
//     itemToAdd = result.splice(removedIndex, 1)[0];
//   }
//   if (addedIndex !== null) {
//     result.splice(addedIndex, 0, itemToAdd);
//   }
//   return result;
// };
// const generateItems = (count, creator) => {
//   const result = [];
//   for (let i = 0; i < count; i++) {
//     result.push(creator(i));
//   }
//   return result;
// };
// export const DragHandle = () => {
//   const [items, setItems] = useState(
//     generateItems(50, index => {
//       return {
//         id: index,
//         data: "Draggable" + index
//       };
//     })
//   );
//   return (
//     <div>
//       <div className="simple-page">
//         <Container
//           dragHandleSelector=".column-drag-handle"
//           onDrop={e => setItems(applyDrag(items, e))}
//         >
//           {items.map(p => {
//             return (
//               <Draggable key={p.id}>
//                 <div className="draggable-item">
//                   <Card
//                     title="Default size card"
//                     extra={<a href="#">More</a>}
//                     style={{ width: 300 }}
//                   >
//                     <span
//                       className="column-drag-handle"
//                       style={{ float: "left", padding: "0 10px" }}
//                     >
//                       &#x2630;
//                     </span>
//                     <p>Card content</p>
//                     <p>Card content</p>
//                     <p>Card content</p>
//                   </Card>
//                 </div>
//               </Draggable>
//             );
//           })}
//         </Container>
//       </div>
//     </div>
//   );
// };
/* #endregion */
