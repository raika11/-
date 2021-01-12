import React from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Search/SearchLog/SearchLogAgGridColumns';

const SearchLogAgGrid = () => {
    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={[
                {
                    rank: '1',
                    keyword: '운세',
                    allCount: 2331,
                    pcCount: 1197,
                    mobileCount: 1134,
                },
                {
                    rank: '2',
                    keyword: '오늘의운세',
                    allCount: 2331,
                    pcCount: 1197,
                    mobileCount: 1134,
                },
                {
                    rank: '3',
                    keyword: '조현종',
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

export default SearchLogAgGrid;
