import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';

const FbArtSearch = ({ searchOptions, onSearch, onReset }) => {
    const [options, setOptions] = useState(searchOptions);

    const handleSearchReset = () => {
        if (onReset instanceof Function) {
            onReset(setOptions);
        }
    };

    const handleClickSearch = () => {
        if (onSearch instanceof Function) {
            onSearch(options);
        }
    };

    const handleChangeValue = ({ target: { name, value } }) => {
        setOptions({ ...options, [name]: value });
    };

    return (
        <Form.Row className="mb-14">
            <Col xs={1} className="p-0 mr-2">
                <MokaInput as="select" value={options.searchType} name="type" onChange={handleChangeValue}>
                    <option value="articleTitle">제목</option>
                    <option value="totalId">기사ID</option>
                </MokaInput>
            </Col>
            <Col xs={4} className="p-0 mr-1">
                <MokaSearchInput name="keyword" value={options.keyword} onChange={handleChangeValue} onSearch={handleClickSearch} />
            </Col>
            {/* 초기화 버튼 */}
            <Col xs={1} className="p-0">
                <Button variant="negative" onClick={handleSearchReset} className="h-100">
                    초기화
                </Button>
            </Col>
        </Form.Row>
    );
};

export default FbArtSearch;
