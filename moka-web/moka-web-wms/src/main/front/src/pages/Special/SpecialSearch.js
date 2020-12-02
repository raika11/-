import React, { useState, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';

const pageCd = [
    { id: 'all', name: '페이지 코드 전체' },
    { id: 'special', name: '디지털 스페셜(257)' },
    { id: 'ad', name: '디지털 AD(108)' },
    { id: 'etc', name: '기타' },
];

const type = [
    { id: 'title', name: '제목' },
    { id: 'dev', name: '담당자' },
];

const SpecialSearch = () => {
    const [tag, setTag] = useState('all');
    const [searchType, setSearchType] = useState('title');
    const [keyWord, setKeyWord] = useState('');

    const handleClickAdd = useCallback((e) => {}, []);

    const handleSearch = useCallback(() => {}, []);

    return (
        <Form>
            <Form.Row className="mb-3">
                <Col xs={3} className="p-0 pr-2">
                    <MokaInput as="select" className="m-0 ft-12" value={tag} onChange={(e) => setTag(e.target.value)}>
                        {pageCd.map((cd) => (
                            <option key={cd.id} value={cd.id}>
                                {cd.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" className="m-0 ft-12" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                        {type.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={4} className="p-0">
                    <MokaSearchInput className="m-0 ft-12" placeholder="검색어를 입력하세요" value={keyWord} onChange={(e) => setKeyWord(e.target.value)} onSearch={handleSearch} />
                </Col>
                <Col xs={3} className="p-0 d-flex justify-content-end">
                    <Button variant="positive" onClick={handleClickAdd}>
                        페이지 등록
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default SpecialSearch;
