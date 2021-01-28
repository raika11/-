import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MokaTable } from '@components';
import { initialState, GET_SEARCH_KEYWORD_STAT, changeStatSearchOption, getSearchKeywordStat } from '@store/searchKeyword';
import columnDefs from './SearchKeywordAgGridColumns';

/**
 * 검색로그 통계 테이블
 */
const SearchKeywordAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_SEARCH_KEYWORD_STAT]);
    const { search, list, total } = useSelector(({ searchKeyword }) => searchKeyword.stat);

    /**
     * 목록에서 Row클릭
     */
    const handleClickRow = (data) => history.push(`${match.path}/${data.schKwd}`);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(changeStatSearchOption(temp));
        dispatch(getSearchKeywordStat({ search: temp }));
    };

    /**
     * 테이블 sort 변경
     * @param {object} params instance
     */
    const handleSortChange = (params) => {
        const sortModel = params.api.getSortModel();
        const sort = sortModel[0] ? `${sortModel[0].colId},${sortModel[0].sort}` : initialState.stat.search.sort;
        let temp = { ...search, sort, page: 0 };
        dispatch(changeStatSearchOption(temp));
        dispatch(getSearchKeywordStat({ search: temp }));
    };

    return (
        <MokaTable
            columnDefs={columnDefs}
            loading={loading}
            rowData={list}
            className="overflow-hidden flex-fill"
            size={search.size}
            page={search.page}
            total={total}
            onRowNodeId={(row) => row.schKwd}
            onRowClicked={handleClickRow}
            onChangeSearchOption={handleChangeSearchOption}
            onSortChanged={handleSortChange}
        />
    );
};

export default SearchKeywordAgGrid;
