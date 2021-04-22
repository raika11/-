import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MokaTable } from '@components';
import { selectQuizChange } from '@store/survey/quiz';
import { getDisplayedRows } from '@utils/agGridUtil';
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
    const handleRowDragEnd = (params) => {
        const api = params.api;
        const displayedRows = getDisplayedRows(api).map((row, idx) => ({
            ...row,
            ordNo: idx + 1,
        }));
        api.applyTransaction({ update: displayedRows });

        // store에 업데이트
        dispatch(selectQuizChange(displayedRows));
    };

    useEffect(() => {
        // 스토어가 변경 되면 grid 리스트를 업데이트
        if (selectQuiz) {
            setRowData(
                selectQuiz.map((quiz, index) => ({
                    ...quiz,
                    ordNo: index + 1,
                })),
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
            onRowDragEnd={handleRowDragEnd}
            localeText={{ noRowsToShow: '관련 퀴즈가 없습니다', loadingOoo: '조회 중입니다' }}
            onRowNodeId={(data) => data.quizSeq}
            dragStyle
            rowDragManaged
            animateRows
            suppressRowClickSelection
            suppressMoveWhenRowDragging
            refreshCellsParams={{ force: true }}
            paging={false}
        />
    );
};

export default QuizSortAgGrid;
