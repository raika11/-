import { useEffect, useReducer } from 'react';

function reducer(state, action) {
    switch (action.type) {
        case 'START':
            return {
                loading: 'idle',
                columnsDefs: [],
                error: null,
            };
        case 'SUCCESS':
            return {
                loading: 'success',
                columnsDefs: action.columnsDefs,
                error: null,
            };
        case 'ERROR':
            return {
                loading: 'error',
                columnsDefs: [],
                error: null,
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export default function useBoardDefs(selectBoard = []) {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        columnsDefs: [],
        error: false,
    });

    const fetchDefs = async () => {
        dispatch({ type: 'START' });

        let ColumnDefs = [
            {
                headerName: '번호',
                field: 'number',
                cellStyle: { display: 'flex', alignItems: 'center' },
                width: 70,
            },
        ];

        const { titlePrefixNm1, titlePrefixNm2, fileYn, recomFlag, declareYn } = selectBoard;

        try {
            if (titlePrefixNm1) {
                ColumnDefs.push({
                    headerName: `${titlePrefixNm1}`,
                    field: 'titlePrefix1',
                    cellStyle: { display: 'flex', alignItems: 'center' },
                    width: 70,
                });
            }

            if (titlePrefixNm2) {
                ColumnDefs.push({
                    headerName: `${titlePrefixNm2}`,
                    field: 'titlePrefix2',
                    cellStyle: { display: 'flex', alignItems: 'center' },
                    width: 70,
                });
            }

            ColumnDefs.push({
                headerName: '제목',
                field: 'title',
                flex: 1,
                cellStyle: { display: 'flex', alignItems: 'center' },
                width: 120,
            });
            ColumnDefs.push({
                headerName: '작성자',
                field: 'registItem',
                cellStyle: { display: 'flex', alignItems: 'center' },
                width: 100,
            });

            ColumnDefs.push({
                headerName: '작성일시',
                field: 'regDt',
                cellStyle: { display: 'flex', alignItems: 'center' },
                width: 80,
            });

            ColumnDefs.push({
                headerName: '조회',
                field: 'viewCnt',
                width: 40,
                cellStyle: { display: 'flex', alignItems: 'center' },
            });

            if (fileYn === 'Y') {
                ColumnDefs.push({
                    headerName: '첨부파일',
                    field: 'fileItem',
                    width: 60,
                    cellRenderer: 'fileItemRenderer',
                });
            }

            if (recomFlag === '1') {
                ColumnDefs.push({
                    headerName: '추천/비추천',
                    field: 'recomInfo',
                    width: 80,
                    cellStyle: { display: 'flex', alignItems: 'center' },
                });
            }

            if (recomFlag === '2') {
                ColumnDefs.push({
                    headerName: '추천',
                    field: 'recomCnt',
                    width: 80,
                    cellStyle: { display: 'flex', alignItems: 'center' },
                });
            }

            if (declareYn === 'Y') {
                ColumnDefs.push({
                    headerName: '신고',
                    field: 'declareCnt',
                    width: 50,
                    cellStyle: { display: 'flex', alignItems: 'center' },
                });
            }

            ColumnDefs.push({
                headerName: '노출',
                field: 'usedYn',
                width: 40,
                cellRenderer: 'usedYnRenderer',
            });

            dispatch({ type: 'SUCCESS', columnsDefs: ColumnDefs });
        } catch (e) {
            dispatch({ type: 'ERROR', error: e });
        }
    };

    useEffect(() => {
        if (selectBoard.boardId) {
            fetchDefs(selectBoard);
        }
        // eslint-disable-next-line
    }, [selectBoard]);

    return [state];
}
