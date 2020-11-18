import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import produce from 'immer';
import { MokaModal, MokaTable } from '@components';
import { registerColumns } from './modalColumns';
import { GET_COMPONENT_WORK_LIST, deskingDragStop } from '@store/desking';
import toast from '@utils/toastUtil';

/**
 * 기사 이동 모달 컴포넌트
 */
const RegisterModal = (props) => {
    const { show, onHide, component, agGridIndex, componentAgGridInstances } = props;
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
            let tgtComponent = null;

            const tgt = list.findIndex((c) => c.seq === row.seq);
            targetIndex = tgt ? tgt : null;
            tgtComponent = tgt ? list[tgt] : null;

            if (targetIndex !== null && tgtComponent !== null) {
                const option = {
                    source: componentAgGridInstances[agGridIndex],
                    target: componentAgGridInstances[targetIndex],
                    srcComponent: component,
                    tgtComponent,
                    callback: ({ header }) => {
                        if (!header.success) {
                            toast.warn(header.message);
                        }
                    },
                };
                dispatch(deskingDragStop(option));
            }
        },
        [agGridIndex, component, componentAgGridInstances, dispatch, list],
    );

    return (
        <MokaModal title="기사 이동" show={show} onHide={onHide} size="sm" width={280} draggable>
            <MokaTable
                agGridHeight={413}
                columnDefs={registerColumns}
                rowData={listRows}
                onRowNodeId={(comp) => comp.id}
                header={false}
                paging={false}
                dragging={false}
                onRowClicked={handleRowClicked}
                // selected={}
                loading={loading}
                error={error}
            />
        </MokaModal>
    );
};

export default RegisterModal;
