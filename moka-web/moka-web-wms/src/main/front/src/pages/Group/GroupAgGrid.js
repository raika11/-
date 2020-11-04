import React from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Group/GroupAgGridColumns';

const GroupAgGrid = () => {
    const list = [
        {
            grpCd: 100,
            grpNm: 'joongang',
            grpKorNm: '중앙일보',
            memNm: '김태형',
            regDt: '2020-10-22 13:40',
        },
    ];
    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={list}
            onRowNodeId={(rowData) => rowData.grpCd}
            agGridHeight={600}
            //onRowClicked={handleRowClicked}
            //loading={loading}
            total={1}
            page={0}
            size={1}
            //selected={domain.domainId}
            //onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default GroupAgGrid;
