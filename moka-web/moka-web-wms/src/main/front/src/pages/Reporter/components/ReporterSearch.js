import React from 'react';
import Button from 'react-bootstrap/Button';
import { MokaSearchInput } from '@components';

/**
 * 리포터 검색 컴포넌트
 */
const ReporterSearch = ({ search, callback, onChange, onSearch, onReset }) => {
    return (
        <div className="d-flex mb-2">
            <MokaSearchInput value={search.keyword} onChange={onChange} onSearch={onSearch} name="search" className="mr-2" />
            <Button variant="outline-neutral" onClick={onReset}>
                초기화
            </Button>
        </div>
    );
};

export default ReporterSearch;
