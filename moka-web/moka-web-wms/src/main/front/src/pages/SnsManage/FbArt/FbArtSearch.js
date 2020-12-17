import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import { useDispatch } from 'react-redux';
import { changeSnsSendArticleSearchOptions } from '@store/snsManage';

const FbArtSearch = ({ searchOptions }) => {
    const dispatch = useDispatch();
    const [options, setOptions] = useState(searchOptions);

    const handleSearchReset = () => {
        console.log('handleSearchReset');
    };

    const handleClickSearch = () => {
        dispatch(changeSnsSendArticleSearchOptions(options));
    };

    const handleChangeValue = ({ target: { name, value } }) => {
        setOptions({ ...options, [name]: value });
    };

    return (
        <Form>
            <Form.Row className="mb-3">
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput as="select" value={options.searchType} className="m-0" name="type" onChange={handleChangeValue}>
                        <option value="articleTitle">제목</option>
                        <option value="totalId">기사ID</option>
                    </MokaInput>
                </Col>
                <Col xs={4} className="p-0 pr-2">
                    <MokaSearchInput name="keyword" placeholder={'검색어를 입력해 주세요.'} value={options.keyword} onChange={handleChangeValue} onSearch={handleClickSearch} />
                </Col>
                {/* 초기화 버튼 */}
                <Col xs={1} className="p-0">
                    <Button variant="outline-neutral" onClick={handleSearchReset}>
                        초기화
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default FbArtSearch;
