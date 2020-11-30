import React from 'react';
import { useDispatch } from 'react-redux';
import { MokaTable } from '@components';
import columnDefs from './ComponentWorkHistoryAgGridColumns';
import { getDeskingWorkHistory } from '@store/desking';

const ComponentWorkHistoryAgGrid = (props) => {
    const { search, setSearch, total, loading, rowData, onChange } = props;
    const dispatch = useDispatch();

    const handleRowClicked = (row) => {
        setSearch({ ...search, componentHistorySeq: row.seq });
        dispatch(getDeskingWorkHistory(row.seq));
    };

    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(history) => history.seq}
            agGridHeight={558}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={onChange}
            preventRowClickCell={['load']}
        />
    );
};

export default ComponentWorkHistoryAgGrid;
