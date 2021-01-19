import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@/components';
import columnDefs, { rowData } from './ApisAgGridColumns';

/**
 * API 목록 AgGrid
 */
const ApisAgGrid = () => {
    const history = useHistory();
    const [loading] = useState(false);
    const [total] = useState(0);
    const [search] = useState({ page: 0, size: 20 });

    const handleRowClicked = useCallback(
        (row) => {
            history.push(`/apis/${row.seqNo}`);
        },
        [history],
    );

    const handleChangeSearchOption = useCallback((search) => {
        console.log(search);
    }, []);

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

export default ApisAgGrid;
