import React, { useState, useCallback } from 'react';
import { MokaTable } from '@components';
import columnDefs from './DeskingHistoryAgGridColumns';

const DeskingHistoryAgGrid = () => {
    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });

    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    const handleRowClicked = useCallback((row) => {
        console.log(row);
    }, []);

    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={total}
            onRowNodeId={(params) => params.containerSeq}
            agGridHeight={558}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default DeskingHistoryAgGrid;
