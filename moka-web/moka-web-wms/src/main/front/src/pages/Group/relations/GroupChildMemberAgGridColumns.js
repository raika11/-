export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        colId: 'checkbox',
        width: 28,
        checkboxSelection: true,
        suppressMenu: true,
        headerCheckboxSelection: true,
        cellStyle: { width: '28px' },
    },
    {
        headerName: '이름',
        field: 'memberNm',
        //cellStyle: { textAlign: 'center' },
        width: 80,
    },
    {
        headerName: '아이디',
        field: 'memberId',
        width: 100,
    },
    {
        headerName: '부서',
        field: 'dept',
        width: 130,
    },
    {
        headerName: '소속그룹',
        field: 'group',
        width: 135,
        cellRendererFramework: (params) => {
            //J중앙I일간E기타M매거진A관리자D청백R기사수신

            const { memberGroups } = params.data;

            let groupNm = '';
            if (memberGroups) {
                const groupCodes = memberGroups.split(',');
                for (const groupCode of groupCodes) {
                    if (groupNm !== '') {
                        groupNm += ',';
                    }
                    switch (groupCode) {
                        case 'J':
                            groupNm += '중앙일보';
                            break;
                        case 'I':
                            groupNm += '일간';
                            break;
                        case 'E':
                            groupNm += '기타';
                            break;
                        case 'M':
                            groupNm += '매거진';
                            break;
                        case 'A':
                            groupNm += '관리자';
                            break;
                        case 'D':
                            groupNm += '청백';
                            break;
                        case 'R':
                            groupNm += '기사수신';
                            break;
                        default:
                            break;
                    }
                }
            }

            return groupNm;
        },
    },
];
