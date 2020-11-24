import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { changeGroupMenuAuthInfo, getGroupMenuList, updateGroupMenuAuth } from '@store/group';
import clsx from 'clsx';
import { MokaRCTree } from '@components/MokaTree';
import Button from 'react-bootstrap/Button';
import { Link, NavLink } from 'react-router-dom';
import toastUtil from '@utils/toastUtil';

const GroupChildGroupMenuTree = () => {
    const { menuAuthInfo, groupCd } = useSelector(
        (store) => {
            return {
                menuAuthInfo: store.group.menuAuthInfo,
                groupCd: store.group.group.groupCd,
            };
        },

        shallowEqual,
    );

    const [customMenus, setCustomMenus] = useState([]);
    const dispatch = useDispatch();

    const checkEditedChildes = (key, edited, list) => {
        let hasEditedChild = false;
        list.map((menu) => {
            if (menu.key === key) {
                let length = menu.children.length;
                menu.children.map((child) => {
                    hasEditedChild = hasEditedChild || edited.includes(child.key);
                    if (edited.includes(child.key)) {
                        length--;
                    }
                });
            }
        });

        if (hasEditedChild) {
            edited = [...edited, key];
        } else {
            edited = edited.filter((id) => id !== key);
        }

        return edited;
    };

    const handleClickChange = (classList, info) => {
        const { key: menuId, parentKey } = info;
        const menuIds = [menuId];
        let edited = menuAuthInfo.edited;
        const used = menuAuthInfo.used;
        const halfCheckKeys = menuAuthInfo.halfCheckedKeys;

        const list = menuAuthInfo.list;
        if (used.includes(menuId) || halfCheckKeys.includes(menuId)) {
            list.map((menu) => {
                if (menu.key === menuId) {
                    if (menu.children) {
                        menu.children.map((child) => {
                            if (used.includes(child.key)) {
                                menuIds.push(child.key);
                            }
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

            if (parentKey) {
                edited = checkEditedChildes(parentKey, edited, list);
            }
            dispatch(changeGroupMenuAuthInfo({ name: 'edited', value: edited }));
        }
    };

    const customLabel = (info, isUsed, isEdited) => {
        const { title } = info;
        return (
            <div className="cus-label">
                <span>{title}</span>
                <span
                    className={clsx('rc-tree-checkbox', isEdited && 'rc-tree-checkbox-checked', !isUsed && 'rc-tree-checkbox-disabled')}
                    onClick={(e) => {
                        e.stopPropagation();
                        const {
                            target: { classList },
                        } = e;
                        handleClickChange(classList, info);
                    }}
                />
            </div>
        );
    };

    const makeCustomLabelMenu = (list) => {
        //console.log('make', menuAuthInfo);
        const data = [];
        list.map((item) => {
            const key = item.key;
            const isEdited = menuAuthInfo.edited.includes(key);
            let isUsed = menuAuthInfo.used.includes(key) || menuAuthInfo.halfCheckedKeys.includes(key);
            const title = customLabel(item, isUsed, isEdited);

            let children = null;
            if (item.children) {
                children = makeCustomLabelMenu(item.children);
            }

            data.push({
                ...item,
                title: title,
                children,
                /*switcherIcon: item.children && <MokaIcon iconName="fal-minus-circle" />,
                icon: <MokaIcon iconName="fal-minus-circle" />,*/
            });
        });

        return data;
    };

    const hanldeTreeCheck = (checkMenus, info) => {
        const halfCheckedKeys = info.halfCheckedKeys;
        const list = menuAuthInfo.list;
        const oldEdited = menuAuthInfo.edited;
        let edited = [];

        checkMenus.map((menuId) => {
            const filterMenuId = oldEdited.filter((id) => id === menuId);
            if (filterMenuId) {
                edited = [...edited, ...filterMenuId];
            }
        });

        info.halfCheckedKeys.map((halfCheckedKey) => {
            /*if (!edited.includes(halfCheckedKey)) {
                edited = [...edited, halfCheckedKey];
            }*/
            edited = checkEditedChildes(halfCheckedKey, edited, list);
        });

        dispatch(changeGroupMenuAuthInfo({ name: 'used', value: checkMenus }));
        dispatch(changeGroupMenuAuthInfo({ name: 'edited', value: edited }));
        dispatch(changeGroupMenuAuthInfo({ name: 'halfCheckedKeys', value: halfCheckedKeys }));
    };

    const handleClickSave = () => {
        let changeMenuAuthList = [];
        const edited = menuAuthInfo.edited;
        const used = [...menuAuthInfo.used, ...menuAuthInfo.halfCheckedKeys];

        used.map((menuId) => {
            const usedYn = 'Y';
            const editYn = edited.includes(menuId) ? 'Y' : 'N';
            const vidwYn = 'Y';

            changeMenuAuthList = [...changeMenuAuthList, { menuId, usedYn, editYn, vidwYn }];
        });

        dispatch(
            updateGroupMenuAuth({
                groupCd,
                changeMenuAuthList,
                callback: (response) => {
                    if (response.body) {
                        dispatch(getGroupMenuList(groupCd));
                    }
                    toastUtil.result(response);
                },
            }),
        );
    };

    useEffect(() => {
        if (menuAuthInfo.list) {
            const menu = makeCustomLabelMenu(menuAuthInfo.list);
            setCustomMenus(menu);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuAuthInfo]);

    return (
        <>
            <MokaRCTree treeData={customMenus} checkedKeys={customMenus.length > 0 && menuAuthInfo.used} onCheck={hanldeTreeCheck} />
            <Button variant="positive" className="mr-2" onClick={handleClickSave}>
                저장
            </Button>
        </>
    );
};

export default GroupChildGroupMenuTree;
