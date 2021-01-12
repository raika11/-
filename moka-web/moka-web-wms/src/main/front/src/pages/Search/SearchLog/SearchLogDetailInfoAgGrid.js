import React from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Search/SearchLog/SearchLogDetailInfoAgGridColumn';

const SearchLogDetailInfoAgGrid = () => {
    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={[
                {
                    rank: '1',
                    searchDate: '2021-01-12',
                    allCount: 2331,
                    pcCount: 1197,
                    mobileCount: 1134,
                },
                {
                    rank: '2',
                    searchDate: '2020-11-04',
                    allCount: 2331,
                    pcCount: 1197,
                    mobileCount: 1134,
                },
                {
                    rank: '3',
                    searchDate: '2020-10-02',
                    allCount: 2331,
                    pcCount: 1197,
                    mobileCount: 1134,
                },
            ]}
            className="ag-grid-align-center"
            agGridHeight={430}
            size={20}
            page={0}
            total={3}
        />
    );
};

export default SearchLogDetailInfoAgGrid;
