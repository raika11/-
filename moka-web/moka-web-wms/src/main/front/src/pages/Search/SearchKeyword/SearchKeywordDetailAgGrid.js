import React from 'react';
import { useSelector } from 'react-redux';
import { MokaTable } from '@components';
import { GET_SEARCH_KEYWORD_STAT_DETAIL } from '@store/searchKeyword';
import columnDefs from './SearchKeywordDetailAgGridColumns';

const SearchKeywordDetailAgGrid = ({ type }) => {
    const list = useSelector(({ searchKeyword }) => searchKeyword.statDetail.list);
    const loading = useSelector(({ loading }) => loading[GET_SEARCH_KEYWORD_STAT_DETAIL]);

    return (
        <MokaTable
            paging={false}
            loading={loading}
            columnDefs={columnDefs.map((def) => {
                if (def.field === 'statDiv') {
                    return { ...def, headerName: type === 'DATE' ? '검색일' : '영역' };
                }
                return def;
            })}
            rowData={list}
            className="ag-grid-align-center flex-fill overflow-hidden"
            onRowNodeId={(row) => row.rank}
        />
    );
};

export default SearchKeywordDetailAgGrid;
