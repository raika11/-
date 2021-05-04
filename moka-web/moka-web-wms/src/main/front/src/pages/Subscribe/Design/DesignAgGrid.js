import React from 'react';
import { useHistory } from 'react-router-dom';
import { GRID_ROW_HEIGHT, GRID_HEADER_HEIGHT } from '@/style_constants';
import { MokaTable } from '@components';
import columnDefs from './DesignAgGridColumns';

const exampleData = [
    {
        seqNo: '10',
        field1: '패키지',
        field2: '백성호의 현문우답',
        field3: '로그인,일반 구독, 뉴스레터, 내 구독, 기사 열람',
        field4: 'N',
        field5: '2021-05-03',
        field6: '100',
        field7: '김중앙(SSC1)\n2021-05-03',
        field8: '-',
        field9: '개시',
    },
];

/**
 * 구독 관리 > 구독 설계 > 리스트 > AgGrid
 */
const DesignAgGrid = ({ match }) => {
    const history = useHistory();

    /**
     * 테이블 sort 변경
     * @param {object} params instance
     */
    const handleSortChange = (params) => {
        const sortModel = params.api.getSortModel();
        alert(sortModel[0] ? `${sortModel[0].colId} / ${sortModel[0].sort}` : 'origin sort');
        // const sort = sortModel[0] ? `${sortModel[0].colId},${sortModel[0].sort}` : initialState.search.sort;
        // let temp = { ...search, sort, page: 0 };
    };

    return (
        <MokaTable
            onRowNodeId={(data) => data.seqNo}
            headerHeight={GRID_HEADER_HEIGHT[1]}
            rowHeight={GRID_ROW_HEIGHT.T[2]}
            className="overflow-hidden flex-fill"
            onRowClicked={(data) => history.push(`${match.path}/${data.seqNo}`)}
            onSortChanged={handleSortChange}
            columnDefs={columnDefs}
            rowData={exampleData}
        />
    );
};

export default DesignAgGrid;
