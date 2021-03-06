import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MokaTable } from '@components';
import { GET_SEARCH_KEYWORD_STAT_DETAIL, changeDetailSearchOption, getSearchKeywordStatDetail } from '@store/searchKeyword';
import columnDefs from './SearchKeywordDetailAgGridColumns';

const SearchKeywordDetailAgGrid = ({ type }) => {
    const dispatch = useDispatch();
    const { total, search, list } = useSelector(({ searchKeyword }) => ({
        total: searchKeyword.statDetail.total,
        search: searchKeyword.statDetail.search,
        list: searchKeyword.statDetail.list,
    }));
    const loading = useSelector(({ loading }) => loading[GET_SEARCH_KEYWORD_STAT_DETAIL]);
    const [rowData, setRowData] = useState([]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(changeDetailSearchOption(temp));
        dispatch(getSearchKeywordStatDetail({ search: temp }));
    };

    useEffect(() => {
        setRowData(
            list.map((data, idx) => {
                return { ...data, rowId: `${data.rank}.${idx}.${data.schKwd}` };
            }),
        );
    }, [list]);

    return (
        <MokaTable
            loading={loading}
            columnDefs={columnDefs.map((def) => {
                if (def.field === 'statDiv') {
                    return { ...def, headerName: type === 'DATE' ? '검색일' : '영역' };
                }
                return def;
            })}
            page={search.page}
            size={search.size}
            total={total}
            rowData={rowData}
            className="ag-grid-align-center flex-fill overflow-hidden"
            onRowNodeId={(row) => row.rowId}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default SearchKeywordDetailAgGrid;
