import React, { useState, useCallback } from 'react';
import { MokaTable } from '@components';
import columnDefs from './DeskingWorkHistoryAgGridColumns';

const DeskingWorkHistoryAgGrid = () => {
    const [loading] = useState(false);

    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    const handleRowClicked = useCallback((row) => {
        console.log(row);
    }, []);

    return (
        <MokaTable
            columnDefs={columnDefs}
            // rowData={total}
            onRowNodeId={(params) => params.containerSeq}
            agGridHeight={721}
            onRowClicked={handleRowClicked}
            loading={loading}
            paging={false}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default DeskingWorkHistoryAgGrid;
