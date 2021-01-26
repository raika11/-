import React from 'react';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@components';
import { columnDefs } from './EditLogAgGridColumn';

const EditLogAgGrid = ({ match }) => {
    const history = useHistory();

    const handleClickRow = (data) => history.push(`${match.path}/${data.seqNo}`);

    return (
        <>
            <MokaTable
                className="overflow-hidden flex-fill ag-grid-align-center"
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
                total={1}
                onRowNodeId={(row) => row.seqNo}
                onRowClicked={handleClickRow}
            />
        </>
    );
};

export default EditLogAgGrid;
