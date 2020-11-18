import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { changeGroupMenu, DELETE_GROUP, GET_GROUP, removeGroupMenuEditAuth, SAVE_GROUP } from '@store/group';
import clsx from 'clsx';
import { MokaRCTree } from '@components/MokaTree';

const GroupChildGroupMenuTree = () => {
    const { menuAuthInfo } = useSelector(
        (store) => {
            return {
                menuAuthInfo: store.group.menuAuthInfo,
            };
        },

        shallowEqual,
    );

    const [customMenus, setCustomMenus] = useState([]);
    const dispatch = useDispatch();

    const handleClickChange = (classList, menuId) => {
        const menuIds = [menuId];
        let edited = menuAuthInfo.edited;
        const used = menuAuthInfo.used;
        if (used.includes(menuId)) {
            menuAuthInfo.list.map((menu) => {
                if (menu.key === menuId) {
                    if (menu.children) {
                        menu.children.map((child) => {
                            menuIds.push(child.key);
                        });
                    }
                }
            });
            if (!edited.includes(menuId)) {
                edited = [...edited, ...menuIds];
            } else {
                menuIds.map((removeId) => {
                    edited = edited.filter((id) => id !== removeId);
                });
            }

            dispatch(changeGroupMenu({ ...menuAuthInfo, edited }));
        }
    };

    const customLabel = (title, isUsed, isEdit, menuId, isNotWholeChildEdit) => {
        return (
            <div className="cus-label">
                <span>{title}</span>
                <span
                    className={clsx(
                        'rc-tree-checkbox',
                        isEdit && 'rc-tree-checkbox-checked',
                        !isUsed && 'rc-tree-checkbox-disabled',
                        isNotWholeChildEdit && isUsed && 'rc-tree-checkbox-indeterminate',
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        const {
                            target: { classList },
                        } = e;
                        handleClickChange(classList, menuId);
                    }}
                />
            </div>
        );
    };

    const makeCustomLabelMenu = () => {
        const customParentData = [];
        menuAuthInfo.list.map((parent) => {
            const isParentEdit = menuAuthInfo.edited.includes(parent.key);
            const isParentUsed = menuAuthInfo.used.includes(parent.key) || menuAuthInfo.halfCheckedKeys.includes(parent.key);
            let children = null;
            let childrenLength = 0;
            if (parent.children) {
                childrenLength = parent.children.length;
                children = parent.children.map((child) => {
                    const isChildUsed = menuAuthInfo.used.includes(child.key);
                    const isChildEdit = menuAuthInfo.edited.includes(child.key);
                    if (isChildEdit) {
                        childrenLength--;
                    }
                    const childTitle = customLabel(child.title, isChildUsed, isChildEdit, child.key);
                    return { ...child, title: childTitle };
                });
            }
            let isNotWholeChildEdit = childrenLength > 0;
            const parentTitle = customLabel(parent.title, isParentUsed, isParentEdit, parent.key, isNotWholeChildEdit);
            customParentData.push({ ...parent, title: parentTitle, children });
        });

        setCustomMenus(customParentData);
    };

    useEffect(() => {
        if (menuAuthInfo.list) {
            console.log(menuAuthInfo);
            makeCustomLabelMenu();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuAuthInfo]);

    const hanldeTreeCheck = (checkMenus, info) => {
        const halfCheckedKeys = info.halfCheckedKeys;
        const oldEdited = menuAuthInfo.edited;
        let edited = [];
        checkMenus.map((menuId) => {
            const filterMenuId = oldEdited.filter((id) => id === menuId);
            if (filterMenuId) {
                edited = [...edited, ...filterMenuId];
            }
        });

        /*info.halfCheckedKeys.map((halfCheckedKey) => {
            if (!edited.includes(halfCheckedKey)) {
                edited = [...edited, halfCheckedKey];
            }
        });*/
        dispatch(changeGroupMenu({ ...menuAuthInfo, used: checkMenus, edited, halfCheckedKeys }));
    };

    return <MokaRCTree treeData={customMenus} checkedKeys={customMenus.length > 0 && menuAuthInfo.used} onCheck={hanldeTreeCheck}></MokaRCTree>;
};

export default GroupChildGroupMenuTree;
