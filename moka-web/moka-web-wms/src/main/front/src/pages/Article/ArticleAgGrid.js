import React, { useState, useEffect, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MokaTable } from '@components';
import { GET_ARTICLE_LIST, getArticleList, changeSearchOption } from '@store/article';
import columnDefs from './ArticleAgGridColums';

const ArticleAgGrid = forwardRef((props, ref) => {
    const { onRowDragMove } = props;

    const dispatch = useDispatch();
    const { search, list, total, error, loading } = useSelector((store) => ({
        search: store.article.search,
        list: store.article.list,
        total: store.article.total,
        error: store.article.error,
        loading: store.loading[GET_ARTICLE_LIST],
    }));

    // state
    const [rowDate, setRowData] = useState([]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = () => {};

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(getArticleList(changeSearchOption(temp)));
    };

    /**
     * 드래그
     */
    const handleRowDragMove = () => {
        if (typeof onRowDragMove === 'function') {
            onRowDragMove();
        }
    };

    useEffect(() => {
        setRowData(
            list.map((art) => ({
                ...art,
            })),
        );
    }, [list]);

    return (
        <MokaTable
            ref={ref}
            headerHeight={50}
            agGridHeight={623}
            columnDefs={columnDefs}
            rowData={[rowDate]}
            onRowNodeId={(article) => article.totalId}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            showTotalString={false}
            error={error}
            onChangeSearchOption={handleChangeSearchOption}
            onRowDragMove={handleRowDragMove}
        />
    );
});

export default ArticleAgGrid;
