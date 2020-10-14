import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs, rowData } from './PageChildContainerAgGridColumns';

const PageChildContainerAgGrid = (props) => {
    return (
        <div className="ag-theme-moka-grid">
            <AgGridReact columnDefs={columnDefs} rowData={rowData} getRowNodeId={(params) => params.containerSeq} immutableData animateRows />
        </div>
    );
};

export default PageChildContainerAgGrid;
