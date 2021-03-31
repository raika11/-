import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaTable } from '@components';
import { initialState, getAreaListModal, changeSelectedDepth, getAreaModal, putAreaListSort } from '@store/area';
import toast, { messageBox } from '@utils/toastUtil';
import { getDisplayedRows } from '@utils/agGridUtil';
import columnDefs from './AreaAgGridColumns';

/**
 * 영역편집정보 관리 > depth2 AgGrid
 */
const AreaAgGridDepth2 = ({ areaDepth1, areaDepth2, setAreaDepth2, sourceCode, flag, listDepth2, setListDepth2 }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [gridInstance, setGridInstance] = useState(null);

    /**
     * 리스트 조회
     */
    const getList = useCallback(() => {
        if (areaDepth1?.area?.areaSeq) {
            setLoading(true);
            dispatch(
                getAreaListModal({
                    search: {
                        parentAreaSeq: areaDepth1?.area?.areaSeq,
                        sourceCode,
                        depth: 2,
                    },
                    callback: ({ header, body }) => {
                        if (header.success) {
                            setListDepth2(body.list);
                        } else {
                            messageBox.alert(header.message);
                        }
                        setLoading(false);
                    },
                }),
            );
        } else {
            setListDepth2([]);
        }
    }, [areaDepth1.area, dispatch, sourceCode, setListDepth2]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = (data) => {
        dispatch(
            getAreaModal({
                areaSeq: data.areaSeq,
                callback: ({ header, body }) => {
                    if (header.success) {
                        setAreaDepth2(body);
                        dispatch(changeSelectedDepth(2));
                    } else {
                        messageBox.alert(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 추가 버튼 클릭
     */
    const handleClickAdd = () => {
        setAreaDepth2(initialState.initData);
        dispatch(changeSelectedDepth(2));
    };

    /**
     * 순서 바꿔서 저장
     */
    const handleChangeOrd = () => {
        const displayedRows = getDisplayedRows(gridInstance.api);
        const areaSeqList = displayedRows.map((d) => d.areaSeq);
        dispatch(
            putAreaListSort({
                areaSeqList,
                parentAreaSeq: areaDepth1?.area?.areaSeq,
                callback: ({ header }) => {
                    if (!header.success) {
                        messageBox.alert(header.message);
                    } else {
                        toast.success(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 드래그 후 ordNo 정렬
     * @param {object} params grid instance
     */
    const handleDragEnd = (params) => {
        const displayedRows = getDisplayedRows(params.api);
        const ordered = displayedRows.map((data, idx) => ({
            ...data,
            ordNo: idx + 1,
        }));
        params.api.applyTransaction({ update: ordered });
    };

    useEffect(() => {
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag.depth2]);

    return (
        <React.Fragment>
            <MokaCard header={false} width={280} className="mr-10" bodyClassName="d-flex flex-column">
                <div className="d-flex justify-content-end mb-14">
                    <Button variant="positive" onClick={handleClickAdd} className="mr-1" disabled={!areaDepth1?.area?.areaSeq}>
                        등록
                    </Button>

                    <Button variant="positive" disabled={!areaDepth1?.area?.areaSeq} onClick={handleChangeOrd}>
                        저장
                    </Button>
                </div>

                <MokaTable
                    setGridInstance={setGridInstance}
                    className="overflow-hidden flex-fill"
                    rowData={listDepth2}
                    columnDefs={columnDefs}
                    selected={areaDepth2?.area?.areaSeq}
                    paging={false}
                    onRowDragEnd={handleDragEnd}
                    onRowNodeId={(data) => data.areaSeq}
                    onRowClicked={handleRowClicked}
                    loading={loading}
                    suppressRowClickSelection
                    suppressMoveWhenRowDragging
                    rowDragManaged
                    animateRows
                    dragStyle
                />
            </MokaCard>
        </React.Fragment>
    );
};

export default AreaAgGridDepth2;
