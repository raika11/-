import React, { useEffect, useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import { useSelector, useDispatch } from 'react-redux';

import { initialState, getQuizzesList, changeSearchOption } from '@store/survey/quiz';

const QuizSearch = ({ onAdd }) => {
    const dispatch = useDispatch();
    const [searchData, setSearchData] = useState(initialState.quizzes.search);

    // 공통 구분값 URL
    const { search } = useSelector((store) => ({
        search: store.quiz.quizzes.search,
    }));

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearchData({
            ...searchData,
            [name]: value,
        });
    };

    const handleClickSearchButton = () => {
        dispatch(changeSearchOption(searchData));
        dispatch(getQuizzesList());
    };

    useEffect(() => {
        setSearchData(search);
    }, [search]);

    // 최초 목록 가지고 오기.
    useEffect(() => {
        dispatch(getQuizzesList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form className="mb-14">
            <Form.Row>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="searchType" value={searchData.searchType} onChange={(e) => handleChangeValue(e)}>
                        <option value="all">전체</option>
                        <option value="title">그룹 제목</option>
                        <option value="quizSeq">그룹ID</option>
                    </MokaInput>
                </Col>
                <Col xs={9} className="p-0 pr-1">
                    <MokaSearchInput value={searchData.keyword} id="keyword" name="keyword" onChange={(e) => handleChangeValue(e)} onSearch={() => handleClickSearchButton()} />
                </Col>
                <Col xs={1} className="d-flex p-0">
                    <Button variant="positive" onClick={onAdd}>
                        등록
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default QuizSearch;
