import React from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Search/SearchLog/SearchLogOverallStatusAgGridColumns';

const SearchLogOverallStatusAgGrid = () => {
    return (
        <MokaTable
            paging={false}
            columnDefs={columnDefs}
            rowData={[
                {
                    searchCount: 1338,
                    allCount: 2331,
                    pcCount: 1197,
                    mobileCount: 1134,
                },
            ]}
            className="ag-grid-align-center"
            agGridHeight={100}
            onRowNodeId={(row) => row.searchCount}
        />
    );
};

export default SearchLogOverallStatusAgGrid;
