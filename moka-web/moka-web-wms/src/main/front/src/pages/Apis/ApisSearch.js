import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@/components';

/**
 * API 검색
 */
const ApisSearch = () => {
    const history = useHistory();
    const [search, setSearch] = useState({
        searchType: 'apiName',
        keyword: '',
        method: 'all',
        usedYn: '',
    });

    const handleChangeValue = useCallback(
        (e) => {
            const { name, value } = e.target;
            setSearch({ ...search, [name]: value });
        },
        [search],
    );

    const handelClickAdd = () => {
        history.push('/apis/add');
    };

    return (
        <div className="mb-2">
            <Form className="mb-2 d-flex align-items-center justify-content-between">
                <div className="d-flex">
                    <MokaInput as="select" style={{ width: 70 }} className="mr-2" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                        <option value="apiName">API명</option>
                        <option value="route">경로</option>
                        <option value="desc">설명</option>
                    </MokaInput>
                    <MokaInput className="mr-2" style={{ width: 180 }} name="keyword" value={search.keyword} onChange={handleChangeValue} />
                    <MokaInput as="select" style={{ width: 100 }} className="mr-2" name="method" value={search.method} onChange={handleChangeValue}>
                        <option value="all">방식 전체</option>
                        <option value="get">GET</option>
                        <option value="post">POST</option>
                        <option value="put">PUT</option>
                        <option value="delete">DELETE</option>
                    </MokaInput>
                    <MokaInput as="select" style={{ width: 100 }} className="mr-2" name="usedYn" value={search.usedYn} onChange={handleChangeValue}>
                        <option value="">사용 전체</option>
                        <option value="Y">사용함</option>
                        <option value="N">사용안함</option>
                    </MokaInput>
                </div>
                <div className="d-flex">
                    <Button variant="searching" className="mr-2">
                        검색
                    </Button>
                    <Button variant="outline-neutral">초기화</Button>
                </div>
            </Form>
            <div className="d-flex justify-content-end">
                <Button variant="positive" onClick={handelClickAdd}>
                    신규 등록
                </Button>
            </div>
        </div>
    );
};

export default ApisSearch;
