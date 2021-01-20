import React, { useState, useCallback } from 'react';
import { MokaTable } from '@/components';
import columnDefs, { rowData } from './RunStateSearchAgGridColumns';

const RunStateSearchAgGrid = () => {
    const [loading] = useState(false);
    const [total] = useState(0);
    const [search] = useState({ page: 0, size: 20 });

    const handleRowClicked = useCallback((row) => {
        console.log(row);
    }, []);

    const handleChangeSearchOption = useCallback((search) => {}, []);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(row) => row.seqNo}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            // selected={source.sourceCode}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default RunStateSearchAgGrid;
