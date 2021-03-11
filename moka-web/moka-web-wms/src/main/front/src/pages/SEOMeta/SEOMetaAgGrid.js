import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/SEOMeta/SEOMetaAgGridColumn';
import { changeSeoMetaSearchOptions, GET_SEO_META_LIST, getSeoMetaList } from '@store/seoMeta';
import { ARTICLE_URL } from '@/constants';

/**
 * SEO 메타 AgGrid
 */
const SEOMetaAgGrid = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const list = useSelector((store) => store.seoMeta.list);
    const search = useSelector((store) => store.seoMeta.search);
    const total = useSelector((store) => store.seoMeta.total);
    const totalId = useSelector((store) => store.seoMeta.seoMeta.totalId);
    const loading = useSelector((store) => store.loading[GET_SEO_META_LIST]);

    const [rowData, setRowData] = useState([]);

    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(changeSeoMetaSearchOptions(temp));
        dispatch(getSeoMetaList(temp));
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
        <MokaTable
            columnDefs={columnDefs}
            className="overflow-hidden flex-fill"
            rowData={rowData}
            size={search.size}
            page={search.page}
            total={total}
            onRowNodeId={(row) => row.totalId}
            onChangeSearchOption={handleChangeSearchOption}
            onRowClicked={(data, param) => {
                if (param.type === 'cellClicked' && param.column.colId === 'artTitle') {
                    window.open(`${ARTICLE_URL}${data.totalId}`, 'pop', '');
                }
            }}
            selected={totalId}
            loading={loading}
        />
    );
};

export default SEOMetaAgGrid;
