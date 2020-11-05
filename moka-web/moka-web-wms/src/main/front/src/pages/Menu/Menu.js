import React, { useState, Suspense } from 'react';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { clearStore } from '@store/menu';
import toast from '@/utils/toastUtil';
import { changeSearchOption, deleteMenu, existAuth } from '@store/menu';
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
    const [largeMenuId, setLargeMenuId] = useState([]);
    const [middleMenuId, setMiddleMenuId] = useState([]);
    const [smallMenuId, setSmallMenuId] = useState([]);
    const [parentMenuId, setParentMenuId] = useState(rootParentMenuId);
    const [depth, setDepth] = useState('');
    const [menuId, setMenuId] = useState([]);

    const { listMiddle, listSmall } = useSelector(
        (store) => ({
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

    const handleSaveOrder = () => {};

    const handleNewMenu = (event) => {
        const btnDepth = event.currentTarget.getAttribute('depth');
        const btnParentMenuId = event.currentTarget.getAttribute('parentmenuid');

        if (typeof btnParentMenuId !== 'undefined' && btnParentMenuId.length > 0) {
            setMenuSearchInfo(0, btnDepth, '', btnParentMenuId);
        } else {
            toast.warn('상위 메뉴를 선택하세요.');
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

        toast.confirm(
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
                <title>메뉴관리</title>
                <meta name="description" content="메뉴관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>
            {/* 리스트 */}
            <MokaCard
                className="mr-gutter"
                headerClassName="pb-0 d-flex justify-content-between align-items-center"
                bodyClassName="pt-0"
                title="대메뉴"
                width={LIST_WIDTH}
                height={CARD_DEFAULT_HEIGHT}
                buttons={[
                    // 메뉴 추가 버튼
                    {
                        className: 'p-0 mr-10',
                        depth: '1',
                        parentmenuid: rootParentMenuId,
                        onClick: handleNewMenu,
                        icon: <MokaIcon iconName="fal-plus" />,
                    },
                    // 메뉴 순서변경 저장 버튼
                    {
                        className: 'p-0',
                        depth: '1',
                        parentmenuid: rootParentMenuId,
                        onClick: handleSaveOrder,
                        icon: <MokaIcon iconName="fal-save" />,
                    },
                ]}
            >
                <Suspense>
                    <MenuLargeLIst handleRowClicked={handleRowClicked} menuId={largeMenuId} parentMenuId={rootParentMenuId} depth="1" />
                </Suspense>
            </MokaCard>
            <MokaCard
                className="mr-gutter"
                headerClassName="pb-0 d-flex justify-content-between align-items-center"
                bodyClassName="pt-0"
                title="중메뉴"
                width={LIST_WIDTH}
                height={CARD_DEFAULT_HEIGHT}
                buttons={[
                    // 메뉴 추가 버튼
                    {
                        className: 'p-0 mr-10',
                        depth: '2',
                        parentmenuid: largeMenuId,
                        onClick: handleNewMenu,
                        icon: <MokaIcon iconName="fal-plus" />,
                    },
                    // 메뉴 순서변경 저장 버튼
                    {
                        className: 'p-0',
                        depth: '2',
                        parentmenuid: largeMenuId,
                        onClick: handleSaveOrder,
                        icon: <MokaIcon iconName="fal-save" />,
                    },
                ]}
            >
                <Suspense>
                    <MenuMiddleLIst handleRowClicked={handleRowClicked} parentMenuId={largeMenuId} menuId={middleMenuId} depth="2" />
                </Suspense>
            </MokaCard>
            <MokaCard
                className="mr-gutter"
                headerClassName="pb-0 d-flex justify-content-between align-items-center"
                bodyClassName="pt-0"
                title="소메뉴"
                width={LIST_WIDTH}
                height={CARD_DEFAULT_HEIGHT}
                buttons={[
                    // 메뉴 추가 버튼
                    {
                        className: 'p-0 mr-10',
                        depth: '3',
                        parentmenuid: middleMenuId,
                        onClick: handleNewMenu,
                        icon: <MokaIcon iconName="fal-plus" />,
                    },
                    // 메뉴 순서변경 저장 버튼
                    {
                        className: 'p-0',
                        depth: '3',
                        parentmenuid: middleMenuId,
                        onClick: handleSaveOrder,
                        icon: <MokaIcon iconName="fal-save" />,
                    },
                ]}
            >
                <Suspense>
                    <MenuSmallLIst handleRowClicked={handleRowClicked} parentMenuId={middleMenuId} menuId={smallMenuId} depth="3" />
                </Suspense>
            </MokaCard>
            <Suspense>
                <MenuEditContainer handleClickDelete={handleClickDelete} menuSeq={menuSeq} parentMenuId={parentMenuId} depth={depth} />
            </Suspense>
        </div>
    );
};

export default Menu;
