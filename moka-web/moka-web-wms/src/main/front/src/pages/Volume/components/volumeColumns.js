import React from 'react';
import VolumeDeleteButton from './VolumeDeleteButton';

const volumeColumns = [
    {
        id: 'volumeId',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 120,
        align: 'center'
    },
    {
        id: 'volumeName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '볼륨명',
        width: 240,
        align: 'left'
    },
    {
        id: '',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'left',
        component: (row) => <VolumeDeleteButton row={row} />
    }
];

export default volumeColumns;
