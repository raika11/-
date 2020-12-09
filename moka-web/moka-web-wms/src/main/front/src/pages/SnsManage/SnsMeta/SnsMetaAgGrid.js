import React, { useState, useEffect } from 'react';
import { tempColumnDefs } from './SnsMetaAgGridColumns';
import { MokaTable } from '@components';
import { useDispatch } from 'react-redux';
import { changeSNSMetaSearchOptions } from '@store/snsManage/snsAction';
import { useHistory } from 'react-router-dom';

const SnsMetaAgGrid = ({ rows, total, searchOptions, loading }) => {
    const dispatch = useDispatch();

    const [rowData, setRowData] = useState([]);
    const history = useHistory();

    const handleClickListRow = ({ id }) => {
        console.log(`/sns-meta/${id}`);
        history.push(`/sns-meta/${id}`);
        console.log('handleClickListRow');
    };

    const handleChangeSearchOption = (option) => {
        dispatch(changeSNSMetaSearchOptions({ ...searchOptions, [option.key]: option.value }));
    };

    const handleOnRowNodeId = () => {};

    useEffect(() => {
        setRowData(rows);
    }, [rows]);

    return (
        <>
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
                selected={(data) => {
                    console.log(data);
                }}
                className="sns-meta-ag-grid"
            />
        </>
    );
};

export default SnsMetaAgGrid;
