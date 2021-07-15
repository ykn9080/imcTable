import { Button, Col, Row, Tooltip } from "antd";
import ModelTreeAnt, { makeFlatFromTree } from "components/Common/ModelTreeAnt";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { VscCollapseAll, VscExpandAll } from "react-icons/vsc";

const ModelDataTree = (props) => {
  const [tree, setTree] = useState(null);
  const [treeExpandKeys, setTreeExpandKeys] = useState();

  useEffect(() => {
    const tree1 = props.treeData;
    setTree(tree1);
    setTreeExpandKeys(findAllTreeKeys(tree1));
  }, []);

  const findAllTreeKeys = (tree1) => {
    //for initially open all nodes
    let trr = tree;
    if (tree1) trr = tree1;
    const trList = makeFlatFromTree(trr);
    let keyList = [];
    if (trList) {
      trList.map((k, i) => {
        keyList.push(k.key);
        return null;
      });
    }
    return _.uniq(keyList);
  };

  const genExtra = () => (
    <div style={{ marginTop: 5, marginBottom: 5 }}>
      <Row justify="space-between">
        <Col> </Col>
        <Col>
          <Tooltip title="Expand/Collapse All">
            <Button
              size="small"
              icon={
                treeExpandKeys && treeExpandKeys.length === 0 ? (
                  <VscExpandAll />
                ) : (
                  <VscCollapseAll />
                )
              }
              onClick={(e) => {
                if (treeExpandKeys && treeExpandKeys.length === 0)
                  setTreeExpandKeys(findAllTreeKeys());
                else setTreeExpandKeys([]);
              }}
            />
          </Tooltip>
        </Col>
      </Row>
    </div>
  );

  const onCheck = (val) => {
    if (props.onCheck) props.onCheck(val);
  };

  return (
    <>
      <div>
        {genExtra()}
        {tree && (
          <ModelTreeAnt
            treeData={tree}
            treeProps={{
              root: null,
            }}
            expandedKeys={treeExpandKeys}
            onCheck={onCheck}
          />
        )}
      </div>
    </>
  );
};

export default ModelDataTree;
