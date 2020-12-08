import React from 'react';
import { MokaTable } from '@components';
import columnDefs from './ComponentWorkHistoryAgGridColumns';

const ComponentWorkHistoryAgGrid = (props) => {
    const { search, total, loading, rowData, onChange, onRowClick } = props;

    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(history) => history.seq}
            agGridHeight={558}
            onRowClicked={onRowClick}
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
