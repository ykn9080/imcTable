import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import $ from "jquery";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CardAnt from "components/Common/CardAnt";
import { DeleteOutlined } from "@ant-design/icons";
import "components/Common/Antd.css";
import DialogWrap, { ConditionalWrap } from "components/SKD/FullScreenWrap";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const CardList = (props) => {
  //   const forceUpdate = useForceUpdate();
  let ctrList = useSelector((state) => state.global.control);
  let fullscreen = useSelector((state) => state.global.fullscreen);
  if (props.dtList) ctrList = props.dtList;
  console.log(ctrList);
  if (!ctrList) ctrList = [];
  const classes = useStyles();

  //   const history = useHistory();
  //  let dtList = props.dtList;
  const dispatch = useDispatch();

  //   const makeNewControl = dtList => {
  //     let maxseq = _.maxBy(dtList, "seq");

  //     if (typeof maxseq === "undefined") maxseq = -1;
  //     else maxseq = maxseq.seq;
  //     const _id = new ObjectID();
  //     return {
  //       _id: _id,
  //       ctrid: "",
  //       type: "",
  //       seq: maxseq + 1,
  //       size: 6
  //     };
  //   };

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
  }, [ReOrder, props.reorder]);

  const removeItemHandler = (_id) => {
    props.dtList.map((e, i) => {
      if (e._id === _id) return props.dtList.splice(i, 1);
      return null;
    });
    props.removeItemHandler(props.dtList);

    // dispatch(globalVariable({ control: dtList }));
    // forceUpdate();
  };
  const editItemHandler = (dt) => {
    props.editItemHandler(dt);
  };

  const actions = (index) => {
    return [
      <DeleteOutlined
        key="delete"
        onClick={() => {
          dispatch(globalVariable({ fullscreen: { index: !fullscreen } }));
        }}
      />,
    ];
  };

  return (
    <div>
      <Grid container className={classes.root} spacing={1} id="cardList123">
        {ctrList.map((dt, index) => {
          return (
            <Grid item xs={dt.size} key={dt._id}>
              {/* <CardForm
                cardStyle={props.cardType}
                removeItemHandler={removeItemHandler}
                resizeItemHandler={props.resizeItemHandler}
                editItemHandler={props.editItemHandler}
                data={dt}
                dtList={props.dtList}
              /> */}
              <ConditionalWrap
                wrap={(children) => <DialogWrap>{children}</DialogWrap>}
                index={index}
              >
                <React.Fragment key={dt.seq}>
                  <CardAnt
                    removeItemHandler={removeItemHandler}
                    resizeItemHandler={props.resizeItemHandler}
                    editItemHandler={editItemHandler}
                    data={dt}
                    seq={dt.seq}
                    extra1={actions(index)}
                    // dtList={props.dtList}
                    index={index}
                    key={dt._id}
                  >
                    {dt.content}
                  </CardAnt>
                </React.Fragment>
              </ConditionalWrap>
            </Grid>
          );
        })}
        {/* <Grid item xs={3} key={"add_new"} className="draggable-item">
          <CardForm data={props.newData} />
        </Grid> */}
      </Grid>
    </div>
  );
};

export default CardList;
