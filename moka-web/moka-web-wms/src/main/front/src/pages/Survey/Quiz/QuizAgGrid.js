import React, { useEffect, useState, useCallback } from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Survey/Quiz/QuizAgGridColumns';
import { useSelector, useDispatch } from 'react-redux';
import { DISPLAY_PAGE_NUM } from '@/constants';
import { useHistory } from 'react-router-dom';

import { GET_QUIZZES_LIST, getQuizzesList, changeSearchOption } from '@store/survey/quiz';

const QuizAgGrid = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);
    // 공통 구분값 URL
    const { search, list, total, loading, quizInfo } = useSelector((store) => ({
        search: store.quiz.quizzes.search,
        list: store.quiz.quizzes.list,
        total: store.quiz.quizzes.total,
        loading: store.loading[GET_QUIZZES_LIST],
        quizInfo: store.quiz.quizInfo,
    }));

    // 검색
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getQuizzesList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    // 목록 item 클릭 했을떄 URL 이동.
    const handleOnRowClicked = ({ quizSeq }) => {
        history.push(`/quiz/${quizSeq}`);
    };

    useEffect(() => {
        setRowData([]);
        // 퀴즈상태 - Y(서비스)/N(종료)/P(일시중지)
        const setGridRowData = (data) => {
            setRowData(
                data.map((element) => {
                    // let regMemberId = '';
                    // let regMemberNm = '';
                    let regMemberInfo = '';

                    if (element.regMember) {
                        // regMemberId = element.regMember.memberId;
                        // regMemberNm = element.regMember.memberNm;
                        regMemberInfo = `${element.regMember.memberNm} ( ${element.regMember.memberId} )`;
                    }

                    let regDt = element.regDt && element.regDt.length > 10 ? element.regDt.substr(0, 16) : element.regDt;

                    let quzStsText = '';
                    if (element.quizSts === 'Y') {
                        quzStsText = '서비스';
                    } else if (element.quizSts === 'N') {
                        quzStsText = '종료';
                    } else if (element.quizSts === 'P') {
                        quzStsText = '일시중지';
                    }

                    return {
                        delYn: element.delYN,
                        imgUrl: element.imgUrl,
                        loginYn: element.loginYn,
                        quizDesc: element.quizDesc,
                        quizSeq: element.quizSeq,
                        quizSts: element.quizSts,
                        quzStsText: quzStsText,
                        quizType: element.quizType,
                        quizUrl: element.quizUrl,
                        regDt: regDt,
                        replyYn: element.replyYn,
                        title: element.title,
                        voteCnt: element.voteCnt,
                        regMemberInfo: regMemberInfo,
                        // regMember: {memberId: "ssc01", memberNm: "ssc01"}
                    };
                }),
            );
        };

        if (loading === false && list.length > 0) {
            setGridRowData(list);
        }
    }, [list, loading]);

    return (
        <>
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
                className="flex-fill custom-scroll"
                selected={quizInfo.quizSeq}
            />
        </>
    );
};

export default QuizAgGrid;
