import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import produce from 'immer';
import { MokaModal, MokaTable } from '@components';
import { registerColumns } from './modalColumns';
import { GET_COMPONENT_WORK_LIST, deskingDragStop } from '@store/desking';
import { agGrids } from '@utils/agGridUtil';

/**
 * 기사 이동 모달 컴포넌트
 */
const RegisterModal = (props) => {
    const { show, onHide, component, moveRows, agGridIndex } = props;
    const dispatch = useDispatch();
    const { list, error, loading } = useSelector((store) => ({
        list: store.desking.list,
        error: store.desking.error,
        loding: store.loading[GET_COMPONENT_WORK_LIST],
    }));

    // state
    const [listRows, setListRows] = useState([]);

    // local 컴포넌트 목록
    useEffect(() => {
        if (list) {
            const filterList = list.filter((obj) => obj.seq !== component.seq); // 현재 선택된 부모 컴포넌트는 제외
            setListRows(
                filterList.map((obj, index) => ({
                    id: String(obj.seq),
                    gridIndex: index,
                    seq: obj.seq,
                    name: `${obj.componentSeq}_${obj.componentName}`,
                    componentSeq: obj.componentSeq,
                    componentName: obj.componentName,
                })),
            );
        }
    }, [component.seq, list]);

    const handleRowClicked = useCallback(
        (row) => {
            let targetIndex = null;
            let targetComponent = null;
            list.forEach((c, index) => {
                if (c.seq === row.seq) {
                    targetIndex = index;
                    targetComponent = produce(c, (draft) => draft);
                }
            });
            if (targetIndex !== null && targetComponent !== null) {
                const option = {
                    srcGrid: agGrids.prototype.grids[agGridIndex],
                    tgtGrid: agGrids.prototype.grids[targetIndex],
                    srcComponent: component,
                    targetComponent,
                    nodes: moveRows,
                };
                dispatch(deskingDragStop(option));
            }
        },
        [agGridIndex, component, dispatch, list, moveRows],
    );

    return (
        <MokaModal title="기사 이동" show={show} onHide={onHide} size="sm" width={280} draggable>
            <MokaTable columnDefs={registerColumns} rowData={listRows} header={false} paging={false} dragging={false} onRowClicked={handleRowClicked} loading={loading} />
        </MokaModal>
    );
};

export default RegisterModal;
