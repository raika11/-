import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { AREA_HOME } from '@/constants';
import { MokaCard, MokaTable, MokaInput } from '@components';
import { initialState, getAreaListModal, getAreaModal, changeSelectedDepth, putAreaListSort } from '@store/area';
import toast, { messageBox } from '@utils/toastUtil';
import { getDisplayedRows } from '@utils/agGridUtil';
import columnDefs from './AreaAgGridColumns';

/**
 * 편집영역 > 첫번째 리스트
 */
const AreaAgGridDepth1 = ({ areaDepth1, setAreaDepth1, sourceCode, setSourceCode, onDelete, flag, listDepth1, setListDepth1 }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [gridInstance, setGridInstance] = useState(null);

    /**
     * 리스트 조회
     */
    const getList = useCallback(() => {
        setLoading(true);
        dispatch(
            getAreaListModal({
                search: {
                    depth: 1,
                    sourceCode,
                },
                callback: ({ header, body }) => {
                    if (header.success) {
                        setListDepth1(
                            body.list.map((d) => ({
                                ...d,
                                onDelete: (data) => onDelete(data, 1),
                            })),
                        );
                    } else {
                        messageBox.alert(header.message);
                    }
                    setLoading(false);
                },
            }),
        );
    }, [dispatch, onDelete, sourceCode, setListDepth1]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = (data) => {
        dispatch(
            getAreaModal({
                areaSeq: data.areaSeq,
                callback: ({ header, body }) => {
                    if (header.success) {
                        setAreaDepth1(body);
                        dispatch(changeSelectedDepth(1));
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
        setAreaDepth1(initialState.initData);
        dispatch(changeSelectedDepth(1));
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
        setAreaDepth1(initialState.initData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag.depth1, sourceCode]);

    return (
        <React.Fragment>
            <MokaCard header={false} width={280} className="mr-10" bodyClassName="d-flex flex-column">
                <div className="mb-14">
                    <MokaInput as="select" value={sourceCode} onChange={(e) => setSourceCode(e.target.value)}>
                        {AREA_HOME.map(({ name, value }) => (
                            <option key={value} value={value}>
                                {name}
                            </option>
                        ))}
                    </MokaInput>
                </div>

                <div className="d-flex justify-content-end mb-14">
                    <Button variant="positive" onClick={handleClickAdd} className="mr-1">
                        등록
                    </Button>

                    <Button variant="positive" onClick={handleChangeOrd}>
                        저장
                    </Button>
                </div>

                <MokaTable
                    setGridInstance={setGridInstance}
                    className="overflow-hidden flex-fill"
                    columnDefs={columnDefs}
                    loading={loading}
                    rowData={listDepth1}
                    selected={areaDepth1?.area?.areaSeq}
                    paging={false}
                    onRowDragEnd={handleDragEnd}
                    onRowNodeId={(data) => data.areaSeq}
                    onRowClicked={handleRowClicked}
                    preventRowClickCell={['delete']}
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

export default AreaAgGridDepth1;
