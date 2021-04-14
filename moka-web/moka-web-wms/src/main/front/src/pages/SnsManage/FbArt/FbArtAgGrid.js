import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import columnDefs from './FbArtAgGridColumns';
import { changeSnsSendArticleSearchOptions } from '@store/snsManage';
import { MokaTable } from '@components';
import { GRID_ROW_HEIGHT } from '@/style_constants';

const FbArtAgGrid = ({ rows, total, searchOptions, loading, selected }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const handleClickListRow = ({ id }) => {
        history.push(`/fb-art/${id}`);
    };

    const handleChangeSearchOption = (option) => {
        dispatch(changeSnsSendArticleSearchOptions({ ...searchOptions, [option.key]: option.value }));
    };

    return (
        <MokaTable
            className="flex-fill overflow-hidden"
            columnDefs={columnDefs}
            rowData={rows}
            rowHeight={GRID_ROW_HEIGHT.C[0]}
            onRowNodeId={(row) => row.id}
            onRowClicked={handleClickListRow}
            loading={loading}
            total={total}
            page={searchOptions.page}
            size={searchOptions.size}
            onChangeSearchOption={handleChangeSearchOption}
            selected={selected}
            preventRowClickCell={['id']}
        />
    );
};

export default FbArtAgGrid;
