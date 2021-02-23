import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaTable } from '@components';
import { initialState, getAreaListModal, changeSelectedDepth, getAreaModal } from '@store/area';
import { messageBox } from '@utils/toastUtil';
import columnDefs from './AreaAgGridColumns';

/**
 * 편집영역 > 두번째 리스트
 */
const AreaAgGridDepth2 = ({ areaDepth1, areaDepth2, setAreaDepth2, setAreaDepth3, onDelete, flag, setFlag, listDepth2, setListDepth2 }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const reset = useRef(null);

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
                        depth: 2,
                    },
                    callback: ({ header, body }) => {
                        if (header.success) {
                            setListDepth2(
                                body.list.map((d) => ({
                                    ...d,
                                    onDelete: (data) => onDelete(data, 2),
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
            setListDepth2([]);
        }
    }, [areaDepth1.area, dispatch, onDelete, setListDepth2]);

    useEffect(() => {
        if (reset.current !== flag.depth2) {
            getList();
            reset.current = flag.depth2;
        }
    }, [getList, flag.depth2]);

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
                        setAreaDepth3(initialState.initData);
                        setFlag({ ...flag, depth3: new Date().getTime() });
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
        setAreaDepth3(initialState.initData);
        dispatch(changeSelectedDepth(2));
        setFlag({ ...flag, depth3: new Date().getTime() });
    };

    return (
        <React.Fragment>
            <MokaCard header={false} width={280} className="mr-10" bodyClassName="d-flex flex-column">
                <div className="d-flex justify-content-end mb-14">
                    <Button variant="positive" onClick={handleClickAdd} disabled={!areaDepth1?.area?.areaSeq}>
                        등록
                    </Button>
                </div>

                <MokaTable
                    className="overflow-hidden flex-fill"
                    rowData={listDepth2}
                    columnDefs={columnDefs}
                    selected={areaDepth2?.area?.areaSeq}
                    header={false}
                    paging={false}
                    dragging={false}
                    onRowNodeId={(data) => data.areaSeq}
                    onRowClicked={handleRowClicked}
                    loading={loading}
                    preventRowClickCell={['delete']}
                    suppressRefreshCellAfterUpdate
                />
            </MokaCard>
        </React.Fragment>
    );
};

export default AreaAgGridDepth2;
