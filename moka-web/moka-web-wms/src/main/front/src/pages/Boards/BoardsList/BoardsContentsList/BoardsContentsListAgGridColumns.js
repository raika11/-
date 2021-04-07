import React from 'react';
import { MokaIcon } from '@/components';

export const boardColumnDefs = (data) => {
    const { titlePrefixNm1, titlePrefixNm2, fileYn, recomFlag, declareYn } = data;
    return [
        {
            headerName: '번호',
            field: 'number',
            cellStyle: { lineHeight: '48px' },
            width: 50,
        },
        titlePrefixNm1 && {
            headerName: titlePrefixNm1,
            field: 'titlePrefix1',
            cellStyle: { lineHeight: '48px' },
            width: 80,
            tooltipField: 'titlePrefix1',
        },
        titlePrefixNm2 && {
            headerName: titlePrefixNm2,
            field: 'titlePrefix2',
            cellStyle: { lineHeight: '48px' },
            width: 80,
            tooltipField: 'titlePrefix2',
        },
        {
            headerName: '제목',
            field: 'title',
            flex: 1,
            cellStyle: { lineHeight: '48px' },
            tooltipField: 'title',
        },
        {
            headerName: '등록자',
            field: 'regInfo',
            cellStyle: { lineHeight: '48px' },
            width: 100,
            tooltipField: 'regInfo',
        },
        {
            headerName: '작성일시',
            field: 'regDt',
            cellStyle: { lineHeight: '48px' },
            width: 120,
        },
        {
            headerName: '조회수',
            field: 'viewCnt',
            cellStyle: { lineHeight: '48px' },
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
            cellStyle: { lineHeight: '48px' },
            width: 100,
            tooltipField: 'recomInfo',
        },
        recomFlag === '2' && {
            headerName: '추천',
            field: 'recomCnt',
            cellStyle: { lineHeight: '48px' },
            width: 50,
            tooltipField: 'recomCnt',
        },
        declareYn === 'Y' && {
            headerName: '신고',
            field: 'declareCnt',
            cellStyle: { lineHeight: '48px' },
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
