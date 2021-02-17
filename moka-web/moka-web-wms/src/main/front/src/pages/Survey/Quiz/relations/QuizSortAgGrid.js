import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs } from './QuizSortAgGridColumns';
import produce from 'immer';
import { useSelector, useDispatch } from 'react-redux';
import { selectQuizChange } from '@store/survey/quiz';

const QuizSortAgGrid = () => {
    const [rowData, setRowData] = useState([]);
    const dispatch = useDispatch();

    // 스토어 연결.
    const { selectQuiz } = useSelector((store) => ({
        selectQuiz: store.quiz.selectQuiz,
    }));

    // 그리드 옵션, 드래그핼때 필요함.
    const onGridReady = (params) => {
        // setInstance(params);
    };

    // 드래그 가 끝났을떄.
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

    // 스토어가 변경 되면 grid 리스트를 업데이트.
    useEffect(() => {
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
        <>
            <div className="ag-theme-moka-dnd-grid w-100">
                <AgGridReact
                    immutableData
                    onGridReady={onGridReady}
                    rowData={rowData}
                    getRowNodeId={(params) => params.ordNo}
                    columnDefs={columnDefs}
                    localeText={{ noRowsToShow: '관련 투표가 없습니다.', loadingOoo: '조회 중입니다..' }}
                    onRowDragEnd={handleDragEnd}
                    animateRows
                    rowDragManaged
                    suppressRowClickSelection
                    suppressMoveWhenRowDragging
                    headerHeight={0}
                    rowHeight={50}
                />
            </div>
        </>
    );
};

export default QuizSortAgGrid;
