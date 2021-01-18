import React, { useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { columnDefs, rowData } from '@pages/Survey/Poll/PollAgGridColumns';

const PollAgGrid = ({ searchOptions, total, rows }) => {
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        setRowData(rows);
    }, [rows]);
    return (
        <>
            <MokaTable
                columnDefs={columnDefs}
                onRowNodeId={(row) => row.id}
                agGridHeight={585}
                rowData={rowData}
                page={searchOptions.page}
                size={searchOptions.size}
                total={total}
                rowHeight={65}
                className="ag-grid-align-center"
            />
        </>
    );
};

export default PollAgGrid;
