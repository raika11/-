import React from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Survey/Poll/components/RelationPollAgGridColumns';

const RelationPollModalAgGridComponent = ({ rowData, total, searchOptions, onRowClicked, onChangeSearch }) => {
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
            onChangeSearchOption={onChangeSearch}
        />
    );
};

export default RelationPollModalAgGridComponent;
