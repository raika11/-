import React from 'react';
import { default as RCTree } from 'rc-tree';
import PropTypes from 'prop-types';

const prototypes = {
    treeData: PropTypes.array.isRequired,
    onCheck: PropTypes.func,
};

const defaultProps = {
    treeData: [],
};

export const MokaRCTree = (props) => {
    const { treeData, onCheck, checkedKeys } = props;

    const onExpand = (expandedKeys) => {
        console.log(expandedKeys);
    };

    const onSelect = (selectedKeys, info) => {
        info.nativeEvent.preventDefault();
        info.nativeEvent.stopPropagation();
    };

    const handleCheck = (checkedKeys, info) => {
        if (onCheck instanceof Function) {
            onCheck(checkedKeys, info);
        }
    };

    return (
        <RCTree
            showLine
            checkable
            defaultExpandAll
            onExpand={onExpand}
            onSelect={onSelect}
            onCheck={handleCheck}
            onActiveChange={(key) => console.log('Active:', key)}
            checkedKeys={checkedKeys}
            treeData={treeData}
        />
    );
};

MokaRCTree.propTypes = prototypes;
MokaRCTree.defaultProps = defaultProps;
