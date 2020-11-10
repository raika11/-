import React from 'react';
import { MokaInput } from '@components';

// 테스트 중
const MokaTableRadioButton = (params) => {
    const rowData = params.data;
    const { getRowNodeId } = params.agGridReact.gridOptions;
    const rowNodeId = getRowNodeId(rowData);

    params.addRowCompListener('click', (dd) => {
        console.log(dd);
    });
    const handleClick = () => {
        // debugger;
        // if (gridApi) {
        //     gridApi.deselectAll();
        // }
        // if (selected && gridApi) {
        //     const selectedNode = gridApi.getRowNode(selected);
        //     if (selectedNode) {
        //         selectedNode.selectThisNode(true);
        //     }
        // }
    };

    return (
        <div className="d-flex align-items-center justify-content-center">
            <MokaInput as="radio" name="moka-table-radio" id={`mtr-${rowNodeId}`} inputProps={{ custom: true, label: '' }} onChange={handleClick} />
        </div>
    );
};

export default MokaTableRadioButton;
