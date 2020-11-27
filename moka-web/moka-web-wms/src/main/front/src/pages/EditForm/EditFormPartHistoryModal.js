import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModal } from '@components';
import EditFormPartHistorySearch from './EditFormPartHistorySearch';
import EditFormPartHistoryAgGrid from './EditFormPartHistoryAgGrid';
import { getEditFormHistoryList } from '@/store/editForm';

const propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    /**
     * 등록 버튼 클릭
     * @param {object} template 선택한 데이터셋데이터
     */
    onClickSave: PropTypes.func,
    /**
     * 취소 버튼 클릭
     */
    onClickCancle: PropTypes.func,
    /**
     * 선택된 데이터셋아이디
     */
    selected: PropTypes.number,

    onClick: PropTypes.func,
};
const defaultProps = {};

/**
 * 데이터셋 리스트 공통 모달
 */
const EditFormPartHistoryModal = (props) => {
    const dispatch = useDispatch();

    const { editFormPart, historySearch: search } = useSelector((store) => ({
        editFormPart: store.editForm.editFormPart,
        historySearch: store.editForm.historySearch,
    }));

    // 최초 로딩이 리스트 가지고 오기.
    useEffect(() => {
        if (editFormPart && editFormPart.formSeq) {
            dispatch(getEditFormHistoryList(editFormPart, search));
        }
    }, [dispatch, editFormPart, search]);
    return (
        <MokaModal show={props.show} onHide={props.onHide} title="편집 이력 조회" size="xl" footerClassName="justify-content-center" width={970} draggable>
            <EditFormPartHistorySearch />
            <EditFormPartHistoryAgGrid />
        </MokaModal>
    );
};

EditFormPartHistoryModal.propTypes = propTypes;
EditFormPartHistoryModal.defaultProps = defaultProps;

export default EditFormPartHistoryModal;
