import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from './DeskingWorkButtonGroup';
import AgGrid from './DeskingWorkAgGrid';

const propTypes = {
    /**
     * 컴포넌트 데이터
     */
    component: PropTypes.array,
    /**
     * 해당 컴포넌트의 인덱스 (데스킹 AgGrid의 index)
     */
    agGridIndex: PropTypes.number,
    /**
     * 컴포넌트 클릭 콜백
     */
    onRowClicked: PropTypes.func,
};
const defaultProps = {
    component: [],
    agGridIndex: 0,
};

const DeskingWorkComponent = (props) => {
    const { component, agGridIndex } = props;

    return (
        <div id={`agGrid-${component.seq}`}>
            <ButtonGroup component={component} agGridIndex={agGridIndex} />
            <AgGrid component={component} agGridIndex={agGridIndex} />
        </div>
    );
};

DeskingWorkComponent.propTypes = propTypes;
DeskingWorkComponent.defaultProps = defaultProps;

export default DeskingWorkComponent;
