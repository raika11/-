import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from './DeskingWorkButtonGroup';
import AgGrid from './DeskingWorkAgGrid';
import DeskingWorkEditModal from '../modals/DeskingWorkEditModal';

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

    // state
    const [rowdata, setRowData] = useState({});
    const [showDeskingWorkEditModal, setShowDeskingWorkEditModal] = useState(false);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((desking) => {
        // history.push(`/desking/${desking.Seq}`);
        console.log(desking);
        setRowData(desking);
        setShowDeskingWorkEditModal(true);
    }, []);

    return (
        <React.Fragment>
            <div id={`agGrid-${component.seq}`}>
                <ButtonGroup
                    component={component}
                    agGridIndex={agGridIndex}
                    componentAgGridInstances={componentAgGridInstances}
                    setComponentAgGridInstances={setComponentAgGridInstances}
                />
                <AgGrid
                    component={component}
                    agGridIndex={agGridIndex}
                    componentAgGridInstances={componentAgGridInstances}
                    setComponentAgGridInstances={setComponentAgGridInstances}
                    onRowClicked={handleRowClicked}
                />
            </div>
            <DeskingWorkEditModal show={showDeskingWorkEditModal} onHide={() => setShowDeskingWorkEditModal(false)} data={rowdata} />
        </React.Fragment>
    );
};

DeskingWorkComponent.propTypes = propTypes;
DeskingWorkComponent.defaultProps = defaultProps;

export default DeskingWorkComponent;
