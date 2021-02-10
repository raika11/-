import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaTable } from '@components';
import { initialState, getAreaListModal, getAreaModal, changeSelectedDepth } from '@store/area';
import { messageBox } from '@utils/toastUtil';
import columnDefs from './AreaAgGridColumns';

/**
 * 편집영역 > 첫번째 리스트
 */
const AreaAgGridDepth1 = ({ areaDepth1, setAreaDepth1, setAreaDepth2, setAreaDepth3, onDelete, flag, setFlag, listDepth1, setListDepth1 }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const reset = useRef(null);

    /**
     * 리스트 조회
     */
    const getList = useCallback(() => {
        setLoading(true);
        dispatch(
            getAreaListModal({
                search: {
                    depth: 1,
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
    }, [dispatch, onDelete, setListDepth1]);

    useEffect(() => {
        if (flag.depth1 !== reset.current) {
            getList();
            reset.current = flag.depth1;
        }
    }, [getList, flag.depth1]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = (data) => {
        const nt = new Date().getTime();
        dispatch(
            getAreaModal({
                areaSeq: data.areaSeq,
                callback: ({ header, body }) => {
                    if (header.success) {
                        setAreaDepth1(body);
                        setAreaDepth2(initialState.initData);
                        setAreaDepth3(initialState.initData);
                        setFlag({ ...flag, depth2: nt, depth3: nt });
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
        setAreaDepth2(initialState.initData);
        setAreaDepth3(initialState.initData);
        const nt = new Date().getTime();
        setFlag({ ...flag, depth2: nt, depth3: nt });
        dispatch(changeSelectedDepth(1));
    };

    return (
        <React.Fragment>
            <MokaCard header={false} width={280} className="mr-10" bodyClassName="d-flex flex-column">
                <div className="d-flex justify-content-end mb-2">
                    <Button variant="positive" onClick={handleClickAdd}>
                        추가
                    </Button>
                </div>

                <MokaTable
                    className="overflow-hidden flex-fill"
                    columnDefs={columnDefs}
                    loading={loading}
                    rowData={listDepth1}
                    selected={areaDepth1?.area?.areaSeq}
                    header={false}
                    paging={false}
                    dragging={false}
                    onRowNodeId={(data) => data.areaSeq}
                    onRowClicked={handleRowClicked}
                    preventRowClickCell={['delete']}
                    suppressRefreshCellAfterUpdate
                />
            </MokaCard>
        </React.Fragment>
    );
};

export default AreaAgGridDepth1;
