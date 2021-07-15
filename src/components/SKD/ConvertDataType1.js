import React, { useEffect, useState } from 'react';
import { Row, Radio, Input } from 'antd'
import _ from "lodash";

const ConvertToType = ({ fromType, selectToType }) => {
    const [toType, setToType] = useState();

    const onChangeValue = (e) => {
        setToType(e.target.value)
        return selectToType(e.target.value)
    }

    const fromNodeOptions = [
        { label: 'Raw Data', value: 'raw' },
        { label: 'Network(1-mode Network', value: 'network_1' },
        { label: 'Network(2-mode Network', value: 'network_2' }
    ]

    const fromRawOptions = [
        { label: 'Nodeset', value: 'nodeset' },
        { label: 'Network(1-mode Network)', value: 'network_1' },
        { label: 'Network(2-mode Network)', value: 'network_2' }
    ]

    const fromNetworkOptions = [
        { label: 'Raw', value: 'raw' },
    ]

    const fromImportDataOptions = [
        { label: 'Raw', value: 'raw' },
        { label: 'Nodeset', value: 'nodeset' },
        { label: 'Network(1-mode Network)', value: 'network_1' },
        { label: 'Network(2-mode Network)', value: 'network_2' }
    ]

    return (
        <div style={{ marginLeft: "10px" }}>
            <Radio.Group options={(() => {
                switch (fromType) {
                    case "nodeset":
                        return fromNodeOptions;
                    case "raw":
                        return fromRawOptions;
                    case "network":
                        return fromNetworkOptions;
                    case "fileImportData": case "dbImportData":
                        return fromImportDataOptions;
                    default:
                        return null;
                }
            })()} onChange={onChangeValue} value={toType} />
        </div>
    );
}

const ConvertDataType1 = ({ treeval, importData, onModalData, deactivateNext }) => {
    const [fromType, setFromType] = useState();
    const [toType, setToType] = useState();
    const [toName, setToName] = useState();
    const [toDesc, setToDesc] = useState();
    const [allData, setAllData] = useState();
    const [dataItemTitle, setDataItemTitle] = useState();
    const [dataItemId, setDataItemId] = useState();
    const [dataSetId, setDataSetId] = useState();
    const [dataItemType, setDataItemType] = useState();
    const [dataItemAttr, setDataItemAttr] = useState();
    const [fromTypeLabel, setFromTypeLabel] = useState();
    const [addHeader, setAddHeader] = useState();

    useEffect(() => {
        if (treeval) {
            setAllData(treeval)
            setDataItemTitle(treeval.title) //data item title
            setDataItemId(treeval._id) // data item current id - 5ef99d0b48fbce0ff854144a
            setDataSetId(treeval.pid) // parent id(dataset) of data item - 5ef99d0b48fbce0ff8541447
            setDataItemType(treeval.vtype) // from type of data item
            setDataItemAttr(treeval.attribute) //data item attribute
            switch (treeval.vtype[0]) {
                case "layer":
                    return setFromType("network")
                case "nodeset":
                    return setFromType("nodeset")
                case "rawdataset":
                    return setFromType("raw");
                default:
                    return null;
            }
        }
    }, [treeval])

    useEffect(() => {
        if (importData) {
            setFromType(importData.fromType);
            setDataSetId(importData.datasetID);
            if(importData.addHeader) {
                setAddHeader(importData.addHeader);
            }
        }
    }, [importData])

    useEffect(() => {
        if (fromType === "network") {
            setFromTypeLabel("Network")
        } else if (fromType === "nodeset") {
            setFromTypeLabel("Nodeset")
        } else if (fromType === "raw") {
            setFromTypeLabel("Raw Data")
        } else if (fromType === "fileImportData") {
            setFromTypeLabel("File Import Data")
        } else if (fromType === "dbImportData") {
            setFromTypeLabel("DB Import Data")
        }
    }, [fromType])

    useEffect(() => {
        deactivateNext(!toName || !toType);
        if (fromType === "nodeset" || fromType === "network" || fromType === "raw") {
            let convertData = { dataItem_ID: `${dataItemId}`, fromType: fromType, toType: toType, name: toName, desc: toDesc }
            inputTreeSelectData(convertData)
        } else if (fromType === "fileImportData") {
            let convertData = { datasetID: `${dataSetId}`, fromType: fromType, toType: toType, name: toName, desc: toDesc, addHeader: addHeader }
            inputImportData(convertData)
        } else if (fromType === "dbImportData") {
            let convertData = { datasetID: `${dataSetId}`, fromType: fromType, toType: toType, name: toName, desc: toDesc }
            inputImportData(convertData)
        }
    }, [toType, toName, toDesc])

    const onChangeToName = (e) => {
        setToName(e.target.value)
    }
    const onChangeToDesc = (e) => {
        setToDesc(e.target.value)
    }

    const selectToType = (toType) => {
        setToType(toType)
    }

    const inputTreeSelectData = (convertData) => {
        return onModalData(convertData)
    }

    const inputImportData = (convertData) => {
        return onModalData(convertData)
    }

    return (
        <>
            <Row>
                <div style={{ marginLeft: "30px" }}> Convert Data Type from <b style={{ fontSize: 15, color: "blue" }}>{fromTypeLabel}</b> to </div>
                <div style={{ width: "100%" }}>
                    <ConvertToType fromType={fromType} selectToType={selectToType} />
                </div>
                <div style={{ width: "100%" }}>Name</div>
                <Input width="300" onChange={onChangeToName}></Input>
                <div style={{ width: "100%" }}>Description</div>
                <Input width="300" onChange={onChangeToDesc}></Input>
            </Row>
        </>
    )
}

export default ConvertDataType1;
