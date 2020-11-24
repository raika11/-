import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListGroup from 'react-bootstrap/ListGroup';
import { MokaModal, MokaLoader } from '@components';
import { GET_COMPONENT_WORK_LIST, moveDeskingWorkList } from '@store/desking';
import toast from '@utils/toastUtil';

/**
 * 기사 이동 모달 컴포넌트
 */
const RegisterModal = (props) => {
    const { show, onHide, component, agGridIndex, componentAgGridInstances } = props;
    const dispatch = useDispatch();
    const { list, loading } = useSelector((store) => ({
        list: store.desking.list,
        loading: store.loading[GET_COMPONENT_WORK_LIST],
    }));

    // state
    const [filterList, setFilterList] = useState([]);

    useEffect(() => {
        if (Array.isArray(list)) {
            // 현재 선택된 부모 컴포넌트는 제외
            setFilterList(list.filter((obj) => obj.seq !== component.seq));
        }
    }, [component.seq, list]);

    /**
     * 아이템 클릭
     * @param {object} e event
     * @param {object} rowData item데이터
     */
    const handleClickItem = (e, rowData) => {
        e.preventDefault();
        e.stopPropagation();

        let targetIndex = null,
            tgtComponent = null,
            selectedNodes = [];
        targetIndex = filterList.findIndex((c) => c.seq === rowData.seq);
        tgtComponent = targetIndex > -1 ? list[targetIndex] : null;

        if (!tgtComponent) {
            toast.warn('선택한 컴포넌트가 올바르지 않은 컴포넌트입니다');
            return;
        }

        selectedNodes = componentAgGridInstances[agGridIndex].api.getSelectedNodes().map((node) => node.data);

        const option = {
            componentWorkSeq: tgtComponent.seq,
            datasetSeq: tgtComponent.datasetSeq,
            srcComponentWorkSeq: component.seq,
            srcDatasetSeq: component.datasetSeq,
            list: selectedNodes,
            callback: ({ header }) => {
                if (!header.success) {
                    toast.warn(header.message);
                } else {
                    onHide();
                }
            },
        };

        dispatch(moveDeskingWorkList(option));
    };

    return (
        <MokaModal title="기사 이동" show={show} onHide={onHide} size="xs" width={300} height={441} draggable>
            {loading && <MokaLoader />}
            <ListGroup variant="flush" className="border custom-scroll h-100">
                {filterList.map((rg) => (
                    <ListGroup.Item className="w-100 user-select-none" key={rg.seq} action onClick={(e) => handleClickItem(e, rg)}>
                        {rg.componentSeq}_{rg.componentName}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </MokaModal>
    );
};

export default RegisterModal;
