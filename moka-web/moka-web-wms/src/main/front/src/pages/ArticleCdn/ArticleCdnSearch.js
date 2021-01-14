import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';

const ArticleCdnSearch = ({ match }) => {
    const history = useHistory();
    const [search, setSearch] = useState({});

    /**
     * 입력 값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * 검색 버튼
     */
    const handleSearch = () => {
        console.log('검색');
    };

    /**
     * 키 입력
     * @param {object} e 이벤트
     */
    const handleKeyPress = (e) => {
        // 엔터 기본 동작 막음
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    /**
     * 초기화
     */
    const handleReset = () => {
        setSearch({});
    };

    return (
        <Form className="mb-2">
            <Form.Row className="mb-2 d-flex">
                <div className="flex-fill mr-2">
                    <MokaInput placeholder="제목을 입력하세요" value={search.title} name="title" onChange={handleChangeValue} onKeyPress={handleKeyPress} />
                </div>
                <MokaSearchInput
                    placeholder="기사 ID를 입력하세요"
                    value={search.totalId}
                    name="totalId"
                    className="mr-2 flex-fill"
                    onChange={handleChangeValue}
                    onSearch={handleSearch}
                />
                <Button variant="negative" className="flex-shrink-0" onClick={handleReset}>
                    초기화
                </Button>
            </Form.Row>
            <Form.Row className="d-flex justify-content-end">
                <Button variant="positive" onClick={() => history.push(`${match.path}/add`)}>
                    등록
                </Button>
            </Form.Row>
        </Form>
    );
};

export default ArticleCdnSearch;
