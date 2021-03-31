import React from 'react';
import Button from 'react-bootstrap/Button';
import { initialState } from '@store/columnist';
import { MokaInputLabel, MokaSearchInput } from '@components';

/**
 * 페이지편집 > 칼럼니스트 > 검색
 */
const Search = (props) => {
    const { onChangeSearchOption, search, onSearch, onReset } = props;

    return (
        <div className="mb-14 d-flex">
            {/* 검색조건 */}
            <div className="flex-shrink-0 mr-2">
                <MokaInputLabel as="select" name="status" value={search.status} onChange={(e) => onChangeSearchOption({ key: e.target.name, value: e.target.value })}>
                    {initialState.statusSearchTypeList.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </MokaInputLabel>
            </div>

            {/* 이름 검색 */}
            <MokaSearchInput
                name="keyword"
                placeholder="칼럼니스트 이름을 검색하세요"
                value={search.keyword}
                onChange={(e) => onChangeSearchOption({ key: e.target.name, value: e.target.value })}
                onSearch={onSearch}
                className="flex-fill mr-1"
            />

            {/* 초기화 버튼 */}
            <Button variant="negative" onClick={onReset} className="flex-shrink-0">
                초기화
            </Button>
        </div>
    );
};

export default Search;
