import React from 'react';
import { MokaTable } from '@components';
import columnDefs from './DeskingWorkHistoryListColumns';

const DeskingWorkHistoryList = (props) => {
    const { loading, rowData } = props;

    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(history) => history.histSeq}
            agGridHeight={721}
            onRowClicked={() => {}}
            loading={loading}
            paging={false}
        />
    );
};

export default DeskingWorkHistoryList;
