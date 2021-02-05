import React, { useEffect, useState, useCallback } from 'react';
import { MokaModal, MokaTable, MokaInput, MokaSearchInput, MokaCard } from '@components';
import { Form, Col, Button } from 'react-bootstrap';
import { columnDefs } from './QuestionSearchModalGridColumns';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, GET_QUESTIONS_LIST, getQuestionsList, changeQuestionsListSearchOption } from '@store/survey/quiz';

/**
 * 검색 모달.
 */
const QuestionSearchModal = (props) => {
    const dispatch = useDispatch();
    const { show, onHide } = props;
    const [rowData, setRowData] = useState([]);
    const [searchData, setSearchData] = useState(initialState.quizQuestionList.search);

    const { list, total, search, loading } = useSelector((store) => ({
        list: store.quiz.quizQuestionList.list,
        total: store.quiz.quizQuestionList.total,
        search: store.quiz.quizQuestionList.search,
        loading: store.loading[GET_QUESTIONS_LIST],
    }));

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearchData({
            ...searchData,
            [name]: value,
        });
    };
    //검색 버튼 처리.
    const handleClickSearchButton = () => {
        dispatch(changeQuestionsListSearchOption(searchData));
        dispatch(getQuestionsList());
    };

    // 리셋버튼 처리.
    const handleClickSearchResetButton = () => {
        dispatch(changeQuestionsListSearchOption(initialState.quizQuestionList.search));
        setSearchData(initialState.quizQuestionList.search);
        dispatch(getQuestionsList());
    };

    // 닫기 버튼
    const handleClickHide = () => {
        onHide();
    };

    // row 클릭처리가 없어서 함수만 만들어 놈
    const handleClickListRow = () => {
        // onHide();
    };

    // grid 옵션 변경 처리.
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(changeQuestionsListSearchOption(temp));
            dispatch(getQuestionsList());
        },
        [dispatch, search],
    );

    // store list 가 변경되면 grid 목록 업데이트.
    useEffect(() => {
        const initGridRow = (data) => {
            setRowData(
                data.map((element) => {
                    let Type = '';
                    if (element.questionType === 'S') {
                        Type = '주관식';
                    } else {
                        Type = '단답식';
                    }
                    return {
                        title: element.title,
                        Type: Type,
                        questionsInfo: element,
                        questionsPriviewInfo: element,
                    };
                }),
            );
        };

        if (list.length > 0) {
            initGridRow(list);
        }
    }, [list]);

    // 모달창이 열리면 목록 가져오기.
    useEffect(() => {
        if (show === true) {
            dispatch(getQuestionsList());
        } else {
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    return (
        <MokaModal
            width={900}
            show={show}
            onHide={handleClickHide}
            title={`문항 목록`}
            size="xl"
            bodyClassName="overflow-x-hidden custom-scroll"
            footerClassName="d-flex justify-content-center"
            // buttons={[{ text: '닫기', variant: 'negative', onClick: handleClickHide }]}
            draggable
        >
            <MokaCard width={798} className="mr-gutter" titleClassName="mb-0" title="퀴즈 관리">
                <Form className="pb-2">
                    <Form.Row className="mb-2">
                        <Col xs={2} className="p-0">
                            <MokaInput as="select" name="searchType" value={searchData.searchType} onChange={(e) => handleChangeValue(e)}>
                                <option value="">전체</option>
                                <option value="title">퀴즈제목</option>
                                <option value="question_title">문항제목</option>
                            </MokaInput>
                        </Col>
                        <Col xs={8} className="p-0">
                            <MokaSearchInput
                                value={searchData.keyword}
                                id="keyword"
                                name="keyword"
                                onChange={(e) => handleChangeValue(e)}
                                onSearch={() => handleClickSearchButton()}
                            />
                        </Col>
                        <Col xs={2} className="d-flex p-0 justify-content-end">
                            <Button variant="outline-neutral" onClick={() => handleClickSearchResetButton()}>
                                초기화
                            </Button>
                        </Col>
                    </Form.Row>
                </Form>
                <MokaTable
                    className="overflow-hidden flex-fill"
                    columnDefs={columnDefs}
                    rowData={rowData}
                    rowHeight={50}
                    onRowNodeId={(data) => data.castSrl}
                    onRowClicked={(e) => handleClickListRow(e)}
                    loading={loading}
                    page={search.page}
                    size={search.size}
                    total={total}
                    preventRowClickCell={['questionsInfo', 'questionsPriviewInfo']}
                    onChangeSearchOption={handleChangeSearchOption}
                />
            </MokaCard>
        </MokaModal>
    );
};

export default QuestionSearchModal;
