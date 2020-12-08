import React, { useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { DATA_TYPE_DESK } from '@/constants';
import { putDeskingWork, deleteDeskingWorkList } from '@store/desking';
import ButtonGroup from './ComponentWorkButtonGroup';
import AgGrid from './DeskingWorkAgGrid';
import { EditDeskingWorkModal } from '@pages/Desking/modals';
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

const ComponentWork = (props) => {
    const { component, agGridIndex, componentAgGridInstances, setComponentAgGridInstances, areaSeq, deskingPart, editFormPart } = props;
    const dispatch = useDispatch();

    const { workStatus } = useSelector((store) => ({
        workStatus: store.desking.workStatus,
    }));

    // state
    const [deskingWorkData, setDeskingWorkData] = useState({});
    const [editModalShow, setEditModalShow] = useState(false);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = (rowData) => {
        setDeskingWorkData(rowData);
        setEditModalShow(true);
    };

    /**
     * 데스킹워크 저장 (put)
     * @param {object} deskingWork 저장할 데스킹워크 데이터
     * @param {func} callback 저장 후 실행
     */
    const handleClickSave = (deskingWork, callback) => {
        let saveData = deskingWork;
        delete saveData.onRowClicked;
        delete saveData.onSave;
        delete saveData.onDelete;

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
     * 데스킹워크 삭제 (delete)
     * @param {object} deskingWork 삭제할 데스킹워크 데이터
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
        <React.Fragment>
            <div
                className={clsx('component-work', 'border-top', {
                    disabled: component.viewYn === 'N',
                    work: workStatus[component.seq] === 'work',
                    save: workStatus[component.seq] === undefined || workStatus[component.seq] === 'save',
                    publish: workStatus[component.seq] === 'publish',
                })}
                id={`agGrid-${component.seq}`}
            >
                {/* 컴포넌트 워크의 버튼 그룹 */}
                <ButtonGroup
                    areaSeq={areaSeq}
                    component={component}
                    agGridIndex={agGridIndex}
                    componentAgGridInstances={componentAgGridInstances}
                    workStatus={workStatus[component.seq]}
                />

                {/* 데스킹 워크 리스트 (dataType === DESK) */}
                {component.dataType === DATA_TYPE_DESK && (
                    <AgGrid
                        component={component}
                        agGridIndex={agGridIndex}
                        componentAgGridInstances={componentAgGridInstances}
                        setComponentAgGridInstances={setComponentAgGridInstances}
                        onRowClicked={handleRowClicked}
                        onSave={handleClickSave}
                        onDelete={handleClickDelete}
                    />
                )}
            </div>

            <EditDeskingWorkModal
                show={editModalShow}
                onHide={() => setEditModalShow(false)}
                deskingWorkData={deskingWorkData}
                component={component}
                onSave={handleClickSave}
                deskingPart={deskingPart}
            />
        </React.Fragment>
    );
};

ComponentWork.propTypes = propTypes;
ComponentWork.defaultProps = defaultProps;

export default ComponentWork;
