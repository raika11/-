import React, { useRef } from 'react';
import 'rc-tree/assets/index.css';
import { default as RCTree, TreeNode } from 'rc-tree';
import PropTypes from 'prop-types';
import { MokaIcon } from '@components';

const prototypes = {
    treeData: PropTypes.array.isRequired,
    onCheck: PropTypes.func,
};

const defaultProps = {
    treeData: [],
};

export const MokaRCTree = (props) => {
    const { treeData, onCheck, checkedKeys } = props;
    const treeRef = useRef();

    const onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys);
    };

    const onSelect = (selectedKeys, info) => {
        info.nativeEvent.preventDefault();
        info.nativeEvent.stopPropagation();

        //console.log('selected', selectedKeys, info);
    };

    const handleCheck = (checkedKeys, info) => {
        if (onCheck instanceof Function) {
            onCheck(checkedKeys, info);
        }

        /*info.nativeEvent.preventDefault();
        info.nativeEvent.stopPropagation();*/
        //console.log('onCheck', checkedKeys, info);
    };

    const onEdit = () => {
        /*setTimeout(() => {
            console.log('current key: ', this.selKey);
        }, 0);*/
    };

    const onDel = (e) => {
        if (!window.confirm('sure to delete?')) {
            return;
        }
        e.stopPropagation();
    };

    const switcherIcon = (obj) => {
        return <MokaIcon iconName="fal-minus-circle" />;
    };

    const makeTreeNode = (treeInfos) => {
        return treeInfos.map((treeInfo) => {
            return (
                <TreeNode
                    title={treeInfo.title}
                    key={treeInfo.key}
                    className={'customIcon'}
                    selectable={treeInfo.selectable}
                    switcherIcon={treeInfo.children && switcherIcon}
                    icon={<MokaIcon iconName="fal-minus-circle" />}
                >
                    {treeInfo.children && makeTreeNode(treeInfo.children)}
                </TreeNode>
            );
        });
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
        >
            {makeTreeNode(treeData)}
        </RCTree>
    );
};

MokaRCTree.propTypes = prototypes;
MokaRCTree.defaultProps = defaultProps;
