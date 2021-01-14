import React from 'react';
import CategorySelectRenderer from '../components/CategorySelectRenderer';

export const columnDefs = [
    {
        headerName: '',
        rowDrag: true,
        width: 24,
    },
    {
        headerName: '',
        field: 'orderNm',
        width: 24,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '카테고리명',
        field: 'categoryName',
        cellStyle: { fontSize: '12px' },
        flex: 1,
        cellRenderer: 'editor',
    },
    {
        headerName: '사용유무',
        width: 100,
        field: 'usedYn',
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRendererFramework: (params) => {
            return (
                <div className="d-flex align-items-center justify-content-center h-100 w-100">
                    <CategorySelectRenderer {...params} />
                </div>
            );
        },
    },
];

export const rowData = [
    { orderNm: '1', categoryName: '19대 대선', usedYn: 'Y' },
    { orderNm: '2', categoryName: '정치', usedYn: 'Y' },
    { orderNm: '3', categoryName: '사회', usedYn: 'Y' },
    { orderNm: '4', categoryName: '민생', usedYn: 'Y' },
    { orderNm: '5', categoryName: '국제', usedYn: 'Y' },
    { orderNm: '6', categoryName: '라이브/문화', usedYn: 'Y' },
    { orderNm: '7', categoryName: '더,오래', usedYn: 'Y' },
    { orderNm: '8', categoryName: '경제', usedYn: 'Y' },
    { orderNm: '9', categoryName: '연애', usedYn: 'Y' },
    { orderNm: '10', categoryName: '카테고리', usedYn: 'Y' },
];
