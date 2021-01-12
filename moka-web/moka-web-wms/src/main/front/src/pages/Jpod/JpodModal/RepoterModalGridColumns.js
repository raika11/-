import React from 'react';
import { RepoterAddButtonRenderer } from './ModalGridRenderer';
import Image from 'react-bootstrap/Image';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: '',
        colId: 'button',
        width: 80,
        field: 'repoterInfo',
        cellRendererFramework: ({ value }) => <RepoterAddButtonRenderer repoterInfo={value} />,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: 'NO',
        field: 'repoterSeq',
        width: 60,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '아이디',
        field: 'repoterId',
        width: 80,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'name',
    },
    {
        headerName: '사진',
        field: 'repoterImage',
        width: 50,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'repoterImage',
        cellRendererFramework: ({ value }) => {
            return (
                <>
                    <div className="pt-2">
                        <Image width="35" height="35" src={value} data={value} roundedCircle />
                    </div>
                </>
            );
        },
    },
    {
        headerName: '이름',
        field: 'repoterName',
        width: 50,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'repoterName',
    },
    {
        headerName: '소속',
        field: 'repoterBelong',
        width: 55,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'repoterBelong',
    },
    {
        headerName: '직책',
        field: 'repoterRepTitle',
        width: 150,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'repoterRepTitle',
    },
    {
        headerName: '이메일',
        field: 'repoterRepEmail',
        width: 200,
        flex: 1,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'repoterRepEmail',
    },
];
