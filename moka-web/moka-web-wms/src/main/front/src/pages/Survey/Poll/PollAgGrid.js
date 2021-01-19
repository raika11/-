import React, { useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { columnDefs, rowData } from '@pages/Survey/Poll/PollAgGridColumns';
import produce from 'immer';

const PollAgGrid = ({ searchOptions, total, rows, loading, onChangeSearchOption }) => {
    const [rowData, setRowData] = useState([]);

    const handleChangeSearchOptions = (option) => {
        if (onChangeSearchOption instanceof Function) {
            onChangeSearchOption(
                produce(searchOptions, (draft) => {
                    draft[option.key] = option.value;
                }),
            );
        }
    };

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
                loading={loading}
                onChangeSearchOption={handleChangeSearchOptions}
                className="ag-grid-align-center"
            />
        </>
    );
};

export default PollAgGrid;
