import React from 'react';
import { GRID_ROW_HEIGHT } from '@/style_constants';
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
            rowHeight={GRID_ROW_HEIGHT.C[0]}
            agGridHeight={600}
            onRowClicked={onRowClicked}
            onChangeSearchOption={onChangeSearch}
        />
    );
};

export default RelationPollModalAgGridComponent;
