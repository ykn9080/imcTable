import _ from "lodash";
import * as alasql from "alasql"; //  alasql("DROP TABLE IF EXISTS `left`");
// alasql("CREATE TABLE left (seq number, phone string)");
// alasql(
//   "INSERT INTO left VALUES ('Paris',2249975),('Berlin',3517424),('Madrid',3041579)"
// );

export const JoinData = async (ar1, ar2, key, type) => {
  //sample data
  var arr1 = [{
    seq: 1,
    name: "tom"
  }, {
    seq: 2,
    name: "jane"
  }];
  var arr2 = [{
    seq: 1,
    phone: "iphone"
  }, {
    seq: 2,
    phone: "galaxy"
  }];
  if (ar1) arr1 = ar1;
  if (ar2) arr2 = ar2;

  if (typeof key === "object") {
    //if keys are different name update keys[1]->keys[0]
    let prop = {};
    prop.data = ar2;
    prop.updating = [key[0]];
    prop.current = [key[1]];
    arr2 = ReplaceKeys(prop);
    key = key[0];
  }

  if (!type) type = ""; //var qstr=`SELECT * FROM ? arr1 JOIN ? arr2 USING ${key}`;

  const qstr = `SELECT * FROM ? arr1 ${type.toUpperCase()} JOIN ? arr2 USING [${key}]`;
  var res = await alasql(qstr, [arr1, arr2]);
  return res;
};
export const ReplaceKeys = props => {
  // props.data = [{"id":"AD","name":"Andorra","currency":"EUR","timezone":"Europe/Andorra","links":[{"rel":"self","href":"http://localhost:8000/api/countries/AD"},{"rel":"country.currency","href":"http://localhost:8000/api/currencies/EUR"}]},{"id":"AE","name":"United Arab Emirates","currency":"AED","timezone":"Asia/Dubai","links":[{"rel":"self","href":"http://localhost:8000/api/countries/AE"},{"rel":"country.currency","href":"http://localhost:8000/api/currencies/AED"}]}];
  // props.updating=["value","title"];
  // props.current=["id","name"];
  // var result = props.data.map(function(o) {
  //   return Object.assign({
  //     value: o.id,
  //     title: o.name
  //   }, _.omit(o, 'id', 'name'));
  // });
  var result = props.data.map(function (o) {
    let obj = {};
    props.updating.map((k, i) => {
      obj[k] = o[props.current[i]];
      return null;
    });
    return Object.assign(obj, _.omit(o, `${props.current.join()}`));
  });
  return result;
};
export const Groupby = (dt, opt) => {
  let groupfields,
      valuefields,
      groupbytype = "SUM"; //sample

  let data = [{
    Phase: "Phase 1",
    Step: "Step 1",
    Value: 12,
    Value1: 112
  }, {
    Phase: "Phase 1",
    Step: "Step 2",
    Value: 35,
    Value1: 135
  }, {
    Phase: "Phase 2",
    Step: "Step 1",
    Value: 55,
    Value1: 155
  }, {
    Phase: "Phase 2",
    Step: "Step 2",
    Value: 55,
    Value1: 155
  }];
  groupfields = ["Phase"];
  valuefields = ["Value"];
  groupbytype = "AVG"; //qrystring sample: "SELECT Step, AVG([Value]) AS [Value] ,SUM([Value1]) AS [Value1] FROM ? GROUP BY  Step"

  let qrystring = "";

  if (opt && typeof opt === "object") {
    if (opt.groupfields) groupfields = opt.groupfields;
    if (opt.valuefields) valuefields = [opt.valuefields];
    if (opt.groupbytype) groupbytype = opt.groupbytype;
    let valuestring = "";
    valuefields.map((k, i) => {
      valuestring += `${groupbytype}([${k}]) AS [${k}] `;
      return null;
    }); //qrystring = `SELECT ${groupfields.join()}, ${groupbytype}([${valuefield}]) AS [${valuefield}] \

    qrystring = `SELECT ${groupfields.join()}, ${valuestring} \
    FROM ? GROUP BY ${groupfields.join()}`;
  } else qrystring = opt;

  if (dt) data = floatConvert(dt, valuefields);
  var res = alasql(qrystring, [data]);
  return res;
};

const floatConvert = (dt, valarr) => {
  dt.map((k, i) => {
    valarr.map((a, b) => {
      k[a] = parseFloat(k[a]);
      return null;
    });
    dt.splice(i, 1, k);
    return null;
  });
  return dt;
};

export const testGroup = num => {
  let data = [{
    Phase: "Phase 1",
    Step: "Step 1",
    Value: 12,
    Value1: 112
  }, {
    Phase: "Phase 1",
    Step: "Step 2",
    Value: 35,
    Value1: 135
  }, {
    Phase: "Phase 2",
    Step: "Step 1",
    Value: 55,
    Value1: 155
  }, {
    Phase: "Phase 2",
    Step: "Step 2",
    Value: 55,
    Value1: 155
  }];
  var qrystring = "SELECT Step, AVG([Value]) AS [Value] ,SUM([Value1]) AS [Value1] FROM ? GROUP BY  Step";
  var qrystring1 = "SELECT Step, AVG([Value]) AS [Value] FROM ? GROUP BY  Step";
  return alasql(num ? qrystring1 : qrystring, [data]);
};
export default JoinData;