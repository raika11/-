import React from 'react';
import { MokaInput } from '@/components';

export default [
    {
        headerName: '번호',
        field: 'seqNo',
        width: 40,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '등록일시',
        field: 'regDt',
        width: 110,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '이미지',
        field: 'thumbnail',
        cellRenderer: 'imageRenderer',
        cellStyle: {},
        flex: 1,
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 50,
        cellStyle: { alignItems: 'center' },
        cellRendererFramework: (params) => {
            return (
                <MokaInput
                    as="switch"
                    id="switch-usedYn"
                    inputProps={{
                        custom: true,
                        checked: params.value === 'Y' ? true : false,
                    }}
                    onChange={(e) => e.target.checked}
                />
            );
        },
    },
];

export const rowData = [{ seqNo: '12', regDt: '2020-01-07:14:23', thumbnail: '', usedYn: 'Y' }];
