import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { initialState, changeSearchOption, getCdnArticleList } from '@store/cdnArticle';
import { MokaInput, MokaSearchInput } from '@components';

/**
 * cdn 기사 검색
 */
const ArticleCdnSearch = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [search, setSearch] = useState(initialState.search);
    const storeSearch = useSelector(({ cdnArticle }) => cdnArticle.search);

    /**
     * 입력 값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        let ns = { ...search, page: 0 };
        dispatch(changeSearchOption(ns));
        dispatch(getCdnArticleList({ search: ns }));
    };

    /**
     * 초기화
     */
    const handleReset = () => setSearch(initialState.search);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getCdnArticleList({ search: initialState.search }));
    }, [dispatch]);

    return (
        <Form className="mb-2">
            <Form.Row className="mb-2 d-flex">
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                        {initialState.searchTypeList.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={10} className="p-0 d-flex">
                    <MokaSearchInput value={search.keyword} name="keyword" className="mr-2 flex-fill" onChange={handleChangeValue} onSearch={handleSearch} />
                    <Button variant="negative" className="flex-shrink-0" onClick={handleReset}>
                        초기화
                    </Button>
                </Col>
            </Form.Row>
            <div className="d-flex justify-content-end">
                <Button variant="positive" onClick={() => history.push(`${match.path}/add`)}>
                    등록
                </Button>
            </div>
        </Form>
    );
};

export default ArticleCdnSearch;
