import React from 'react';
import { ImageRenderer, EtcButtonRenderer } from './GridRenderer';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const tempColumnDefs = [
    {
        headerName: 'ID',
        field: 'repId',
        width: 70,
        cellStyle: { fontSize: '12px', lineHeight: '23px', paddingTop: '20px' },
    },
    {
        headerName: '\t전송일시',
        field: 'sendDate',
        wrapText: true,
        width: 130,
        cellStyle: { fontSize: '12px', lineHeight: '23px', paddingTop: '22px' },
    },
    {
        headerName: '\t사진',
        field: 'repImg',
        cellRendererFramework: (params) => <ImageRenderer {...params} />,
        width: 90,
        cellStyle: { fontSize: '12px', lineHeight: '23px', paddingTop: '8px' },
    },
    {
        headerName: '\t\t\t\tSNS제목',
        field: 'snsTitle',
        wrapText: true,
        width: 250,
        flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '40px', paddingLeft: '20px', paddingTop: '12px' },
    },
    {
        headerName: '사용여부',
        field: 'useYn',
        width: 120,
        wrapText: true,
        cellRendererFramework: ({ value }) => {
            return <FontAwesomeIcon icon={faCircle} fixedWidth className={value === 'Y' ? 'color-primary' : 'color-gray150'} />;
        },
        cellStyle: { fontSize: '12px', lineHeight: '23px', paddingLeft: '20px', paddingTop: '20px' },
    },
    {
        headerName: '\t\t\t기타',
        field: 'insStatus',
        width: 230,
        wrapText: true,
        cellStyle: { fontSize: '12px', lineHeight: '23px', paddingTop: '20px', paddingLeft: '12px' },
        cellRendererFramework: (params) => <EtcButtonRenderer {...params} />,
    },
];

export const tempRowData = [
    {
        repId: 999999,
        repImg: 'https://pds.joins.com/news/component/htmlphoto_mmdata/202012/01/75752c82-c8c4-45f1-8741-bed04a3a19b4.jpg',
        snsTitle: `[김기자의 V토크] 진실게임 된 배구 코트 ‘머니 게임’`,
        useYn: 'Y',
        sendDate: '2020-10-25 13:40:05',
    },
    {
        repId: 999998,
        repImg: 'https://pds.joins.com/news/component/htmlphoto_mmdata/202012/01/75752c82-c8c4-45f1-8741-bed04a3a19b4.jpg',
        snsTitle: `‘킹’ 르브론 제임스, LA레이커스와 2년 재계약`,
        useYn: 'n',
        sendDate: '2020-10-25 13:40:05',
    },
    {
        repId: 999997,
        repImg: 'https://pds.joins.com/news/component/htmlphoto_mmdata/202012/01/75752c82-c8c4-45f1-8741-bed04a3a19b4.jpg',
        snsTitle: `판공비 6000만원 자청하고 "억울"···이대호에 선수들 분노`,
        useYn: 'Y',
        sendDate: '2020-10-25 13:40:05',
    },
];
