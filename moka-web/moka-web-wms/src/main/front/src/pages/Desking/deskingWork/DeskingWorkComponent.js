import React from 'react';
import DeskingWorkButtonGroup from './DeskingWorkButtonGroup';
import DeskingWorkAgGrid from './DeskingWorkAgGrid';

const DeskingWorkComponent = (props) => {
    const { component, agGridIndex } = props;

    return (
        <div id={`agGrid-${component.seq}`}>
            <DeskingWorkButtonGroup component={component} agGridIndex={agGridIndex} />
            <DeskingWorkAgGrid component={component} agGridIndex={agGridIndex} />
        </div>
    );
};

export default DeskingWorkComponent;
