import React from 'react';
import { toastr } from 'react-redux-toastr';
import { MokaTableDeleteButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'componentSeq',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '컴포넌트명',
        field: 'componentName',
        width: 158,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'componentName',
    },
    {
        headerName: '위치그룹',
        field: 'tpZone',
        width: 100,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'tpZone',
    },
    {
        headerName: '',
        field: 'delete',
        width: 36,
        cellRendererFramework: (row) => {
            const { data } = row;
            return (
                <MokaTableDeleteButton
                    {...row}
                    onClick={() => {
                        toastr.confirm(`${data.templateSeq}_${data.templateName}을 삭제하시겠습니까?`, {
                            onOk: () => console.log('OK: clicked'),
                            onCancel: () => console.log('CANCEL: clicked'),
                        });
                    }}
                />
            );
        },
    },
];
