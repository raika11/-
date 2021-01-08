import React from 'react';
import { MokaInput } from '@/components';

export default [
    {
        headerName: '번호',
        field: 'seqNo',
        width: 40,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '등록일시',
        field: 'regDt',
        width: 110,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '이미지',
        field: 'thumbnail',
        cellRenderer: 'imageRenderer',
        flex: 1,
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 50,
        cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
        cellRendererFramework: (params) => {
            console.log(params.data);
            return (
                <MokaInput
                    as="switch"
                    id="switch-usedYn"
                    inputProps={{
                        custom: true,
                        checked: params.data.usedYn === 'Y',
                    }}
                    onChange={(e) => {
                        console.log(e.target.checked);
                        // setTemp({ ...temp, usedYn: e.target.checked ? 'Y' : 'N' }
                    }}
                />
            );
        },
    },
];

export const rowData = [{ seqNo: '12', regDt: '2020-01-07:14:23', thumbnail: '', usedYn: 'Y' }];
