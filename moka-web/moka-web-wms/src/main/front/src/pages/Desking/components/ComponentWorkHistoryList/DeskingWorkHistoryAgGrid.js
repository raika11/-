import React, { useCallback } from 'react';
import { MokaTable } from '@components';
import columnDefs from './DeskingWorkHistoryAgGridColumns';

const DeskingWorkHistoryAgGrid = (props) => {
    const { loading, rowData } = props;

    const handleRowClicked = useCallback((row) => {
        // console.log(row);
    }, []);

    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(history) => history.histSeq}
            agGridHeight={721}
            onRowClicked={handleRowClicked}
            loading={loading}
            paging={false}
        />
    );
};

export default DeskingWorkHistoryAgGrid;
