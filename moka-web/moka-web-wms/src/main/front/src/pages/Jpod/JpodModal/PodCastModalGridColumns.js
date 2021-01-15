import React from 'react';
import { ChannelMoveButtonRenderer } from './ModalGridRenderer';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: 'ID',
        field: 'seq',
        width: 80,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '제목',
        field: 'title',
        width: 250,
        flex: 1,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'title',
    },
    {
        headerName: '상태',
        field: 'status',
        width: 100,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'status',
        cellRendererFramework: ({ value }) => {
            let clazz = value === 'Y' ? 'color-primary' : 'color-gray150';
            return <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />;
        },
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 80,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'regDt',
    },
];
