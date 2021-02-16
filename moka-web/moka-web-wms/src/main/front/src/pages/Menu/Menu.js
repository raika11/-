import React, { useState, Suspense } from 'react';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { changeOrderChildren, clearStore, getMenuList } from '@store/menu';
import toast, { messageBox } from '@/utils/toastUtil';
import { changeSearchOption, deleteMenu, existAuth } from '@store/menu';
import MenuDraggableAgGrid from '@pages/Menu/component/MenuDraggableAgGrid';
import Button from 'react-bootstrap/Button';
import commonUtil from '@utils/commonUtil';
const MenuLargeLIst = React.lazy(() => import('./MenuLargeLIst'));
const MenuMiddleLIst = React.lazy(() => import('./MenuMiddleLIst'));
const MenuSmallLIst = React.lazy(() => import('./MenuSmallLIst'));

const MenuEditContainer = React.lazy(() => import('./MenuEditContainer'));
const LIST_WIDTH = 300;

/**
 * 메뉴 관리
 */
const Menu = () => {
    const dispatch = useDispatch();
    const rootParentMenuId = '00';
    const [menuSeq, setMenuSeq] = useState('');
    const [largeMenuId, setLargeMenuId] = useState(null);
    const [middleMenuId, setMiddleMenuId] = useState(null);
    const [smallMenuId, setSmallMenuId] = useState(null);
    const [parentMenuId, setParentMenuId] = useState(rootParentMenuId);
    const [depth, setDepth] = useState('');
    const [menuId, setMenuId] = useState([]);
    const [largeOrderList, setLargeOrderList] = useState(null);
    const [middleOrderList, setMiddleOrderList] = useState(null);
    const [smallOrderList, setSmallOrderList] = useState(null);

    const { listLarge, listMiddle, listSmall } = useSelector(
        (store) => ({
            listLarge: store.menu.listLarge,
            listMiddle: store.menu.listMiddle,
            listSmall: store.menu.listSmall,
        }),
        shallowEqual,
    );

    React.useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    const handleRowClicked = (rowData) => {
        setMenuSearchInfo(rowData.menuSeq, rowData.depth, rowData.menuId, rowData.parentMenuId);
    };

    const handleSaveOrder = (parentId, menus, init) => {
        if (commonUtil.isEmpty(menus)) {
            toast.warning('변경된 사항이 없습니다.');
        } else {
            const saveMenuOrderList = menus.map((menu) => ({
                menuId: menu.menuId,
                menuOrder: menu.menuOrder,
            }));

            dispatch(
                changeOrderChildren(parentId, saveMenuOrderList, (response) => {
                    toast.result(response);
                    if (init instanceof Function) {
                        init(null);
                    }
                }),
            );
        }
    };

    const handleNewMenu = (event) => {
        const btnDepth = event.currentTarget.getAttribute('depth');
        const btnParentMenuId = event.currentTarget.getAttribute('parentmenuid');

        if (typeof btnParentMenuId !== 'undefined' && btnParentMenuId.length > 0) {
            setMenuSearchInfo(0, btnDepth, '', btnParentMenuId);
        } else {
            toast.warning('상위 메뉴를 선택하세요.');
        }
    };

    const setMenuSearchInfo = (menuSeq, depth, menuId, parentmenuId) => {
        setMenuSeq(menuSeq);
        setMenuId(menuId);
        setDepth(depth);
        setParentMenuId(parentmenuId);
        switch (Number(depth)) {
            case 1:
                setLargeMenuId(menuId);
                setMiddleMenuId('');
                setSmallMenuId('');
                break;
            case 2:
                setMiddleMenuId(menuId);
                setSmallMenuId('');
                break;
            default:
                setSmallMenuId(menuId);
                break;
        }
    };
    /**
     *  메뉴 삭제
     * @param {object} response response
     */
    const handleClickDelete = (event) => {
        event.preventDefault();
        event.stopPropagation();

        messageBox.confirm(
            `삭제하시겠습니까?`,
            () => {
                let isSubList = false;
                if (Number(depth) === 1) {
                    if (listMiddle.length > 0) {
                        isSubList = true;
                    }
                } else if (Number(depth) === 2) {
                    if (listSmall.length > 0) {
                        isSubList = true;
                    }
                }
                if (isSubList) {
                    toast.error('하위 메뉴가 존재하여 삭제할 수 없습니다.');
                } else {
                    dispatch(
                        existAuth({
                            menuId,
                            actions: [
                                changeSearchOption({
                                    depth: depth,
                                    parentMenuId: parentMenuId,
                                    useTotal: false,
                                }),
                            ],
                            callback: (response) => {
                                const { header } = response;
                                const { body } = response;
                                if (body === false) {
                                    dispatch(
                                        deleteMenu({
                                            menuId: menuId,
                                            callback: (response) => {
                                                const { header } = response;
                                                const { body } = response;
                                                if (body.success === true && header.success) {
                                                    if (body.parentMenu !== null) {
                                                        setMenuSearchInfo(body.parentMenu.menuSeq, body.parentMenu.depth, body.parentMenu.menuId, body.parentMenuId);
                                                    } else {
                                                        setMenuSearchInfo(0, 1, '', '00');
                                                    }
                                                    toast.success(header.message);
                                                } else {
                                                    toast.error(header.message);
                                                }
                                            },
                                        }),
                                    );
                                } else {
                                    toast.error(header.message);
                                }
                            },
                        }),
                    );
                }
            },
            () => {},
        );
    };

    return (
        <div className="d-flex">
            <Helmet>
                <title>메뉴 관리</title>
                <meta name="description" content="메뉴 관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>
            {/* 리스트 */}
            <MokaCard
                className="mr-gutter"
                headerClassName="d-flex justify-content-between align-items-center"
                bodyClassName="d-flex flex-column"
                title="대메뉴"
                width={LIST_WIDTH}
                height={CARD_DEFAULT_HEIGHT}
            >
                <div className="mb-2 d-flex justify-content-end">
                    <Button depth="1" parentmenuid={rootParentMenuId} variant="positive" className="mr-10" onClick={handleNewMenu}>
                        등록
                    </Button>
                    <Button
                        depth="1"
                        parentmenuid={rootParentMenuId}
                        variant="positive"
                        onClick={() => {
                            handleSaveOrder(rootParentMenuId, largeOrderList, setLargeOrderList);
                        }}
                    >
                        저장
                    </Button>
                </div>
                <Suspense>
                    {/*<MenuLargeLIst handleRowClicked={handleRowClicked} menuId={largeMenuId} parentMenuId={rootParentMenuId} depth="1" />*/}
                    <MenuDraggableAgGrid
                        onRowClicked={handleRowClicked}
                        menuId={largeMenuId}
                        parentMenuId={rootParentMenuId}
                        depth="1"
                        onChange={(data) => {
                            setLargeOrderList(data);
                        }}
                        list={listLarge}
                    />
                </Suspense>
            </MokaCard>
            <MokaCard
                className="mr-gutter"
                headerClassName="d-flex justify-content-between align-items-center"
                bodyClassName="d-flex flex-column"
                title="중메뉴"
                width={LIST_WIDTH}
                height={CARD_DEFAULT_HEIGHT}
            >
                <div className="mb-2 d-flex justify-content-end">
                    <Button depth="2" parentmenuid={largeMenuId} variant="positive" className="mr-10" onClick={handleNewMenu}>
                        등록
                    </Button>
                    <Button
                        depth="2"
                        parentmenuid={largeMenuId}
                        variant="positive"
                        onClick={() => {
                            handleSaveOrder(largeMenuId, middleOrderList, setMiddleOrderList);
                        }}
                    >
                        저장
                    </Button>
                </div>
                <Suspense>
                    {/*<MenuMiddleLIst handleRowClicked={handleRowClicked} parentMenuId={largeMenuId} menuId={middleMenuId} depth="2" />*/}
                    <MenuDraggableAgGrid
                        onRowClicked={handleRowClicked}
                        menuId={middleMenuId}
                        parentMenuId={largeMenuId}
                        depth="2"
                        onChange={(data) => {
                            setMiddleOrderList(data);
                        }}
                        list={listMiddle}
                    />
                </Suspense>
            </MokaCard>
            <MokaCard
                className="mr-gutter"
                headerClassName="d-flex justify-content-between align-items-center"
                bodyClassName="d-flex flex-column"
                title="소메뉴"
                width={LIST_WIDTH}
                height={CARD_DEFAULT_HEIGHT}
            >
                <div className="mb-2 d-flex justify-content-end">
                    <Button depth="3" parentmenuid={middleMenuId} variant="positive" className="mr-10" onClick={handleNewMenu}>
                        등록
                    </Button>
                    <Button
                        depth="3"
                        parentmenuid={middleMenuId}
                        variant="positive"
                        onClick={() => {
                            handleSaveOrder(middleMenuId, smallOrderList, setSmallOrderList);
                        }}
                    >
                        저장
                    </Button>
                </div>
                <Suspense>
                    {/*<MenuSmallLIst handleRowClicked={handleRowClicked} parentMenuId={middleMenuId} menuId={smallMenuId} depth="3" />*/}
                    <MenuDraggableAgGrid
                        onRowClicked={handleRowClicked}
                        menuId={smallMenuId}
                        parentMenuId={middleMenuId}
                        depth="3"
                        onChange={(data) => {
                            setSmallOrderList(data);
                        }}
                        list={listSmall}
                    />
                </Suspense>
            </MokaCard>
            <Suspense>
                <MenuEditContainer handleClickDelete={handleClickDelete} menuSeq={menuSeq} parentMenuId={parentMenuId} depth={depth} />
            </Suspense>
        </div>
    );
};

export default Menu;
