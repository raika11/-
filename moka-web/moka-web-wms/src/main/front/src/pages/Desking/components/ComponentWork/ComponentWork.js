import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { DATA_TYPE_DESK, DESK_STATUS_SAVE, DESK_STATUS_WORK, DESK_STATUS_PUBLISH } from '@/constants';
import { MokaLoader } from '@components';
import { postDeskingWork, putDeskingWork, deleteDeskingWorkList } from '@store/desking';
import ButtonGroup from './ButtonGroup';
import DeskingWorkAgGrid from './DeskingWorkAgGrid';
import { EditDeskingWorkModal } from '@pages/Desking/modals';
// import ComponentWorkForm from '@pages/Desking/components/ComponentWorkForm';
import toast from '@utils/toastUtil';

const propTypes = {
    /**
     * 컴포넌트 데이터
     */
    component: PropTypes.object,
    /**
     * 해당 컴포넌트의 인덱스 (데스킹 AgGrid의 index)
     */
    agGridIndex: PropTypes.number,
    /**
     * 컴포넌트 클릭 콜백
     */
    onRowClicked: PropTypes.func,
    /**
     * 컴포넌트 ag-grid 인스턴스 리스트
     */
    componentAgGridInstances: PropTypes.arrayOf(PropTypes.object),
    /**
     * 컴포넌트 ag-grid 인스턴스 리스트 변경
     */
    setComponentAgGridInstances: PropTypes.func,
    /**
     * 편집영역에서 설정한 컴포넌트별 deskingPart
     */
    deskingPart: PropTypes.string,
    /**
     * 임시저장 전 전송 시 실패 메세지
     * @default
     */
    saveFailMsg: PropTypes.string,
};
const defaultProps = {
    component: {},
    agGridIndex: 0,
    saveFailMsg: '',
};

/**
 * 가장 기본이 되는 데스킹 워크
 */
const ComponentWork = (props) => {
    const { component, agGridIndex, componentAgGridInstances, setComponentAgGridInstances, areaSeq, deskingPart, saveFailMsg } = props;
    // const { editFormPart } = props;
    const dispatch = useDispatch();
    const workStatus = useSelector(({ desking }) => desking.workStatus);
    const [loading, setLoading] = useState(false);
    const [deskingWorkData, setDeskingWorkData] = useState({});
    const [editModalShow, setEditModalShow] = useState(false);
    // const [formShow, setFormShow] = useState(false);

    /**
     * 편집기사 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (rowData) => {
            // deskingPart로 지정된 필드가 없으면 수정불가
            if (deskingPart && deskingPart !== '') {
                setDeskingWorkData(rowData);
                setEditModalShow(true);
            }
        },
        [deskingPart],
    );

    /**
     * 편집기사 수정 (put)
     * @param {object} deskingWork 저장할 편집기사 데이터
     * @param {func} callback 저장 후 실행
     */
    const handleClickPut = useCallback(
        (deskingWork, callback) => {
            let saveData = deskingWork;
            delete saveData.onRowClicked;
            delete saveData.onSave;
            delete saveData.onDelete;
            delete saveData.deskingPart;

            dispatch(
                putDeskingWork({
                    componentWorkSeq: component.seq,
                    areaSeq,
                    deskingWork: saveData,
                    callback,
                }),
            );
        },
        [areaSeq, component.seq, dispatch],
    );

    /**
     * 편집기사 추가 (post)
     * @param {object} deskingWork 저장할 편집기사 데이터
     * @param {func} callback 저장 후 실행
     */
    const handleClickPost = useCallback(
        (deskingWork, callback) => {
            dispatch(
                postDeskingWork({
                    componentWorkSeq: component.seq,
                    datasetSeq: component.datasetSeq,
                    areaSeq,
                    deskingWork: {
                        ...deskingWork,
                        contentOrd: 1,
                        contentType: 'D',
                    },
                    callback,
                }),
            );
        },
        [areaSeq, component.datasetSeq, component.seq, dispatch],
    );

    /**
     * 편집기사 삭제 (delete)
     * @param {object} deskingWork 삭제할 편집기사 데이터
     */
    const handleClickDelete = useCallback(
        (deskingWork) => {
            const option = {
                componentWorkSeq: component.seq,
                datasetSeq: component.datasetSeq,
                list: [deskingWork],
                callback: ({ header }) => {
                    if (!header.success) {
                        toast.fail(header.message);
                    }
                },
            };
            dispatch(deleteDeskingWorkList(option));
        },
        [component.datasetSeq, component.seq, dispatch],
    );

    return (
        <div
            className={clsx('component-work', {
                disabled: component.viewYn === 'N',
                work: workStatus[component.seq] === DESK_STATUS_WORK,
                save: workStatus[component.seq] === undefined || workStatus[component.seq] === DESK_STATUS_SAVE,
                publish: workStatus[component.seq] === DESK_STATUS_PUBLISH,
            })}
            id={`agGrid-${component.seq}`}
        >
            {loading && <MokaLoader />}

            {/* 컴포넌트 워크의 버튼 그룹 */}
            <ButtonGroup
                areaSeq={areaSeq}
                component={component}
                agGridIndex={agGridIndex}
                componentAgGridInstances={componentAgGridInstances}
                workStatus={workStatus[component.seq]}
                setLoading={setLoading}
                onSaveDummy={handleClickPost}
                saveFailMsg={saveFailMsg}
                deskingPart={deskingPart}
                // handleForm={() => setFormShow(true)}
            />

            {/* 편집기사 리스트 */}
            {component.dataType === DATA_TYPE_DESK && (
                <DeskingWorkAgGrid
                    component={component}
                    agGridIndex={agGridIndex}
                    componentAgGridInstances={componentAgGridInstances}
                    setComponentAgGridInstances={setComponentAgGridInstances}
                    deskingPart={deskingPart}
                    onRowClicked={handleRowClicked}
                    onSave={handleClickPut}
                    onDelete={handleClickDelete}
                />
            )}

            {/* 폼편집 수정창 2020.12.08 주석처리 */}
            {/* {component.dataType === DATA_TYPE_FORM && formShow && (
                <ComponentWorkForm show={formShow} editFormPart={editFormPart} component={component} onHide={() => setFormShow(false)} />
            )} */}

            {/* 편집기사 수정 모달 */}
            {component.dataType === DATA_TYPE_DESK && (
                <EditDeskingWorkModal
                    show={editModalShow}
                    onHide={() => setEditModalShow(false)}
                    deskingWorkData={deskingWorkData}
                    component={component}
                    onSave={handleClickPut}
                    deskingPart={deskingPart}
                />
            )}
        </div>
    );
};

ComponentWork.propTypes = propTypes;
ComponentWork.defaultProps = defaultProps;

export default ComponentWork;
