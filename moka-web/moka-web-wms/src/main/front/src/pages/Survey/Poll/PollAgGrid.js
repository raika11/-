import React, { useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { columnDefs, rowData } from '@pages/Survey/Poll/PollAgGridColumns';
import produce from 'immer';
import { useHistory } from 'react-router-dom';

const PollAgGrid = ({ searchOptions, total, rows, loading, onChangeSearchOption }) => {
    const history = useHistory();
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

    const handleClickRow = ({ id }) => {
        history.push(`/poll/${id}`);
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
                onRowClicked={handleClickRow}
                className="ag-grid-align-center"
            />
        </>
    );
};

export default PollAgGrid;
