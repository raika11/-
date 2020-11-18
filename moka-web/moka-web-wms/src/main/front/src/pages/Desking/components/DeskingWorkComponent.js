import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from './DeskingWorkButtonGroup';
import AgGrid from './DeskingWorkAgGrid';

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
};
const defaultProps = {
    component: {},
    agGridIndex: 0,
};

const DeskingWorkComponent = (props) => {
    const { component, agGridIndex, componentAgGridInstances, setComponentAgGridInstances } = props;

    return (
        <div id={`agGrid-${component.seq}`}>
            <ButtonGroup
                component={component}
                agGridIndex={agGridIndex}
                componentAgGridInstances={componentAgGridInstances}
                setComponentAgGridInstances={setComponentAgGridInstances}
            />
            <AgGrid component={component} agGridIndex={agGridIndex} componentAgGridInstances={componentAgGridInstances} setComponentAgGridInstances={setComponentAgGridInstances} />
        </div>
    );
};

DeskingWorkComponent.propTypes = propTypes;
DeskingWorkComponent.defaultProps = defaultProps;

export default DeskingWorkComponent;
