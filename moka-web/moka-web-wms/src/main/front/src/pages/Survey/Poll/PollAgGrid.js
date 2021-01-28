import React, { useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Survey/Poll/PollAgGridColumns';
import produce from 'immer';
import { useHistory } from 'react-router-dom';

const PollAgGrid = ({ searchOptions, total, pollSeq, rows, loading, onChangeSearchOption, onDelete }) => {
    const history = useHistory();
    const [rowData, setRowData] = useState([]);
    const [selected, setSelected] = useState(null);

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
        setRowData(rows.map((row) => ({ ...row, onDelete })));
    }, [onDelete, rows]);

    useEffect(() => {
        if (rowData.length > 0) {
            setSelected(pollSeq);
        }
    }, [pollSeq, rowData.length]);

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
                selected={selected}
                className="ag-grid-align-center"
                preventRowClickCell={['delete', 'preview']}
            />
        </>
    );
};

export default PollAgGrid;
