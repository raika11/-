import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { initialState, getInternalApiList, changeSearchOption } from '@store/internalApi';
import { MokaInput } from '@/components';

/**
 * API 검색
 */
const InternalApiSearch = ({ match }) => {
    const history = useHistory();
    const [search, setSearch] = useState(initialState.search);
    const storeSearch = useSelector(({ internalApi }) => internalApi.search);
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
        <Form className="mb-2">
            <Form.Row className="mb-2">
                <Col xs={5} className="d-flex p-0 pr-2">
                    <div className="flex-shrink-0 mr-2">
                        <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                            {initialState.searchTypeList.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </MokaInput>
                    </div>
                    <MokaInput name="keyword" value={search.keyword} onChange={handleChangeValue} />
                </Col>
                <Col xs={4} className="d-flex p-0 pr-2">
                    <MokaInput as="select" name="apiMethod" value={search.apiMethod} onChange={handleChangeValue}>
                        {initialState.apiMethodList.map((method) => (
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
                <Col xs={3} className="p-0 d-flex justify-content-end">
                    <Button variant="searching" className="mr-2" onClick={handleSearch}>
                        검색
                    </Button>
                    <Button variant="outline-neutral" onClick={handleClickReset}>
                        초기화
                    </Button>
                </Col>
            </Form.Row>
            <div className="float-right">
                <Button variant="positive" onClick={handleClickAdd}>
                    신규 등록
                </Button>
            </div>
        </Form>
    );
};

export default InternalApiSearch;
