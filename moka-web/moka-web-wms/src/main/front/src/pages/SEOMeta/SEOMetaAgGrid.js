import React, { useCallback, useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/SEOMeta/SEOMetaAgGridColumn';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { changeSeoMetaSearchOptions } from '@store/seoMeta';

const SEOMetaAgGrid = ({ rows, searchOptions, total }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [rowData, setRowData] = useState([]);

    const handleChangeSearchOptions = (option) => {
        dispatch(changeSeoMetaSearchOptions({ ...searchOptions, [option.key]: option.value }));
    };

    const handleClickDetailView = useCallback(
        (totalId) => {
            history.push(`/seo-meta/${totalId}`);
        },
        [history],
    );

    useEffect(() => {
        setRowData(
            rows.map((row) => ({
                ...row,
                button: row.isInsert
                    ? { name: '등록', variant: 'outline-table-btn', onClick: handleClickDetailView }
                    : { name: '수정', variant: 'outline-table-btn', onClick: handleClickDetailView },
            })),
        );
    }, [handleClickDetailView, rows]);

    return (
        <>
            <MokaTable
                columnDefs={columnDefs}
                agGridHeight={625}
                rowData={rowData}
                size={searchOptions.size}
                page={searchOptions.page}
                total={total}
                onRowNodeId={(row) => row.id}
                onChangeSearchOption={handleChangeSearchOptions}
            />
        </>
    );
};

export default SEOMetaAgGrid;
