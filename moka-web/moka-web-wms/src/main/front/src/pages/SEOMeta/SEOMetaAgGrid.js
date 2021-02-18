import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/SEOMeta/SEOMetaAgGridColumn';
import { changeSeoMetaSearchOptions, GET_SEO_META_LIST } from '@store/seoMeta';

/**
 * SEO 메타 AgGrid
 */
const SEOMetaAgGrid = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { list, search, total, totalId, loading } = useSelector(
        (store) => ({
            list: store.seoMeta.list,
            search: store.seoMeta.search,
            total: store.seoMeta.total,
            totalId: store.seoMeta.seoMeta.totalId,
            loading: store.loading[GET_SEO_META_LIST],
        }),
        shallowEqual,
    );
    const [rowData, setRowData] = useState([]);

    const handleChangeSearchOptions = (option) => {
        dispatch(changeSeoMetaSearchOptions({ ...search, [option.key]: option.value }));
    };

    const handleClickDetailView = useCallback(
        (totalId) => {
            history.push(`${match.path}/${totalId}`);
        },
        [history, match.path],
    );

    useEffect(() => {
        setRowData(
            list.map((l) => ({
                ...l,
                button: l.isInsert
                    ? { name: '등록', variant: 'outline-table-btn', onClick: handleClickDetailView }
                    : { name: '수정', variant: 'outline-table-btn', onClick: handleClickDetailView },
            })),
        );
    }, [handleClickDetailView, list]);

    return (
        <>
            <MokaTable
                columnDefs={columnDefs}
                agGridHeight={625}
                rowData={rowData}
                size={search.size}
                page={search.page}
                total={total}
                onRowNodeId={(row) => row.totalId}
                onChangeSearchOption={handleChangeSearchOptions}
                onRowClicked={(data, param) => {
                    if (param.type === 'cellClicked' && param.column.colId === 'artTitle') {
                        window.open(`https://mnews.joins.com/article/${data.totalId}`, 'articlePop', 'width=500');
                    }
                }}
                selected={totalId}
                loading={loading}
            />
        </>
    );
};

export default SEOMetaAgGrid;
