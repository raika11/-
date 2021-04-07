import React from 'react';
import { MokaIcon } from '@/components';

export const boardColumnDefs = (data) => {
    const { titlePrefixNm1, titlePrefixNm2, fileYn, recomFlag, declareYn } = data;
    return [
        {
            headerName: '번호',
            field: 'number',
            width: 50,
        },
        titlePrefixNm1 && {
            headerName: titlePrefixNm1,
            field: 'titlePrefix1',
            // cellStyle: {
            //     paddingTop: '8px',
            // },
            width: 80,
            tooltipField: 'titlePrefix1',
        },
        titlePrefixNm2 && {
            headerName: titlePrefixNm2,
            field: 'titlePrefix2',
            // cellStyle: {
            //     paddingTop: '8px',
            // },
            width: 80,
            tooltipField: 'titlePrefix2',
        },
        {
            headerName: '제목',
            field: 'title',
            flex: 1,
            // cellStyle: {
            //     paddingTop: '8px',
            // },
            tooltipField: 'title',
        },
        {
            headerName: '등록자',
            field: 'regInfo',
            width: 100,
            tooltipField: 'regInfo',
        },
        {
            headerName: '작성일시',
            field: 'regDt',
            width: 120,
        },
        {
            headerName: '조회수',
            field: 'viewCnt',
            width: 50,
            tooltipField: 'viewCnt',
        },
        fileYn === 'Y' && {
            headerName: '첨부파일',
            field: 'fileItem',
            width: 70,
            cellRenderer: 'fileItemRenderer',
        },
        recomFlag === '1' && {
            headerName: '추천/비추천',
            field: 'recomInfo',
            width: 100,
            tooltipField: 'recomInfo',
        },
        recomFlag === '2' && {
            headerName: '추천',
            field: 'recomCnt',
            width: 50,
            tooltipField: 'recomCnt',
        },
        declareYn === 'Y' && {
            headerName: '신고',
            field: 'declareCnt',
            width: 50,
            tooltipField: 'declareCnt',
        },
        {
            headerName: '노출',
            field: 'delYn',
            width: 40,
            cellRendererFramework: ({ data }) => {
                return (
                    <div className="d-flex align-items-center justify-content-center h-100">
                        <MokaIcon iconName="fas-circle" fixedWidth className={data.delYn === 'Y' ? 'color-gray-200' : 'color-primary'} />
                    </div>
                );
            },
        },
    ].filter(Boolean);
};
// function reducer(state, action) {
//     switch (action.type) {
//         case 'START':
//             return {
//                 loading: 'idle',
//                 columnsDefs: [],
//                 error: null,
//             };
//         case 'SUCCESS':
//             return {
//                 loading: 'success',
//                 columnsDefs: action.columnsDefs,
//                 error: null,
//             };
//         case 'ERROR':
//             return {
//                 loading: 'error',
//                 columnsDefs: [],
//                 error: null,
//             };
//         default:
//             throw new Error(`Unhandled action type: ${action.type}`);
//     }
// }

// export default [
// const [state, dispatch] = useReducer(reducer, {
//     loading: false,
//     columnsDefs: [],
//     error: false,
// });

// const fetchDefs = async () => {
// dispatch({ type: 'START' });

// {
//     headerName: '번호',
//     field: 'number',
//     width: 50,
// },

// const { titlePrefixNm1, titlePrefixNm2, fileYn, recomFlag, declareYn } = selectBoard;

// try {
// if (titlePrefixNm1) {
//     columnDefs.push({
//         headerName: titlePrefixNm1,
//         field: 'titlePrefix1',
//         cellStyle: {
//             paddingTop: '8px',
//         },
//         width: 80,
//         tooltipField: 'titlePrefix1',
//     });
// }

// if (titlePrefixNm2) {
//     columnDefs.push({
//         headerName: titlePrefixNm2,
//         field: 'titlePrefix2',
//         cellStyle: {
//             paddingTop: '8px',
//         },
//         tooltipField: 'titlePrefix2',
//         width: 80,
//     });
// }

// columnDefs.push({
//     headerName: '제목',
//     field: 'title',
//     flex: 1,
//     cellStyle: {
//         paddingTop: '8px',
//     },
//     tooltipField: 'title',
// });

// columnDefs.push({
//     headerName: '등록자',
//     field: 'regInfo',
//     tooltipField: 'regInfo',
//     width: 100,
// });

// columnDefs.push({
//     headerName: '작성일시',
//     field: 'regDt',
//     width: 120,
// });

// columnDefs.push({
//     headerName: '조회',
//     field: 'viewCnt',
//     tooltipField: 'viewCnt',
//     width: 40,
// });

// if (fileYn === 'Y') {
//     columnDefs.push({
//         headerName: '첨부파일',
//         field: 'fileItem',
//         width: 70,
//         cellRenderer: 'fileItemRenderer',
//     });
// }

// if (recomFlag === '1') {
//     columnDefs.push({
//         headerName: '추천/비추천',
//         field: 'recomInfo',
//         width: 100,
//         tooltipField: 'recomInfo',
//     });
// }

// if (recomFlag === '2') {
//     columnDefs.push({
//         headerName: '추천',
//         field: 'recomCnt',
//         tooltipField: 'recomCnt',
//         width: 50,
//     });
// }

// if (declareYn === 'Y') {
//     columnDefs.push({
//         headerName: '신고',
//         field: 'declareCnt',
//         tooltipField: 'declareCnt',
//         width: 50,
//     });
// }

// columnDefs.push({
//     headerName: '노출',
//     field: 'delYn',
//     width: 40,
//     cellRendererFramework: ({ data }) => {
//         return (
//             <div className="d-flex align-items-center justify-content-center h-100">
//                 <MokaIcon iconName="fas-circle" fixedWidth className={data.delYn === 'Y' ? 'color-gray-200' : 'color-primary'} />
//             </div>
//         );
//     },
// });
//         dispatch({ type: 'SUCCESS', columnsDefs: columnDefs });
//     } catch (e) {
//         dispatch({ type: 'ERROR', error: e });
//     }
// };

// useEffect(() => {
//     if (selectBoard.boardId) {
//         fetchDefs(selectBoard);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [selectBoard]);

// ].filter((a) => a);

// export default [
//     {
//         headerName: '번호',
//         field: 'number',
//         width: 50,
//     },
//     {
//         headerName: '제목',
//         field: 'title',
//         flex: 1,
//         cellStyle: { paddingTop: '8px' },
//         tooltipField: 'title',
//     },
//     {
//         headerName: '등록자',
//         field: 'regInfo',
//         width: 100,
//         tooltipField: 'regInfo',
//     },
//     {
//         headerName: '작성 일시',
//         field: 'regDt',
//         width: 120,
//     },
//     {
//         headerName: '조회수',
//         field: 'viewCnt',
//         width: 50,
//         tooltipField: 'viewCnt',
//     },
// ];
