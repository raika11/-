import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import produce from 'immer';
import { MokaTable } from '@components';
import { changeSnsMetaSearchOptions } from '@store/snsManage/snsAction';
import columnDefs from './SnsMetaAgGridColumns';
import EditImageRenderer from '@pages/SnsManage/SnsMeta/component/EditImageRenderer';

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
            columnDefs={columnDefs}
            rowData={rowData}
            rowHeight={46}
            onRowNodeId={(row) => row.id}
            onRowClicked={(row) => handleClickListRow(row)}
            loading={loading}
            total={total}
            page={searchOptions.page}
            size={searchOptions.size}
            onChangeSearchOption={handleChangeSearchOption}
            selected={selected}
            preventRowClickCell={['insStatus']}
            className="ag-grid-align-center overflow-hidden flex-fill"
            frameworkComponents={{ editImageRenderer: EditImageRenderer }}
        />
    );
};

export default SnsMetaAgGrid;
