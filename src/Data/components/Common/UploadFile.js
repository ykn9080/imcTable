import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./upload.css";
import { makeStyles } from "@material-ui/core/styles";
import { currentsetting } from "../../config/index.js";
import { notification, message, Spin } from "antd";
import { FolderOpenOutlined } from "@ant-design/icons";
import AntList from "./List";
import {
  AiOutlineFileExcel,
  AiOutlineFileGif,
  AiOutlineFileJpg,
  AiOutlineFileZip,
  AiOutlineFileImage,
  AiFillFileUnknown,
  AiOutlineFileMarkdown,
} from "react-icons/ai";
import { GrDocumentCsv, GrDocumentTxt } from "react-icons/gr";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  spincenter: {
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
    marginBottom: 20,
    paddingLeft: 30,
    paddingRight: 50,
    marginLeft: 20,
    marginRight: 0,
  },
}));

const UploadFile = (props) => {
  let dir = "/data/datasrc/";
  let accept; // "py,txt,xls,xlsx,csv";
  let size = 200;
  if (props.accept) accept = props.accept;
  if (props.dir) dir = props.dir;
  if (props.size) size = props.size;

  const classes = useStyles();
  const fileRef = useRef();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [listData, setListData] = useState();

  useEffect(() => {
    if (props.listData) {
      const rtn = updateListData(props.listData);
      setListData(rtn);
    }
  }, [props.listData]);
  useEffect(() => {
    let listdt = [];
    if (listData) listdt = listData;
    if (selectedFile) listdt.push(selectedFile);

    const rtn = updateListData(listdt);
    setListData(rtn);
  }, [selectedFile]);
  const updateListData = (listdt) => {
    let imsiData1 = [];

    listdt.map((k, i) => {
      const filetype = k.name.split(".").pop();
      return imsiData1.push({
        name: k.name,
        description: sizeShortForm(k.size),
        size: k.size,
        filepath: dir + k.name,
        avatar: {
          size: 32,
          style: { backgroundColor: k.filepath ? "#4169E1" : "#E0218A" },
          shape: "square",
          icon: (() => {
            switch (filetype) {
              case "xls":
              case "xlsx":
                return <AiOutlineFileExcel />;
              default:
                return (
                  <>
                    <AiFillFileUnknown />
                  </>
                );
              case "csv":
                return <GrDocumentCsv />;
              case "txt":
                return <GrDocumentTxt />;
              case "zip":
                return <AiOutlineFileZip />;
              case "gif":
                return <AiOutlineFileGif />;
              case "jpg":
                return <AiOutlineFileJpg />;
              case "png":
                return <AiOutlineFileImage />;
              case "nmf":
                return <AiOutlineFileMarkdown />;
            }
          })(),
        },
        content: k.filepath ? (
          <span style={{ color: "#4169E1" }}>uploaded</span>
        ) : (
          <span
            style={{
              color: "#E0218A",
            }}
          >
            waiting for uploading...
          </span>
        ),
      });
    });
    return imsiData1;
  };

  const sizeShortForm = (size) => {
    let count = 0;
    if (!size) return false;
    let siz = parseInt(size);
    while (siz !== 0) {
      siz = parseInt(siz / 10);
      ++count;
    }
    if (count <= 3) return size + "byte";
    else if (count <= 6) return parseInt(size / 1000) + "KB";
    else if (count <= 9) return parseInt(size / 1000000) + "MB";
    else return parseInt(size / 1000000000) + "GB";
  };

  function getFileExtension3(filename) {
    return filename.split(".").pop();
  }
  const onChangeFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const openNotificationWithIcon = (type, message, description, placement) => {
    notification[type]({
      message: [message],
      description: [description],
      placement,
    });
  };
  const onUploadHandler = () => {
    let acceptarr;
    if (accept) acceptarr = accept.split(",");
    if (
      acceptarr &&
      selectedFile &&
      acceptarr.indexOf("." + getFileExtension3(selectedFile.name)) === -1
    ) {
      openNotificationWithIcon(
        "error",
        "Error",
        "File extension should be py, Try again",
        "bottomRight"
      );
      fileRef.current = "";
      return false;
    }
    const data = new FormData();
    data.append("dir", dir);
    data.append("file", selectedFile);
    data.append("size", size);

    let axiosConfig = {
      headers: {
        keepfilename: true,
      },
    };
    setOpen(true);
    const uploading = new Promise((resolve, reject) => {
      let url = `${currentsetting.webserviceprefix}uploadfile`;
      if (props.type === "importNMF")
        url = `http://src.netminer.com:9403/importNMF`;
      else if (props.type === "importFile")
        url = `http://192.168.3.58:8011/importFile/readFile`;
      axios.post(url, data, axiosConfig).then((res) => {
        message.success("File successfully uploaded.");
        if (res.data.length === 0) reject("no data");
        resolve(res);
        setOpen(false);

        console.log("result::: ", res);
      });
    });
    Promise.all([uploading]).then((result) => {
      let farr = result[0];
      farr.size = size;
      //filepath include
      let listData1 = [...listData];
      listData1.map((k, i) => {
        if (k.name === farr.originalname) {
          k.filepath = farr.filepath;
          k.splice(i, 1, k);
        }
        return null;
      });

      const rtn = updateListData(listData1);
      setListData(rtn);
      if (props.uploadedData) {
        props.uploadedData(farr);
        setListData(null);
      }
    });
  };
  const deleteHandler = (item) => {
    const deleteitem = (item) => {
      let listData1 = [...listData];
      _.remove(listData1, function (currentObject) {
        return currentObject.name === item.name;
      });
      setListData(listData1);
      return listData1;
    };
    if (props.type) {
      deleteitem(item);
    } else {
      let config = {
        method: "post",
        url: `${currentsetting.webserviceprefix}deletefile`,
        data: {
          filepath: dir + item.name, //"/data/datasrc/리회원관.xlsx",
        },
      };
      axios(config)
        .then((r) => {
          if (props.deleteHandler) {
            props.deleteHandler({ item });
          }
        })
        .catch((e) => {
          console.log(e);
          if (props.deleteHandler) {
            props.deleteHandler({ result: "error", item });
          }
        });
    }
  };

  return (
    <>
      <div className={"dvFileuploader"}>
        <label className="custom-file-upload">
          <input
            type="file"
            name="file"
            multiple
            placeholder="select file"
            onChange={onChangeFile}
            onClick={(e) => (e.target.value = null)}
            ref={fileRef}
            accept={accept}
          />
          <FolderOpenOutlined /> Select file...
        </label>
        <button
          type="button"
          className="btn btn-success "
          onClick={onUploadHandler}
        >
          Upload
        </button>
      </div>
      {listData && listData.length > 0 && (
        <AntList
          listData={listData}
          search={false}
          loading={false}
          deleteHandler={deleteHandler}
          size={"small"}
          layout={"horizontal"}
        />
      )}

      <div className={classes.spincenter}>{open && <Spin />}</div>
    </>
  );
};

export default UploadFile;
