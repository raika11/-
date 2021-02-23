import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaTable } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import { initialState, changeSelectedDepth, getAreaListModal, getAreaModal, putAreaListSort } from '@store/area';
import { getDisplayedRows } from '@utils/agGridUtil';
import columnDefs from './AreaAgGridColumns';

/**
 * 편집영역 > 세번째 리스트
 */
const AreaAgGridDepth3 = ({ areaDepth2, areaDepth3, setAreaDepth3, onDelete, flag, listDepth3, setListDepth3, sourceCode }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [gridInstance, setGridInstance] = useState(null);

    /**
     * 리스트 조회
     */
    const getList = useCallback(() => {
        if (areaDepth2?.area?.areaSeq) {
            setLoading(true);
            dispatch(
                getAreaListModal({
                    search: {
                        parentAreaSeq: areaDepth2?.area?.areaSeq,
                        depth: 3,
                        sourceCode,
                    },
                    callback: ({ header, body }) => {
                        if (header.success) {
                            setListDepth3(
                                body.list.map((d) => ({
                                    ...d,
                                    onDelete: (data) => onDelete(data, 3),
                                })),
                            );
                        } else {
                            messageBox.alert(header.message);
                        }
                        setLoading(false);
                    },
                }),
            );
        } else {
            setListDepth3([]);
        }
    }, [areaDepth2.area, dispatch, onDelete, setListDepth3, sourceCode]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = (data) => {
        dispatch(
            getAreaModal({
                areaSeq: data.areaSeq,
                callback: ({ header, body }) => {
                    if (header.success) {
                        setAreaDepth3(body);
                        dispatch(changeSelectedDepth(3));
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
        setAreaDepth3(initialState.initData);
        dispatch(changeSelectedDepth(3));
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
                parentAreaSeq: areaDepth2?.area?.areaSeq,
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
    }, [flag.depth3]);

    return (
        <MokaCard header={false} width={280} className="mr-gutter" bodyClassName="d-flex flex-column">
            <div className="d-flex justify-content-end mb-14">
                <Button variant="positive" onClick={handleClickAdd} className="mr-1" disabled={!areaDepth2?.area?.areaSeq}>
                    등록
                </Button>

                <Button variant="positive" disabled={!areaDepth2?.area?.areaSeq} onClick={handleChangeOrd}>
                    저장
                </Button>
            </div>

            <MokaTable
                setGridInstance={setGridInstance}
                className="overflow-hidden flex-fill"
                selected={areaDepth3?.area?.areaSeq}
                rowData={listDepth3}
                columnDefs={columnDefs}
                paging={false}
                onRowDragEnd={handleDragEnd}
                onRowNodeId={(data) => data.areaSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                preventRowClickCell={['delete']}
                suppressRowClickSelection
                suppressMoveWhenRowDragging
                rowDragManaged
                animateRows
                dragStyle
            />
        </MokaCard>
    );
};

export default AreaAgGridDepth3;
