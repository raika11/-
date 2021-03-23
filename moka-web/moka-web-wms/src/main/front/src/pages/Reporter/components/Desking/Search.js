import React from 'react';
import { MokaSearchInput } from '@components';

/**
 * 페이지편집 > 기자 목록 > 기자 검색
 */
const Search = (props) => {
    const { onChangeSearchOption, search, onSearch } = props;

    return (
        <React.Fragment>
            <MokaSearchInput
                name="keyword"
                className="mb-14"
                value={search.keyword}
                onChange={(e) => onChangeSearchOption({ key: e.target.name, value: e.target.value })}
                onSearch={onSearch}
                placeholder="기자 이름을 검색하세요"
            />
        </React.Fragment>
    );
};

export default Search;
