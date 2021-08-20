import _ from "lodash";

function pickfromobject(object, key) {
  if (!key | !object) return;
  var parts = key.split(".");
  if (parts.length > 1) {
    var tempkey = parts.shift();
    if (!object[tempkey]) {
      return null;
    } else {
      if (object[tempkey].length > 0)
        return pickfromarray(object[tempkey], parts.join("."));
      else return pickfromobject(object[tempkey], parts.join("."));
    }
  } else {
    return object[parts[0]];
  }
}
function pickfromarray(array, key) {
  var parts = key.split(".");
  var rtn = [],
    tempkey = parts;
  if (parts.length > 1) {
    tempkey = parts.shift();
  }
  if ((array.length === 0) | !array[0][tempkey]) {
    return null;
  } else {
    array.map((k, i) => {
      if (typeof k[tempkey] === "string") {
        rtn.push(k[tempkey]);
      }
      return null;
    });
  }
  return rtn;
}

//var a = [{a: {c:{d:1,e:{f:100,g:190}}}, b:2}, {a:{c:{d:3,e:{f:101,g:191}}}, b:3}]
//console.log(pick(a, 'a.c.e.g'))=>[1,3]
export function pick(arr, key) {
  var result = [];
  if (arr)
    for (var i = 0; i < arr.length; i++) {
      const pp = pickfromobject(arr[i], key);
      if (pp) result.push(pp);
    }
  return result;
}

export function pickuniq(arr, key) {
  let arr1 = _.uniq(pick(arr, key));
  arr1.map((k, i) => {
    if (k === "undefined") arr1 = arr1.splice(i, 1);
    return null;
  });
  if (arr1[0] === "undefined") arr1 = [];
  return arr1;
}

export function pickMultiple(arr, keyarr) {
  //arr=[{a:1,b:2,c:3},{a:11,b:22,c:33}...], keyarr:["a","c"]
  //return [{a:1,c:3},{a:11,c:33}...]
  let rtnarr = [],
    obj = {};
  rtnarr = arr.map((k, i) => {
    if (typeof keyarr === "string") {
      obj = { ...obj, [keyarr]: k[keyarr] };
    } else {
      obj = keyarr.map((s, j) => {
        return { ...obj, [s]: k[s] };
      });
    }
    return obj;
  });
  return rtnarr;
}

export default function func() {
  return null;
}
//handle localStorage set,get,remove
// if data==="remove" removeItem
//update: localHandle("title",{data})
export const localHandle = (title, data) => {
  //if no data get
  if (data) {
    if (data === "remove") localStorage.removeItem(title);
    else localStorage.setItem(title, JSON.stringify(data));
  }
  //else set data
  else {
    let getitem = localStorage.getItem(title);
    if (getitem) return JSON.parse(getitem);
  }
};
