import React, { useEffect, useState, useCallback } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { MokaModal, MokaTable, MokaInput, MokaSearchInput } from '@components';
import { columnDefs, tempRows } from './QuizSearchModalGridColumns';
import { useSelector, useDispatch } from 'react-redux';
import { DISPLAY_PAGE_NUM } from '@/constants';

import { initialState, GET_QUIZ_SEARCH_MODAL_LIST, clearQuizmodalsearch, getQuizSearchModalList, changeQuizListSearchOption } from '@store/survey/quiz';
/**
 * 검색 모달.
 */
const QuizSearchModal = (props) => {
    const { show, onHide } = props;

    const [searchData, setSearchData] = useState(initialState.quizSearchList.search);
    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);

    const { list, total, search, loading } = useSelector((store) => ({
        list: store.quiz.quizSearchList.list,
        total: store.quiz.quizSearchList.total,
        search: store.quiz.quizSearchList.search,
        loading: store.loading[GET_QUIZ_SEARCH_MODAL_LIST],
    }));

    const handleClickHide = () => {
        onHide();
    };

    const handleOnRowClicked = () => {};

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearchData({
            ...searchData,
            [name]: value,
        });
    };
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

    useEffect(() => {
        const setListToRowData = (data) => {
            setRowData(
                data.map(function (e, index) {
                    return {
                        // dataIndex: index,
                        // totalId: e.totalId,
                        // title: e.title,
                        // item: {
                        //     itemIndex: index,
                        //     title: e.title,
                        //     url: e.url,
                        // },
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
            title={`퀴드 목록`}
            size="md"
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
            />
        </MokaModal>
    );
};

export default QuizSearchModal;
