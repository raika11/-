import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import produce from 'immer';
import { MokaTable } from '@components';
import { changeSnsMetaSearchOptions } from '@store/snsManage/snsAction';
import columnDefs from './SnsMetaAgGridColumns';
import { GRID_ROW_HEIGHT, GRID_HEADER_HEIGHT } from '@/style_constants';

/**
 * FB & TW AgGrid
 */
const SnsMetaAgGrid = ({ rows, total, searchOptions, loading, selected }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [rowData, setRowData] = useState([]);

    const handleClickListRow = ({ id }) => {
        history.push(`/sns-meta/${id}`);
    };

    const handleChangeSearchOption = (option) => {
        const name = option.key;
        const value = option.value;
        const options = { ...searchOptions };
        dispatch(
            changeSnsMetaSearchOptions(
                //{ ...searchOptions, [option.key]: option.value, page: 0 })
                produce(options, (draft) => {
                    draft[name] = value;
                    if (name === 'size') {
                        draft['page'] = 0;
                    }
                }),
            ),
        );
    };

    useEffect(() => {
        setRowData(rows);
    }, [rows]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            headerHeight={GRID_HEADER_HEIGHT[0]}
            groupHeaderHeight={GRID_HEADER_HEIGHT[0]}
            rowHeight={GRID_ROW_HEIGHT.C[1]}
            onRowNodeId={(row) => row.id}
            onRowClicked={(row) => handleClickListRow(row)}
            loading={loading}
            total={total}
            page={searchOptions.page}
            size={searchOptions.size}
            onChangeSearchOption={handleChangeSearchOption}
            selected={selected}
            preventRowClickCell={['insStatus']}
            refreshCellsParams={{
                force: true,
            }}
        />
    );
};

export default SnsMetaAgGrid;
