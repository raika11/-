import React, { useState, useEffect } from 'react';
import { tempColumnDefs } from './SnsMetaAgGridColumns';
import { MokaTable } from '@components';
import { useDispatch } from 'react-redux';
import { changeSnsMetaSearchOptions } from '@store/snsManage/snsAction';
import { useHistory } from 'react-router-dom';

const SnsMetaAgGrid = ({ rows, total, searchOptions, loading, selected }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [rowData, setRowData] = useState([]);

    const handleClickListRow = ({ id }) => {
        history.push(`/sns-meta/${id}`);
    };

    const handleChangeSearchOption = (option) => {
        dispatch(changeSnsMetaSearchOptions({ ...searchOptions, [option.key]: option.value }));
    };

    useEffect(() => {
        setRowData(rows);
    }, [rows]);

    return (
        <MokaTable
            agGridHeight={650}
            columnDefs={tempColumnDefs}
            rowData={rowData}
            rowHeight={65}
            onRowNodeId={(row) => row.id}
            onRowClicked={(row) => {
                handleClickListRow(row);
            }}
            loading={loading}
            total={total}
            page={searchOptions.page}
            size={searchOptions.size}
            onChangeSearchOption={handleChangeSearchOption}
            selected={selected}
            preventRowClickCell={['insStatus', 'sendType']}
            className="ag-grid-align-center overflow-hidden flex-fill"
        />
    );
};

export default SnsMetaAgGrid;
