import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { initialState, deleteArea, clearStore, getAreaListModal } from '@store/area';
import { AREA_HOME } from '@/constants';
import toast, { messageBox } from '@utils/toastUtil';
import AreaAgGridDepth1 from './AreaAgGridDepth1';
import AreaAgGridDepth2 from './AreaAgGridDepth2';
import AreaAgGridDepth3 from './AreaAgGridDepth3';
const AreaEdit = React.lazy(() => import('./AreaEdit'));
const it = new Date().getTime();

/**
 * 편집영역 관리
 */
const Area = () => {
    const dispatch = useDispatch();
    const [areaDepth1, setAreaDepth1] = useState(initialState.initData);
    const [areaDepth2, setAreaDepth2] = useState(initialState.initData);
    const [areaDepth3, setAreaDepth3] = useState(initialState.initData);
    const [listDepth1, setListDepth1] = useState([]);
    const [listDepth2, setListDepth2] = useState([]);
    const [listDepth3, setListDepth3] = useState([]);
    const [flag, setFlag] = useState({ depth1: it, depth2: it, depth3: it }); // 리스트 조회 플래그
    const [sourceCode, setSourceCode] = useState(AREA_HOME[0].value);

    /**
     * 삭제
     * @param {object} area 편집영역 데이터
     * @param {number} depth 뎁스
     */
    const executeDel = useCallback(
        (area, depth) => {
            dispatch(
                deleteArea({
                    areaSeq: area.areaSeq,
                    depth: depth,
                    callback: ({ header, body }) => {
                        if (header.success && body) {
                            toast.success(header.message);
                            const nt = new Date().getTime();
                            if (depth === 1) {
                                setFlag({ depth1: nt, depth2: nt, depth3: nt });
                                setAreaDepth1(initialState.initData);
                            } else if (depth === 2) {
                                setFlag({ ...flag, depth2: nt, depth3: nt });
                                setAreaDepth2(initialState.initData);
                            } else {
                                setFlag({ ...flag, depth3: nt });
                                setAreaDepth3(initialState.initData);
                            }
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        },
        [dispatch, flag],
    );

    /**
     * 삭제 버튼
     * @param {object} area 편집영역 데이터
     * @param {number} depth 뎁스
     */
    const handleClickDelete = useCallback(
        (area, depth) => {
            dispatch(
                getAreaListModal({
                    search: {
                        parentAreaSeq: area.areaSeq,
                        sourceCode,
                    },
                    callback: ({ header, body }) => {
                        if (header.success) {
                            if (body.list.length > 0) {
                                messageBox.confirm(
                                    '하위 편집영역이 모두 삭제됩니다.\n삭제하시겠습니까?',
                                    () => executeDel(area, depth),
                                    () => {},
                                );
                            } else {
                                messageBox.confirm(
                                    '삭제하시겠습니까?',
                                    () => executeDel(area, depth),
                                    () => {},
                                );
                            }
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        },
        [dispatch, executeDel, sourceCode],
    );

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>편집영역 관리</title>
                <meta name="description" content="편집영역 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 편집영역 리스트 */}
            <AreaAgGridDepth1
                sourceCode={sourceCode}
                setSourceCode={setSourceCode}
                areaDepth1={areaDepth1}
                setAreaDepth1={(data) => {
                    setAreaDepth1(data);
                    setAreaDepth2(initialState.initData);
                    setAreaDepth3(initialState.initData);
                    const nt = new Date().getTime();
                    setFlag({ ...flag, depth2: nt, depth3: nt });
                }}
                listDepth1={listDepth1}
                // setListDepth1={(list) => {
                //     setListDepth1(list);
                //     setListDepth2([]);
                //     setListDepth3([]);
                // }}
                setListDepth1={setListDepth1}
                flag={flag}
                onDelete={handleClickDelete}
            />
            <AreaAgGridDepth2
                sourceCode={sourceCode}
                areaDepth1={areaDepth1}
                areaDepth2={areaDepth2}
                flag={flag}
                setFlag={setFlag}
                listDepth2={listDepth2}
                setListDepth2={setListDepth2}
                setAreaDepth2={(data) => {
                    setAreaDepth2(data);
                    setAreaDepth3(initialState.initData);
                    setFlag({ ...flag, depth3: new Date().getTime() });
                }}
                onDelete={handleClickDelete}
            />
            <AreaAgGridDepth3
                sourceCode={sourceCode}
                areaDepth2={areaDepth2}
                areaDepth3={areaDepth3}
                flag={flag}
                setFlag={setFlag}
                setAreaDepth3={setAreaDepth3}
                listDepth3={listDepth3}
                setListDepth3={setListDepth3}
                onDelete={handleClickDelete}
            />

            {/* 편집영역 등록/수정 */}
            <Suspense>
                <AreaEdit
                    sourceCode={sourceCode}
                    onDelete={handleClickDelete}
                    areaDepth1={areaDepth1}
                    areaDepth2={areaDepth2}
                    areaDepth3={areaDepth3}
                    flag={flag}
                    setFlag={setFlag}
                    listDepth1={listDepth1}
                    listDepth2={listDepth2}
                    listDepth3={listDepth3}
                    setAreaDepth1={setAreaDepth1}
                    setAreaDepth2={setAreaDepth2}
                    setAreaDepth3={setAreaDepth3}
                />
            </Suspense>
        </div>
    );
};

export default Area;
