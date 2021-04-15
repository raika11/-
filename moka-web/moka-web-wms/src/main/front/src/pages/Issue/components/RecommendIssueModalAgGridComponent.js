import React from 'react';
import { GRID_ROW_HEIGHT } from '@/style_constants';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Issue/components/RecommendIssueModalAgGridColumns';

const RecommendIssueModalAgGridComponent = ({ rowData, total, searchOptions, onRowClicked, onChangeSearch, loading }) => {
    return (
        <MokaTable
            columnDefs={columnDefs}
            size={searchOptions.size}
            page={searchOptions.page}
            total={total}
            onRowNodeId={(row) => row.pkgSeq}
            rowData={rowData}
            rowHeight={GRID_ROW_HEIGHT.C[0]}
            agGridHeight={600}
            onRowClicked={onRowClicked}
            onChangeSearchOption={onChangeSearch}
            loading={loading}
        />
    );
};

export default RecommendIssueModalAgGridComponent;
