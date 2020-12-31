import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import columnDefs from './ArticleSourceAgGridColumns';
import { MokaTable } from '@/components';
import { GET_SOURCE_LIST, getSourceList, changeSearchOption } from '@store/articleSource';

/**
 * 수신 매체 AgGrid 테이블
 */
const ArticleSourceAgGrid = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const total = useSelector((store) => store.articleSource.total);
    const sourceList = useSelector((store) => store.articleSource.sourceList);
    const search = useSelector((store) => store.articleSource.search);
    const source = useSelector((store) => store.articleSource.source);
    const loading = useSelector((store) => store.loading[GET_SOURCE_LIST]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((row) => history.push(`/article-sources/${row.sourceCode}`), [history]);

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getSourceList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={sourceList}
            onRowNodeId={(row) => row.sourceCode}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            selected={source.sourceCode}
            onChangeSearchOption={handleChangeSearchOption}
            suppressRefreshCellAfterUpdate
        />
    );
};

export default ArticleSourceAgGrid;
