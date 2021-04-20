import React, { useEffect, useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { MokaInput, MokaSearchInput } from '@components';
import { initialState, getQuizzesList, changeSearchOption } from '@store/survey/quiz';

/**
 * 퀴즈관리 > 검색
 */
const QuizSearch = ({ onAdd }) => {
    const dispatch = useDispatch();
    const [searchData, setSearchData] = useState(initialState.quizzes.search);
    const search = useSelector(({ quiz }) => quiz.quizzes.search);

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

    useEffect(() => {
        // 최초 목록 가지고 오기
        dispatch(getQuizzesList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form.Row className="mb-14">
            <Col xs={2} className="p-0 pr-2">
                <MokaInput as="select" name="searchType" value={searchData.searchType} onChange={(e) => handleChangeValue(e)}>
                    <option value="title">퀴즈 제목</option>
                    <option value="quizSeq">퀴즈ID</option>
                </MokaInput>
            </Col>
            <Col xs={10} className="p-0 d-flex">
                <MokaSearchInput
                    value={searchData.keyword}
                    id="keyword"
                    name="keyword"
                    className="mr-1 flex-fill"
                    onChange={(e) => handleChangeValue(e)}
                    onSearch={() => handleClickSearchButton()}
                />
                <Button variant="positive" onClick={onAdd}>
                    등록
                </Button>
            </Col>
        </Form.Row>
    );
};

export default QuizSearch;
