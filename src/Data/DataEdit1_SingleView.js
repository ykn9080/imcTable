import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import SingleTable from "Data/DataEdit1_SingleTable";
import Description from "components/SKD/Description";

const SingleView = (props) => {
  let tempData = useSelector((state) => state.global.tempData);
  let selectedKey1 = useSelector((state) => state.global.selectedKey1);
  const [summary, setSummary] = useState();
  useEffect(() => {
    const d1 = _.find(tempData.source, { key: selectedKey1 });
    if (d1) {
      let delar = d1?.setting?.delarr,
        delarr = "NA";
      let cal = d1?.setting?.column,
        calcolumn = "NA";
      let group = d1?.setting?.groupby,
        groupby = "NA";
      let jo = d1?.type,
        join = "NA";
      let cop = d1?.type,
        copy = "";
      let curr = d1?.type,
        currtype = "";
      if (cal) {
        const callist = _.filter(cal, (o) => {
          return o.calculaterule;
        });
        let cals = [];
        callist.map((k) => {
          cals.push(k.titletext);
          return null;
        });
        if (cals.length > 0) calcolumn = cals.join(",");
      }
      if (group) {
        groupby =
          group.fields.join(",") +
          ":" +
          group.groupby +
          "(" +
          group.values +
          ")";
      }
      if (delar && delar.length > 0) delarr = delar.join(",");
      if (jo && jo.lefttable) {
        let leftcontent = "",
          rightcontent = "";

        //find join table
        const leftsrc = _.find(tempData.source, (o) => {
          return o.key === jo.lefttable;
        });
        const rightsrc = _.find(tempData.source, (o) => {
          return o.key === jo.righttable;
        });
        if (leftsrc) leftcontent = leftsrc.title + "(" + jo.leftkey + ")";
        if (rightsrc) rightcontent = rightsrc.title + "(" + jo.rightkey + ")";
        join = leftcontent + " 〓 " + rightcontent;
      }
      if (cop && cop.stype === "copy") {
        const copysrc = _.find(tempData.source, (o) => {
          return o.key === cop.code;
        });
        if (copysrc) copy = "(" + copysrc.title + ")";
      }
      if (curr && curr.stype === "current data") {
        currtype = "(" + curr.subtype + ")";
      }
      let summary1 = {
        title: d1.title,
        description: d1.desc,
        key: d1.key,
        type: d1?.type?.stype + copy + currtype,
        groupby: groupby,
        ["Calulated Column"]: calcolumn,
        join: join,
        deleted: delarr,
      };
      if (d1.dtorigin) summary1 = { ...summary1, size: d1.dtorigin.length };
      setSummary(summary1);
    }
  }, []);

  return (
    <>
      <div style={{ padding: 5, border: "1px solid #d8d4d4" }}>
        {summary && <Description data={summary} />}
      </div>
      <SingleTable editable={false} />;
    </>
  );
};

export default SingleView;
