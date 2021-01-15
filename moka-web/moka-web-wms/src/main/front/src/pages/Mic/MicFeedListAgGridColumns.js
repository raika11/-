import React from 'react';
import MicTableSwitch from './components/MicTableSwitch';

export default [
    {
        headerName: '번호',
        field: 'seqNo',
        width: 40,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '내용',
        field: 'content',
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        flex: 1,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 80,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 55,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRendererFramework: (params) => <MicTableSwitch {...params} />,
    },
    {
        headerName: '최상단',
        field: 'menu',
        width: 55,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRendererFramework: (params) => <MicTableSwitch {...params} />,
    },
];

export const rowData = [
    {
        seqNo: '159',
        content:
            '안녕하세요, 더오래팀 이벤트 담당자 입니다. 1월 31일부로 본 이벤트를 종료합니다. (이후 등록 된 글은 응모되지 않습니다) 독자 여러분의 성원으로 전국~욱 손자랑’ 이벤트를 성공적으로 마무리할 수 있었습ㄴ이다. 이벤트에 참여해 주신 모든 분께 감사드립니다.',
        regDt: '2021-01-17',
        usedYn: 'Y',
        menu: 'N',
    },
    {
        seqNo: '158',
        content:
            '더, 오래 “전구~욱 손주자랑’ 이벤트에 사연을 남기실때 반드시 joins 로그인을 해 주셔야 합니다. 소셜 로그인(네이버, 카카오, 페이스북 등) 후 사연 작성 시, 등록자 확인이 어려워 선정 과정에서 불이익이 있을 수 있습니다. 사진만 올리거나 사진당200자 이상 사연이 없으면 응모되지 않습니다. 찍은 시점과 장소, 손주의 낭, 어디가 닮았는지 등을 꼭 기재해주세요. TIP. 공감, 공유, 댓글이 많을 수록 유리합니다! 사진을 업로드 하신 후 가족, 친구, 지인 분들께 널리알려주세요.',
        regDt: '2021-01-07',
        usedYn: 'Y',
        menu: 'N',
    },
];

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
