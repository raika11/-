import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaTable } from '@components';
import { messageBox } from '@utils/toastUtil';
import { initialState, changeSelectedDepth, getAreaListModal, getAreaModal } from '@store/area';
import columnDefs from './AreaAgGridColumns';

/**
 * 편집영역 > 세번째 리스트
 */
const AreaAgGridDepth3 = ({ areaDepth2, areaDepth3, setAreaDepth3, onDelete, flag, listDepth3, setListDepth3 }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const reset = useRef(null);

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
    }, [areaDepth2.area, dispatch, onDelete, setListDepth3]);

    useEffect(() => {
        if (reset.current !== flag.depth3) {
            getList();
            reset.current = flag.depth3;
        }
    }, [getList, flag.depth3]);

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

    return (
        <MokaCard header={false} width={280} className="mr-gutter" bodyClassName="d-flex flex-column">
            <div className="d-flex justify-content-end mb-2">
                <Button variant="positive" onClick={handleClickAdd} disabled={!areaDepth2?.area?.areaSeq}>
                    추가
                </Button>
            </div>

            <MokaTable
                className="overflow-hidden flex-fill"
                selected={areaDepth3?.area?.areaSeq}
                rowData={listDepth3}
                columnDefs={columnDefs}
                header={false}
                paging={false}
                dragging={false}
                onRowNodeId={(data) => data.areaSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                preventRowClickCell={['delete']}
            />
        </MokaCard>
    );
};

export default AreaAgGridDepth3;
