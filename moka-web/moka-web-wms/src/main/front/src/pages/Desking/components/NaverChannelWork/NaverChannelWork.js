import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { MokaLoader } from '@components';
import { DATA_TYPE_DESK, DESK_STATUS_SAVE, DESK_STATUS_WORK, DESK_STATUS_PUBLISH } from '@/constants';
import { deleteDeskingWorkList } from '@store/desking';
import ButtonGroup from './ButtonGroup';
import DeskingWorkAgGrid from '../ComponentWork/DeskingWorkAgGrid';
import { messageBox } from '@utils/toastUtil';

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
 * 네이버채널에서만 쓰는 컴포넌트 워크
 */
const NaverChannelWork = (props) => {
    const { component, componentWorkList, agGridIndex, componentAgGridInstances, setComponentAgGridInstances, areaSeq, deskingPart, saveFailMsg } = props;
    const dispatch = useDispatch();
    const workStatus = useSelector(({ desking }) => desking.workStatus);
    const [workTemplateSeq, setWorkTemplateSeq] = useState(null);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        if (componentWorkList.length > 0) {
            setWorkTemplateSeq(componentWorkList[0].templateSeq);
        } else {
            setWorkTemplateSeq(null);
        }
    }, [componentWorkList]);

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
                workTemplateSeq={workTemplateSeq}
                saveFailMsg={saveFailMsg}
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
                    onRowClicked={() => {}}
                    onDelete={handleClickDelete}
                    isNaverChannel
                />
            )}
        </div>
    );
};

NaverChannelWork.propTypes = propTypes;
NaverChannelWork.defaultProps = defaultProps;

export default NaverChannelWork;
