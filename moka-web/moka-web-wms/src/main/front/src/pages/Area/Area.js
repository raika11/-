import React, { Suspense, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { initialState, deleteArea, clearArea, getAreaListModal, clearStore } from '@store/area';
import toast, { messageBox } from '@utils/toastUtil';

const AreaList = React.lazy(() => import('./AreaList'));
const AreaEdit = React.lazy(() => import('./AreaEdit'));

/**
 * 편집영역관리
 */
const Area = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { areaDepth1, areaDepth2 } = useSelector((store) => ({
        areaDepth1: store.area.depth1.area,
        areaDepth2: store.area.depth2.area,
    }));

    /**
     * 삭제
     */
    const handleDelete = (area) => {
        dispatch(
            deleteArea({
                areaSeq: area.areaSeq,
                depth: area.depth,
                callback: ({ header, body }) => {
                    if (header.success && body) {
                        toast.success(header.message);
                        if (area.depth === 3) {
                            history.push(`/area/${areaDepth1.areaSeq}/${areaDepth2.areaSeq}`);
                            dispatch(clearArea(3));
                        } else if (area.depth === 2) {
                            history.push(`/area/${areaDepth1.areaSeq}`);
                            dispatch(clearArea(3));
                            dispatch(clearArea(2));
                        } else if (area.depth === 1) {
                            history.push('/area');
                            dispatch(clearArea(3));
                            dispatch(clearArea(2));
                            dispatch(clearArea(1));
                        }
                    } else {
                        toast.warning(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 삭제 버튼
     */
    const handleClickDelete = (area) => {
        if (area.depth === 3) {
            messageBox.confirm(
                '삭제하시겠습니까?',
                () => handleDelete(area),
                () => {},
            );
        } else {
            // 하위 편집영역이 있는지 조회
            dispatch(
                getAreaListModal({
                    search: {
                        ...(area.depth === 2 ? initialState.depth3.search : initialState.depth2.search),
                        parentAreaSeq: area.areaSeq,
                    },
                    callback: ({ header, body }) => {
                        if (header.success) {
                            if (body.list.length > 0) {
                                messageBox.confirm(
                                    '하위 편집영역이 모두 삭제됩니다.\n삭제하시겠습니까?',
                                    () => handleDelete(area),
                                    () => {},
                                );
                            } else {
                                messageBox.confirm(
                                    '삭제하시겠습니까?',
                                    () => handleDelete(area),
                                    () => {},
                                );
                            }
                        } else {
                            toast.warning(header.message);
                        }
                    },
                }),
            );
        }
    };

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>편집영역관리</title>
                <meta name="description" content="편집영역관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 편집영역 리스트 */}
            <Suspense>
                <AreaList match={match} onDelete={handleClickDelete} />
            </Suspense>

            {/* 편집영역 등록/수정 */}
            <Suspense>
                <AreaEdit onDelete={handleClickDelete} />
            </Suspense>
        </div>
    );
};

export default Area;
