import React from 'react';
import { GRID_LINE_HEIGHT } from '@/style_constants';
import { MokaIcon } from '@components';
import CodeMgtEditButton from './components/CodeMgtEditButton';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.T[1]}px`,
};

export default [
    {
        headerName: '그룹코드',
        field: 'grpCd',
        width: 120,
        tooltipField: 'grpCd',
        cellStyle,
        cellClass: 'user-select-text',
    },
    {
        headerName: '그룹명',
        field: 'cdNm',
        width: 130,
        flex: 1,
        tooltipField: 'cdNm',
        cellStyle,
        cellRendererFramework: (row) => {
            return (
                <div className="w-100 text-truncate">
                    {row.data.secretYn === 'Y' ? (
                        <span>
                            <MokaIcon iconName="fal-file-excel" className="mr-1" />
                            {row.data.cdNm}
                        </span>
                    ) : (
                        row.data.cdNm
                    )}
                </div>
            );
        },
    },
    {
        headerName: '수정자\n수정일시',
        field: 'workInfo',
        width: 125,
        wrapText: true,
        tooltipField: 'worker',
        cellClassRules: {
            'ag-pre-cell': () => true,
        },
        cellStyle: {
            lineHeight: `${GRID_LINE_HEIGHT.M}px`,
        },
    },
    {
        headerName: '',
        field: 'edit',
        width: 28,
        maxWidth: 28,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <CodeMgtEditButton {...row} onClick={data.edit} data={data} />;
        },
    },
];
