import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListGroup from 'react-bootstrap/ListGroup';
import { MokaModal, MokaLoader } from '@components';
import { GET_COMPONENT_WORK_LIST, POST_DESKING_WORK_LIST_MOVE, postDeskingWorkListMove } from '@store/desking';
import { getAllRowData } from '@utils/agGridUtil';
import { messageBox } from '@utils/toastUtil';

/**
 * 기사 이동 모달 컴포넌트
 */
const RegisterModal = (props) => {
    const { show, onHide, component, agGridIndex, componentAgGridInstances } = props;
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_COMPONENT_WORK_LIST] || loading[POST_DESKING_WORK_LIST_MOVE]);
    const list = useSelector(({ desking }) => desking.list);
    const [filterList, setFilterList] = useState([]);

    /**
     * 아이템 클릭
     * @param {object} e event
     * @param {object} rowData item데이터
     */
    const handleClickItem = (e, rowData) => {
        e.preventDefault();
        e.stopPropagation();

        let selectedData = [],
            tgtGrid = null;

        tgtGrid = componentAgGridInstances.find((ag) => ag?.component?.componentSeq === rowData.componentSeq);
        if (!tgtGrid) {
            messageBox.alert('선택한 컴포넌트가 올바르지 않은 컴포넌트입니다');
            return;
        }

        selectedData = componentAgGridInstances[agGridIndex].api.getSelectedNodes().map((node) => node.data);
        const tgtData = getAllRowData(tgtGrid.api);

        // 타겟에 존재하는 기사이면 이동시키지 않는다
        let exists = false;
        selectedData.forEach((data) => {
            if (tgtData.findIndex((d) => d.contentId === data.contentId) > -1) {
                exists = true;
            }
        });

        if (exists) {
            messageBox.alert('이미 존재하는 기사가 포함되어 있습니다');
            return;
        }

        // sourceNode 정렬
        selectedData = selectedData.sort(function (a, b) {
            if (a.contentOrd === b.contentOrd) {
                return a.relOrd - b.relOrd;
            } else {
                return a.contentOrd - b.contentOrd;
            }
        });

        // selectedData contentOrd 순번처리
        let contentOrd = 0;
        for (let i = 0; i < selectedData.length; i++) {
            if (!selectedData[i].rel) {
                contentOrd++;
            }
            selectedData[i].contentOrd = contentOrd;
        }

        dispatch(
            postDeskingWorkListMove({
                componentWorkSeq: tgtGrid.component.seq,
                datasetSeq: rowData.datasetSeq,
                srcComponentWorkSeq: component.seq,
                srcDatasetSeq: component.datasetSeq,
                list: selectedData,
                callback: ({ header }) => {
                    if (!header.success) {
                        messageBox.alert(header.message);
                    } else {
                        onHide();
                    }
                },
            }),
        );
    };

    useEffect(() => {
        if (Array.isArray(list)) {
            // 현재 선택된 부모 컴포넌트, viewYn !== Y는 제외
            setFilterList(list.filter((obj) => obj.seq !== component.seq).filter((obj) => obj.viewYn === 'Y'));
        }
    }, [component.seq, list]);

    return (
        <MokaModal title="기사 이동" show={show} onHide={onHide} size="sm" width={300} height={441} centered draggable>
            {show && loading && <MokaLoader />}
            <ListGroup variant="flush" className="border custom-scroll" style={{ maxHeight: '100%' }}>
                {filterList.length < 1 && (
                    <div className="d-flex align-items-center justify-content-center h-100 v-100 p-2">
                        <p className="h5">이동할 컴포넌트가 존재하지 않습니다.</p>
                    </div>
                )}
                {filterList.length > 0 &&
                    filterList.map((rg) => (
                        <ListGroup.Item className="w-100 flex-shrink-0 user-select-none" key={rg.seq} action onClick={(e) => handleClickItem(e, rg)}>
                            <span>
                                {rg.componentSeq}_{rg.componentName}
                            </span>
                        </ListGroup.Item>
                    ))}
            </ListGroup>
        </MokaModal>
    );
};

export default RegisterModal;
