import React, { useState, useEffect } from 'react';
import produce from 'immer';
import { useSelector, useDispatch } from 'react-redux';
import { MokaTable } from '@components';
import { selectQuizChange } from '@store/survey/quiz';
import { columnDefs } from './QuizSortAgGridColumns';

/**
 * 관련 퀴즈의 AgGrid
 */
const QuizSortAgGrid = () => {
    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);
    const selectQuiz = useSelector(({ quiz }) => quiz.selectQuiz);

    /**
     * 드래그 종료
     */
    const handleDragEnd = (params) => {
        const api = params.api;
        let displayedRows = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            const data = api.getDisplayedRowAtIndex(i).data;
            const update = produce(data, (draft) => {
                draft.item.ordNo = i + 1;
            });
            displayedRows.push(update);
        }
        api.applyTransaction({ update: displayedRows });

        // 드래그가 끝나면 변경된 순서롤 store 에 업데이트 처리.
        dispatch(
            selectQuizChange(
                displayedRows.map((e) => {
                    return {
                        contentId: e.quizSeq,
                        title: e.item.title,
                    };
                }),
            ),
        );
    };

    useEffect(() => {
        // 스토어가 변경 되면 grid 리스트를 업데이트
        if (selectQuiz) {
            setRowData(
                selectQuiz.map((item, index) => {
                    return {
                        quizSeq: item.quizSeq,
                        ordNo: index,
                        contentId: item.contentId,
                        item: {
                            ...item,
                            ordNo: item.ordNo,
                            index: index,
                        },
                    };
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectQuiz]);

    return (
        <MokaTable
            rowData={rowData}
            columnDefs={columnDefs}
            header={false}
            rowHeight={46}
            onRowDragEng={handleDragEnd}
            localeText={{ noRowsToShow: '관련 퀴즈가 없습니다', loadingOoo: '조회 중입니다' }}
            onRowNodeId={(params) => params.ordNo}
            dragStyle
            rowDragManaged
            animateRows
            suppressRowClickSelection
            suppressMoveWhenRowDragging
            paging={false}
        />
    );
};

export default QuizSortAgGrid;
