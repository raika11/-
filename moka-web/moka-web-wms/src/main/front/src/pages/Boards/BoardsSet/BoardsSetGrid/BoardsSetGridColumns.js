import React from 'react';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const ColumnDefs = [
    {
        headerName: '번호',
        field: 'boardId',
        width: 70,
        cellStyle: { fontSize: '12px' },
        cellClass: ['text-left'],
    },
    {
        headerName: '게시판명',
        field: 'boardName',
        width: 150,
        flex: 1,
        cellStyle: { fontSize: '12px' },
        cellClass: ['text-left'],
    },
    {
        headerName: '게시판 설명',
        field: 'boardDesc',
        width: 180,
        cellStyle: { fontSize: '12px' },
        cellClass: ['text-left'],
    },
    {
        headerName: '게시판 유형',
        field: 'boardTypeName',
        width: 120,
        cellStyle: { fontSize: '12px' },
        cellClass: ['text-left', 'pl-1'],
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 120,
        cellStyle: { fontSize: '12px' },
        cellClass: ['text-left'],
        cellRendererFramework: ({ value }) => {
            let clazz = value === 'Y' ? 'color-primary' : 'color-gray150';

            return <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />;
        },
    },
    {
        headerName: '답변',
        field: 'answYn',
        width: 120,
        cellStyle: { fontSize: '12px' },
        cellClass: ['text-left'],
        cellRendererFramework: ({ value }) => {
            let clazz = value === 'Y' ? 'color-primary' : 'color-gray150';

            return <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />;
        },
    },
    {
        headerName: '생성일',
        field: 'regDt',
        width: 120,
        cellStyle: { fontSize: '12px' },
        cellClass: ['text-left'],
    },
];

export const tempRows = {
    szie: 20,
    list: [
        {
            boardSeq: 100,
            boardName: '첫번째 게시판',
            boardExplan: '첫번째 게시판 설명',
            boardCategory: '서비스',
            usedYn: 'Y',
            answerYn: 'Y',
            regDt: '2020-12-18 17:30:00',
        },
        {
            boardSeq: 99,
            boardName: '게시판 이름 1',
            boardExplan: '게시판 설명 1',
            boardCategory: '관리자',
            usedYn: 'N',
            answerYn: 'Y',
            regDt: '2020-12-18 17:30:00',
        },
        {
            boardSeq: 98,
            boardName: '게시판 이름 1',
            boardExplan: '게시판 설명 1',
            boardCategory: '서비스',
            usedYn: 'Y',
            answerYn: 'N',
            regDt: '2020-12-18 17:30:00',
        },
        {
            boardSeq: 97,
            boardName: '게시판 이름 1',
            boardExplan: '게시판 설명 1',
            boardCategory: '비관리자',
            usedYn: 'N',
            answerYn: 'N',
            regDt: '2020-12-18 17:30:00',
        },
    ],
};
