import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { DATA_TYPE_DESK } from '@/constants';
import { deleteDeskingWorkList } from '@store/desking';
import ButtonGroup from './ButtonGroup';
import DeskingWorkAgGrid from '../ComponentWork/DeskingWorkAgGrid';
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
 * 네이버채널에서만 쓰는 컴포넌트 워크
 */
const NaverChannelWork = (props) => {
    const { component, componentWorkList, agGridIndex, componentAgGridInstances, setComponentAgGridInstances, areaSeq, deskingPart } = props;
    const dispatch = useDispatch();

    const { workStatus } = useSelector((store) => ({
        workStatus: store.desking.workStatus,
    }));

    const [workTemplateSeq, setWorkTemplateSeq] = useState(null);

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

    useEffect(() => {
        if (componentWorkList.length > 0) {
            setWorkTemplateSeq(componentWorkList[0].templateSeq);
        } else {
            setWorkTemplateSeq(null);
        }
    }, [componentWorkList]);

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
            {/* 컴포넌트 워크의 버튼 그룹 */}
            <ButtonGroup
                areaSeq={areaSeq}
                component={component}
                agGridIndex={agGridIndex}
                componentAgGridInstances={componentAgGridInstances}
                workStatus={workStatus[component.seq]}
                workTemplateSeq={workTemplateSeq}
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
                />
            )}
        </div>
    );
};

NaverChannelWork.propTypes = propTypes;
NaverChannelWork.defaultProps = defaultProps;

export default NaverChannelWork;
