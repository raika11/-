import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { MokaRCTree } from '@components/MokaTree';
import commonUtil from '@utils/commonUtil';

/**
 * 메뉴 권한 관리를 위한 RC-Tree Cutom Tree
 * @param menuAuthInfo 메뉴 권한 정보(TreeData)
 * @param onChange 변경 이벤트
 * @returns 메뉴 권한 관리를 위한 RC-Tree Cutom Tree
 * @constructor
 */
const MenuAuthTree = ({ menuAuthInfo, onChange }) => {
    const [customTreeInfos, setCustomTreeInfos] = useState([]);

    /**
     * 메뉴 USED CheckBox 변경 이벤트
     * @param checkKeys RC-Tree에서 전달받은 Check된 Tree Key 리스트
     * @param info RC-Tree에서 전달받은 메뉴 정보
     */
    const handleClickUsedChange = (checkKeys, info) => {
        const halfCheckedKeys = info.halfCheckedKeys;
        const list = menuAuthInfo.list;
        const key = info.node.key;

        if (!info.checked) {
            let edited = menuAuthInfo.edited.filter((id) => id !== key);
            const nodeInfo = commonUtil.findNode(list, key);

            if (nodeInfo.children) {
                const childrenKeys = commonUtil.findChildNodeKeys(list, nodeInfo);
                edited = edited.filter((id) => !childrenKeys.includes(id));
            }

            const parentNodeKeys = commonUtil.findParentNodeKeys(list, nodeInfo);
            for (const parentNodeKey of parentNodeKeys) {
                const parentNode = commonUtil.findNode(list, parentNodeKey);
                const childNodeKeys = commonUtil.findChildNodeKeys(list, parentNode);

                if (checkKeys.filter((id) => childNodeKeys.includes(id)).length === 0 || edited.filter((id) => childNodeKeys.includes(id)).length === 0) {
                    edited = edited.filter((id) => id !== parentNodeKey);
                }
            }
            onChange({ name: 'edited', value: edited });
        }
        onChange({ name: 'used', value: checkKeys });
        onChange({ name: 'halfCheckedKeys', value: halfCheckedKeys });
    };

    /**
     * 메뉴 EDIT CheckBox 변경 이벤트
     * @param info 메뉴 정보
     */
    const handleClickEditChange = useCallback(
        (info) => {
            const { key } = info;
            let edited = menuAuthInfo.edited;
            const used = menuAuthInfo.used;
            const halfCheckKeys = menuAuthInfo.halfCheckedKeys;
            const list = menuAuthInfo.list;

            if (used.includes(key) || halfCheckKeys.includes(key)) {
                const childKeys = commonUtil.findChildNodeKeys(list, info);
                const parentKeys = commonUtil.findParentNodeKeys(list, info);

                if (!edited.includes(key)) {
                    const hasUsedEditingKeys = [...childKeys, ...parentKeys, key].filter((id) => used.includes(id) || halfCheckKeys.includes(id));
                    edited = [...edited, ...hasUsedEditingKeys];
                } else {
                    [key, ...childKeys].forEach((removeId) => {
                        edited = edited.filter((id) => id !== removeId);
                    });

                    for (const parentKey of parentKeys) {
                        const nodeInfo = commonUtil.findNode(list, parentKey);
                        const nodeChildKeys = commonUtil.findChildNodeKeys(list, nodeInfo);
                        if (edited.filter((id) => nodeChildKeys.includes(id)).length === 0) {
                            edited = edited.filter((id) => id !== parentKey);
                        }
                    }
                }
                onChange({ name: 'edited', value: edited });
                //dispatch(changeGroupMenuAuthInfo({ name: 'edited', value: edited }));
            }
        },
        [menuAuthInfo, onChange],
    );

    /**
     * Edit CheckBox가 포함 된 Tree Cutom Label을 만든다
     * @param info 메뉴 정보
     * @param isUsed 사용 여부
     * @param isEdited 수정 여부
     * @returns Custom Label
     */
    const makeCustomLabel = useCallback(
        (info, isUsed, isEdited, index) => {
            const { title } = info;
            return (
                <div className="cus-label">
                    <span>{title}</span>
                    <span
                        className={clsx(
                            'edit-checkbox',
                            'rc-tree-checkbox',
                            isEdited && 'rc-tree-checkbox-checked',
                            !isUsed && 'rc-tree-checkbox-disabled',
                            index && `rc-tree-use-checkbox-${index}`,
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClickEditChange(info);
                        }}
                    />
                </div>
            );
        },
        [handleClickEditChange],
    );

    /**
     * Custom Label로 구성된 Tree Data를 만든다.
     * @param orgTreeData Tree Data
     * @returns Custom Label로 구성된 Tree Data
     */
    const makeCustomLabelTreeData = useCallback(
        (orgTreeData, order) => {
            const treeData = [];
            for (const item of orgTreeData) {
                let index = 1;
                if (order) {
                    index = order;
                }
                const key = item.key;
                const isEdited = menuAuthInfo.edited.includes(key);
                let isUsed = menuAuthInfo.used.includes(key) || menuAuthInfo.halfCheckedKeys.includes(key);
                const title = makeCustomLabel(item, isUsed, isEdited, index);
                let children = null;
                if (item.children) {
                    index++;
                    children = makeCustomLabelTreeData(item.children, index);
                }

                treeData.push({
                    ...item,
                    title: title,
                    children,
                    /*switcherIcon: item.children && <MokaIcon iconName="fal-minus-circle" />,
                icon: <MokaIcon iconName="fal-minus-circle" />,*/
                });
            }

            return treeData;
        },
        [makeCustomLabel, menuAuthInfo],
    );

    useEffect(() => {
        if (menuAuthInfo && menuAuthInfo.list) {
            const tree = makeCustomLabelTreeData(menuAuthInfo.list);
            setCustomTreeInfos(tree);
        }
    }, [makeCustomLabelTreeData, menuAuthInfo]);

    return (
        <>
            <MokaRCTree treeData={customTreeInfos} checkedKeys={customTreeInfos.length > 0 && menuAuthInfo.used} onCheck={handleClickUsedChange} />
        </>
    );
};

export default MenuAuthTree;
