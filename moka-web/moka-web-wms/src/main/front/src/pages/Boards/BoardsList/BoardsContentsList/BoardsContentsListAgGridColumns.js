import React from 'react';
import { useEffect, useReducer } from 'react';
import { MokaIcon } from '@/components';

// export const ColumnDefs = [
//     {
//         headerName: '번호',
//         field: 'boardSeq',
//         cellStyle: { display: 'flex', alignItems: 'center' },
//         width: 70,
//     },
//     {
//         headerName: '구분',
//         field: 'channelName',
//         cellStyle: { display: 'flex', alignItems: 'center' },
//         width: 100,
//     },
//     {
//         headerName: '지역',
//         field: 'title',
//         width: 250,
//         flex: 1,
//         cellStyle: { display: 'flex', alignItems: 'center' },
//     },
//     {
//         headerName: '제목',
//         field: 'title',
//         cellStyle: { display: 'flex', alignItems: 'center' },
//         width: 120,
//     },
//     {
//         headerName: '작성자',
//         field: 'registItem',
//         cellStyle: { fontSize: '12px', lineHeight: '18px' },
//         width: 120,
//     },
//     {
//         headerName: '작성일시',
//         field: 'regDt',
//         cellStyle: { display: 'flex', alignItems: 'center' },
//         width: 60,
//     },
//     {
//         headerName: '조회',
//         field: 'viewcount',
//         width: 80,
//         cellStyle: { display: 'flex', alignItems: 'center' },
//     },
//     {
//         headerName: '첨부파일',
//         field: 'fileItem',
//         width: 80,
//         cellRendererFramework: (params) => <FileItemRenderer attaches={params.value.attaches} />,
//     },
//     // {
//     //     headerName: '추천/비추천',
//     //     field: 'viewcount',
//     //     width: 80,
//     //     cellStyle: { display: 'flex', alignItems: 'center' },
//     // },
//     // {
//     //     headerName: '신고',
//     //     field: 'viewcount',
//     //     width: 80,
//     //     cellStyle: { display: 'flex', alignItems: 'center' },
//     // },
//     {
//         headerName: '노출',
//         field: 'usedYn',
//         width: 40,
//         cellRenderer: 'usedYnRenderer',
//     },
// ];

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

export default function useBoardDefs(selectBoard) {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        columnsDefs: [],
        error: false,
    });

    const fetchDefs = async () => {
        dispatch({ type: 'START' });

        let columnDefs = [
            {
                headerName: '번호',
                field: 'number',
                cellStyle: { display: 'flex', alignItems: 'center' },
                width: 50,
            },
        ];

        const { titlePrefixNm1, titlePrefixNm2, fileYn, recomFlag, declareYn } = selectBoard;

        try {
            if (titlePrefixNm1) {
                columnDefs.push({
                    headerName: titlePrefixNm1,
                    field: 'titlePrefix1',
                    cellStyle: { display: 'flex', alignItems: 'center' },
                    width: 80,
                    tooltipField: 'titlePrefix1',
                });
            }

            if (titlePrefixNm2) {
                columnDefs.push({
                    headerName: titlePrefixNm2,
                    field: 'titlePrefix2',
                    cellStyle: { display: 'flex', alignItems: 'center' },
                    tooltipField: 'titlePrefix2',
                    width: 80,
                });
            }

            columnDefs.push({
                headerName: '제목',
                field: 'title',
                flex: 1,
                cellStyle: { display: 'flex', alignItems: 'center' },
                tooltipField: 'title',
            });

            columnDefs.push({
                headerName: '작성자',
                field: 'regInfo',
                cellStyle: { display: 'flex', alignItems: 'center' },
                tooltipField: 'regInfo',
                width: 100,
            });

            columnDefs.push({
                headerName: '작성일시',
                field: 'regDt',
                cellStyle: { display: 'flex', alignItems: 'center' },
                width: 120,
            });

            columnDefs.push({
                headerName: '조회',
                field: 'viewCnt',
                tooltipField: 'viewCnt',
                width: 40,
                cellStyle: { display: 'flex', alignItems: 'center' },
            });

            if (fileYn === 'Y') {
                columnDefs.push({
                    headerName: '첨부파일',
                    field: 'fileItem',
                    width: 70,
                    cellRenderer: 'fileItemRenderer',
                });
            }

            if (recomFlag === '1') {
                columnDefs.push({
                    headerName: '추천/비추천',
                    field: 'recomInfo',
                    width: 100,
                    tooltipField: 'recomInfo',
                    cellStyle: { display: 'flex', alignItems: 'center' },
                });
            }

            if (recomFlag === '2') {
                columnDefs.push({
                    headerName: '추천',
                    field: 'recomCnt',
                    tooltipField: 'recomCnt',
                    width: 50,
                    cellStyle: { display: 'flex', alignItems: 'center' },
                });
            }

            if (declareYn === 'Y') {
                columnDefs.push({
                    headerName: '신고',
                    field: 'declareCnt',
                    tooltipField: 'declareCnt',
                    width: 50,
                    cellStyle: { display: 'flex', alignItems: 'center' },
                });
            }

            columnDefs.push({
                headerName: '노출',
                field: 'delYn',
                width: 40,
                cellStyle: { display: 'flex', alignItems: 'center' },
                cellRendererFramework: ({ data }) => {
                    return (
                        <div className="d-flex align-items-center justify-content-center h-100">
                            <MokaIcon iconName="fas-circle" fixedWidth className={data.delYn === 'Y' ? 'color-gray-200' : 'color-primary'} />
                        </div>
                    );
                },
            });
            dispatch({ type: 'SUCCESS', columnsDefs: columnDefs });
        } catch (e) {
            dispatch({ type: 'ERROR', error: e });
        }
    };

    useEffect(() => {
        if (selectBoard.boardId) {
            fetchDefs(selectBoard);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectBoard]);

    return [state];
}
