import React, { useEffect, useState, useCallback } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaModal, MokaTable, MokaInput, MokaSearchInput } from '@components';
import { columnDefs } from './QuizSearchModalGridColumns';
import { useSelector, useDispatch } from 'react-redux';
import { DISPLAY_PAGE_NUM } from '@/constants';

import { initialState, GET_QUIZ_SEARCH_MODAL_LIST, clearQuizmodalsearch, getQuizSearchModalList, changeQuizListSearchOption } from '@store/survey/quiz';
/**
 * 검색 모달.
 */
const QuizSearchModal = (props) => {
    const { show, onHide } = props;
    const [selectQuizSeq, setSelectQuizSeq] = useState(null);

    const [searchData, setSearchData] = useState(initialState.quizSearchList.search);
    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);

    const { list, total, search, loading } = useSelector((store) => ({
        list: store.quiz.quizSearchList.list,
        total: store.quiz.quizSearchList.total,
        search: store.quiz.quizSearchList.search,
        loading: store.loading[GET_QUIZ_SEARCH_MODAL_LIST],
    }));

    // 닫기
    const handleClickHide = () => {
        onHide();
    };

    // row 클릭시 처리.
    const handleOnRowClicked = (e) => {
        setSelectQuizSeq(e.quizSeq);
    };

    // 검색 정보 변경 처리.
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearchData({
            ...searchData,
            [name]: value,
        });
    };

    // 검색 버튼
    const handleClickSearchButton = () => {
        dispatch(changeQuizListSearchOption(searchData));
        dispatch(getQuizSearchModalList());
    };

    // 검색
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(changeQuizListSearchOption(temp));
            dispatch(getQuizSearchModalList());
            // dispatch(getQuizzesList(changeQuizListSearchOption(temp)));
        },
        [dispatch, search],
    );

    // store list 가 변경 되면 그리드에 념겨줄 데이터 설정.
    useEffect(() => {
        const setListToRowData = (data) => {
            setRowData(
                data.map(function (element, index) {
                    let quzStsText = '';
                    if (element.quizSts === 'Y') {
                        quzStsText = '서비스';
                    } else if (element.quizSts === 'N') {
                        quzStsText = '종료';
                    } else if (element.quizSts === 'P') {
                        quzStsText = '일시중지';
                    }

                    return {
                        quizSeq: element.quizSeq,
                        title: element.title,
                        regMemberInfo: element.regMember ? `${element.regMember.memberNm}(${element.regMember.memberId})` : '',
                        quzStsText: quzStsText,
                        quizInfo: element,
                    };
                }),
            );
        };

        if (loading === false) {
            setListToRowData(list);
        }
    }, [list, loading]);

    // 모달창이 열리면 목록 가져오기.
    useEffect(() => {
        if (show === true) {
            dispatch(getQuizSearchModalList());
        } else {
            dispatch(clearQuizmodalsearch());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    return (
        <MokaModal
            width={900}
            show={show}
            onHide={handleClickHide}
            title={`퀴즈 목록`}
            size="xl"
            bodyClassName="overflow-x-hidden custom-scroll"
            footerClassName="d-flex justify-content-center"
            // buttons={[{ text: '닫기', variant: 'negative', onClick: handleClickHide }]}
            draggable
        >
            <Form className="pb-2">
                <Form.Row className="mb-2">
                    <Col xs={2} className="p-0">
                        <MokaInput as="select" name="searchType" value={searchData.searchType} onChange={(e) => handleChangeValue(e)}>
                            <option value="">전체</option>
                            <option value="title">퀴즈제목</option>
                            <option value="quizSeq">퀴즈ID</option>
                        </MokaInput>
                    </Col>
                    <Col xs={10} className="p-0 pl-1">
                        <MokaSearchInput value={searchData.keyword} id="keyword" name="keyword" onChange={(e) => handleChangeValue(e)} onSearch={() => handleClickSearchButton()} />
                    </Col>
                </Form.Row>
            </Form>
            <MokaTable
                loading={loading}
                columnDefs={columnDefs}
                onRowNodeId={(row) => row.quizSeq}
                onRowClicked={(e) => handleOnRowClicked(e)}
                agGridHeight={600}
                rowData={rowData}
                page={search.page}
                size={search.size}
                total={total}
                displayPageNum={DISPLAY_PAGE_NUM}
                onChangeSearchOption={handleChangeSearchOption}
                selected={selectQuizSeq}
            />
        </MokaModal>
    );
};

export default QuizSearchModal;
