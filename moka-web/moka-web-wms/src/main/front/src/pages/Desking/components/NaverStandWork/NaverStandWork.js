import React, { useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { MokaLoader } from '@components';
import { DATA_TYPE_DESK } from '@/constants';
import { deleteDeskingWorkList, putDeskingWork } from '@store/desking';
import ButtonGroup from './ButtonGroup';
import { EditDeskingWorkModal } from '@pages/Desking/modals';
import DeskingWorkAgGrid from '../ComponentWork/DeskingWorkAgGrid';
import { messageBox } from '@utils/toastUtil';

const propTypes = {
    /**
     * 컴포넌트 데이터
     * @default
     */
    component: PropTypes.object,
    /**
     * 해당 컴포넌트의 인덱스 (데스킹 AgGrid의 index)
     * @default
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
 * 네이버스탠드에서만 쓰는 컴포넌트 워크
 */
const NaverStandWork = (props) => {
    const { component, agGridIndex, componentAgGridInstances, setComponentAgGridInstances, areaSeq, deskingPart } = props;
    const dispatch = useDispatch();
    const workStatus = useSelector(({ desking }) => desking.workStatus);
    const [loading, setLoading] = useState(false);
    const [deskingWorkData, setDeskingWorkData] = useState({});
    const [editModalShow, setEditModalShow] = useState(false);

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
        dispatch(
            deleteDeskingWorkList({
                componentWorkSeq: component.seq,
                datasetSeq: component.datasetSeq,
                list: [deskingWork],
                callback: ({ header }) => {
                    if (!header.success) {
                        messageBox.alert(header.message);
                    }
                },
            }),
        );
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
                    onDelete={handleClickDelete}
                    onSave={handleClickSave}
                />
            )}

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

NaverStandWork.propTypes = propTypes;
NaverStandWork.defaultProps = defaultProps;

export default NaverStandWork;
