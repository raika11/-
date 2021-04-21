import React from 'react';
import Button from 'react-bootstrap/Button';
import { MokaSearchInput, MokaInput } from '@components';

/**
 * 페이지편집 > 기자 목록 > 기자 검색
 */
const Search = (props) => {
    const { onChangeSearchOption, search, jplusRepRows, onSearch, onReset } = props;

    return (
        <div className="d-flex mb-14 align-items-center">
            <div className="flex-shrink-0 mr-2">
                <MokaInput as="select" name="jplusRepDiv" value={search.jplusRepDiv} onChange={(e) => onChangeSearchOption({ key: e.target.name, value: e.target.value })}>
                    <option value="">전체</option>
                    {jplusRepRows &&
                        jplusRepRows.map((rep) => (
                            <option key={rep.cdOrd} value={rep.dtlCd}>
                                {rep.cdNm}
                            </option>
                        ))}
                    <option value="NL">일보기자</option>
                </MokaInput>
            </div>
            <MokaSearchInput
                name="keyword"
                className="flex-fill mr-1"
                value={search.keyword}
                onChange={(e) => onChangeSearchOption({ key: e.target.name, value: e.target.value })}
                onSearch={onSearch}
                placeholder="기자 이름을 검색하세요"
            />
            <Button variant="negative" onClick={onReset} className="flex-shrink-0">
                초기화
            </Button>
        </div>
    );
};

export default Search;
