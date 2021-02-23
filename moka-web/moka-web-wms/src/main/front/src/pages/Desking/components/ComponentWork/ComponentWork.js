import React, { useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { DATA_TYPE_DESK } from '@/constants';
import { MokaLoader } from '@components';
import { putDeskingWork, deleteDeskingWorkList } from '@store/desking';
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
};
const defaultProps = {
    component: {},
    agGridIndex: 0,
};

/**
 * 가장 기본이 되는 데스킹 워크
 */
const ComponentWork = (props) => {
    const { component, agGridIndex, componentAgGridInstances, setComponentAgGridInstances, areaSeq, deskingPart } = props;
    // const { editFormPart } = props;
    const dispatch = useDispatch();
    const workStatus = useSelector(({ desking }) => desking.workStatus);

    // state
    const [loading, setLoading] = useState(false);
    const [deskingWorkData, setDeskingWorkData] = useState({});
    const [editModalShow, setEditModalShow] = useState(false);
    // const [formShow, setFormShow] = useState(false);

    /**
     * 편집기사 목록에서 Row클릭
     */
    const handleRowClicked = (rowData) => {
        // deskingPart로 지정된 필드가 없으면 수정불가
        if (deskingPart && deskingPart !== '') {
            setDeskingWorkData(rowData);
            setEditModalShow(true);
        }
    };

    /**
     * 편집기사 저장 (put)
     * @param {object} deskingWork 저장할 편집기사 데이터
     * @param {func} callback 저장 후 실행
     */
    const handleClickSave = (deskingWork, callback) => {
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
    };

    /**
     * 편집기사 삭제 (delete)
     * @param {object} deskingWork 삭제할 편집기사 데이터
     */
    const handleClickDelete = (deskingWork) => {
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
    };

    return (
        <div
            className={clsx('component-work', 'border-top', {
                disabled: component.viewYn === 'N',
                work: workStatus[component.seq] === 'work',
                save: workStatus[component.seq] === undefined || workStatus[component.seq] === 'save',
                publish: workStatus[component.seq] === 'publish',
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
                    onSave={handleClickSave}
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
                    onSave={handleClickSave}
                    deskingPart={deskingPart}
                />
            )}
        </div>
    );
};

ComponentWork.propTypes = propTypes;
ComponentWork.defaultProps = defaultProps;

export default ComponentWork;
