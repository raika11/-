import React, { useState } from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Survey/Poll/components/RelationPollAgGridColumns';

const RelationPollModalAgGridComponent = ({ rowData, total, searchOptions, onRowClicked }) => {
    return (
        <MokaTable
            columnDefs={columnDefs}
            size={searchOptions.size}
            page={searchOptions.page}
            total={total}
            onRowNodeId={(row) => row.id}
            rowData={rowData}
            rowHeight={65}
            agGridHeight={600}
            onRowClicked={onRowClicked}
        />
    );
};

export default RelationPollModalAgGridComponent;
