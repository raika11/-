import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { getHttpMethod } from '@store/codeMgt';
import { initialState, getInternalApiList, changeSearchOption } from '@store/internalApi';
import { MokaInput, MokaSearchInput } from '@/components';

/**
 * API 관리 > API 목록 > 검색
 */
const InternalApiSearch = ({ match }) => {
    const history = useHistory();
    const [search, setSearch] = useState(initialState.search);
    const storeSearch = useSelector(({ internalApi }) => internalApi.search);
    const httpMethodRows = useSelector(({ codeMgt }) => codeMgt.httpMethodRows);
    const dispatch = useDispatch();

    /**
     * 입력값 변경
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
        dispatch(getInternalApiList({ search: ns }));
    };

    /**
     * 신규 등록
     */
    const handleClickAdd = () => history.push(`${match.path}/add`);

    /**
     * 초기화
     */
    const handleClickReset = () => setSearch(initialState.search);

    useEffect(() => {
        if (!httpMethodRows) {
            dispatch(getHttpMethod());
        }
    }, [httpMethodRows, dispatch]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(
            getInternalApiList({
                search: initialState.search,
            }),
        );
    }, [dispatch]);

    return (
        <Form.Row className="mb-14">
            <Col xs={4} className="d-flex p-0 pr-2">
                <MokaInput as="select" name="apiMethod" value={search.apiMethod} onChange={handleChangeValue}>
                    <option value="">방식 전체</option>
                    {httpMethodRows &&
                        httpMethodRows.map((method) => (
                            <option key={method.id} value={method.id}>
                                {method.name}
                            </option>
                        ))}
                </MokaInput>
                <div className="flex-shrink-0 ml-2">
                    <MokaInput as="select" name="usedYn" value={search.usedYn} onChange={handleChangeValue}>
                        {initialState.usedYnList.map((li) => (
                            <option key={li.id} value={li.id}>
                                {li.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>
            </Col>
            <Col xs={8} className="d-flex p-0">
                <div className="flex-shrink-0 mr-2">
                    <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                        {initialState.searchTypeList.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>
                <MokaSearchInput
                    className="flex-fill mr-1"
                    name="keyword"
                    value={search.keyword}
                    placeholder="검색어를 입력하세요"
                    onChange={handleChangeValue}
                    onSearch={handleSearch}
                />
                <Button variant="negative" className="flex-shrink-0 mr-1" onClick={handleClickReset}>
                    초기화
                </Button>
                <Button variant="positive" className="flex-shrink-0" onClick={handleClickAdd}>
                    등록
                </Button>
            </Col>
        </Form.Row>
    );
};

export default InternalApiSearch;
