import React, { useState, useEffect } from 'react';
import { MokaTable } from '@components';
import columnDefs from './DeskingWorkHistoryListColumns';
import { unescapeHtmlArticle } from '@utils/convertUtil';

const DeskingWorkHistoryList = (props) => {
    const { loading, rowData } = props;
    const [rows, setRows] = useState([]);

    useEffect(() => {
        setRows(
            rowData.map((r) => ({
                ...r,
                title: unescapeHtmlArticle(r.title),
            })),
        );
    }, [rowData]);

    return (
        <MokaTable columnDefs={columnDefs} rowData={rows} onRowNodeId={(history) => history.histSeq} agGridHeight={721} onRowClicked={() => {}} loading={loading} paging={false} />
    );
};

export default DeskingWorkHistoryList;
