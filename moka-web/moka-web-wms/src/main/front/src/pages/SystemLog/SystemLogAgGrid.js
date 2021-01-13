import React from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/SystemLog/SystemLogAgGridColumn';
import { useHistory } from 'react-router-dom';

const SystemLogAgGrid = () => {
    const history = useHistory();

    const handleClickRow = (logSeq) => {
        console.log(logSeq);
        history.push(`/bo-log/${logSeq}`);
    };

    return (
        <>
            <MokaTable
                agGridHeight={500}
                columnDefs={columnDefs}
                rowData={[
                    {
                        successYn: 'Y',
                        seqNo: 82037,
                        menuName: '테스트',
                        action: 'SELECT',
                        memId: 'thkim',
                        regIp: '203.249.146.200',
                        regDt: '2021-01-24 12:34',
                    },
                    {
                        successYn: 'N',
                        seqNo: 82038,
                        menuName: '기사페이지 관리',
                        action: 'INSERT',
                        memId: 'thkim',
                        regIp: '203.249.146.200',
                        regDt: '2021-01-24 12:34',
                    },
                ]}
                size={20}
                page={0}
                totla={1}
                className="ag-grid-align-center"
                onRowNodeId={(row) => row.seqNo}
                onRowClicked={(data) => {
                    handleClickRow(data.seqNo);
                }}
            />
        </>
    );
};

export default SystemLogAgGrid;
