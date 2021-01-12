import React from 'react';
import { MokaInput } from '@/components';

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
        width: 200,
        field: 'categoryName',
        cellStyle: { fontSize: '12px' },
        flex: 1,
        autoHeight: true,
        cellRenderer: 'editor',
    },
    {
        headerName: '사용유무',
        width: 80,
        field: 'usedYn',
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRendererFramework: ({ value }) => {
            return (
                <MokaInput as="select" className="ft-12" value={value} onChange={(e) => e.target.value}>
                    <option value="Y">사용</option>
                    <option value="N">사용안함</option>
                </MokaInput>
            );
        },
    },
];

export const rowData = [
    { orderNm: '', categoryName: '19대 대선', usedYn: 'Y' },
    { orderNm: '', categoryName: '정치', usedYn: 'Y' },
    { orderNm: '', categoryName: '사회', usedYn: 'Y' },
    { orderNm: '', categoryName: '민생', usedYn: 'Y' },
    { orderNm: '', categoryName: '국제', usedYn: 'Y' },
    { orderNm: '', categoryName: '라이브/문화', usedYn: 'Y' },
    { orderNm: '', categoryName: '더,오래', usedYn: 'Y' },
    { orderNm: '', categoryName: '경제', usedYn: 'Y' },
    { orderNm: '', categoryName: '연애', usedYn: 'Y' },
    { orderNm: '', categoryName: '카테고리', usedYn: 'Y' },
];
