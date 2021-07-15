import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import $ from "jquery";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CardAnt from "components/Common/CardAnt";
import { Button } from "antd";

import "components/Common/Antd.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const CardList = (props) => {
  //   const forceUpdate = useForceUpdate();
  let ctrList = useSelector((state) => state.global.control);
  if (props.dtList) ctrList = props.dtList;
  // if (!ctrList) ctrList = [];
  const classes = useStyles();

  //   const history = useHistory();
  //  let dtList = props.dtList;
  const dispatch = useDispatch();

  const ReOrder = (start_pos, end_pos) => {
    const list = _.filter(ctrList, (o) => {
      return (o.seq === start_pos) | (o.seq === end_pos);
    });
    const leftover = _.filter(ctrList, (o) => {
      return o.seq !== start_pos && o.seq !== end_pos;
    });
    if (list.length === 2) {
      const imsi = list[0].seq;
      list[0].seq = list[1].seq;
      list[1].seq = imsi;
    }
    const merged = [].concat(list, leftover);
    dispatch(globalVariable({ control: merged }));
    // let arr = formdt;
    // const _id = arr._id;
    // let newArr = [];
    // let list = _.sortBy(arr.data.list, ["seq"]);
    // if (start_pos < end_pos)
    //   _.forEach(list, function (value, key) {
    //     if (value.type !== "button") {
    //       if (value.seq <= end_pos && value.seq > start_pos) value.seq--;
    //       else if (value.seq === start_pos) value.seq = end_pos;
    //     }
    //     newArr.push(value);
    //   });
    // if (start_pos > end_pos)
    //   _.forEach(list, function (value, key) {
    //     if (value.type !== "button") {
    //       if (value.seq >= end_pos && value.seq < start_pos) value.seq++;
    //       else if (value.seq === start_pos) value.seq = end_pos;
    //     }
    //     newArr.push(value);
    //   });
    // arr.data.list = newArr;
    // setFormdt(arr);
    // setFormArray(arr.data);
    // dispatch(globalVariable({ currentData: arr }));
    //st>ed -> st prev +1 st->ed
  };
  useEffect(() => {
    if (props.reorder) {
      let $node = $("#cardList123");
      //let $node = $(".makeStyles-root-499");
      //$(".draggable-item").resizable();
      $node.sortable({
        opacity: 0.8,
        placeholder: "ui-state-highlight",
        start: function (event, ui) {
          var start_pos = ui.item.index();
          ui.item.data("start_pos", start_pos);
        },
        update: function (event, ui) {
          var start_pos = ui.item.data("start_pos");
          var end_pos = ui.item.index();
          //$('#sortable li').removeClass('highlights');
          ReOrder(start_pos, end_pos);
        },
      });
      $(".draggable-item").resizable();
      return () => {
        $node.sortable({
          placeholder: "ui-state-highlight",
        });
      };
    }
  }, []);

  // const removeItemHandler = (_id) => {
  //   props.dtList.map((e, i) => {
  //     if (e._id === _id) return props.dtList.splice(i, 1);
  //     return null
  //   });
  //   props.removeItemHandler(props.dtList);

  //   // dispatch(globalVariable({ control: dtList }));
  //   // forceUpdate();
  // };

  // const actions = (index) => {
  //   return [
  //     <DeleteOutlined
  //       key="delete"
  //       onClick={() => {
  //         let set = { ...fullscreen, index: !fullscreen[index] };
  //         dispatch(globalVariable({ fullscreen: { index: !fullscreen } }));
  //       }}
  //     />,
  //   ];
  // };
  let addtext = "+ Add New";
  if (props.addtext) addtext = props.addtext;
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Button
          type="dashed"
          style={{
            width: 250,
            height: 40,
          }}
          onClick={props.addNew}
        >
          {addtext}
        </Button>
      </div>

      <Grid container className={classes.root} spacing={1} id="cardListSKD">
        {ctrList &&
          ctrList.map((dt, index) => {
            console.log(dt);
            return (
              <Grid item xs={dt.size} key={dt._id}>
                <CardAnt
                // removeItemHandler={removeItemHandler}
                // resizeItemHandler={props.resizeItemHandler}
                // editItemHandler={editItemHandler}
                // removeItemHandler={removeItemHandler}
                // seq={dt.seq}
                // title={dt.title}
                // // extra1={actions(index)}
                // // dtList={props.dtList}
                // index={index}
                // key={dt._id}
                >
                  {dt.content}
                </CardAnt>
              </Grid>
            );
          })}
      </Grid>
    </div>
  );
};

export default CardList;
