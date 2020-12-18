import React, { useState, useEffect } from 'react';
import { tempColumnDefs } from './FbArtAgGridColumns';
import { MokaTable } from '@components';
import { changeSnsSendArticleSearchOptions } from '@store/snsManage';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const FbArtAgGrid = ({ rows, total, searchOptions, loading, selected }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [rowData, setRowData] = useState([]);

    // 임시
    const handleOnRowNodeId = () => {};

    const handleClickListRow = ({ id }) => {
        history.push(`/fb-art/${id}`);
    };

    const handleChangeSearchOption = (option) => {
        dispatch(changeSnsSendArticleSearchOptions({ ...searchOptions, [option.key]: option.value }));
    };

    return (
        <>
            <MokaTable
                agGridHeight={650}
                columnDefs={tempColumnDefs}
                rowData={rows}
                rowHeight={65}
                onRowNodeId={(row) => row.id}
                onRowClicked={handleClickListRow}
                loading={loading}
                total={total}
                page={searchOptions.page}
                size={searchOptions.size}
                onChangeSearchOption={handleChangeSearchOption}
                selected={selected}
            />
        </>
    );
};

export default FbArtAgGrid;
