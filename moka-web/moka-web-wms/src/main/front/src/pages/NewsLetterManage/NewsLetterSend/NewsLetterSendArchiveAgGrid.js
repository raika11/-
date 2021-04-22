import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router';
import { MokaTable } from '@/components';
import columnDefs from './NewsLetterSendArchiveAgGridColumns';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 관리 > 수동 발송 아카이브 AgGrid
 */
const NewsLetterSendArchiveAgGrid = ({ match }) => {
    const history = useHistory();
    const [loading] = useState(false);
    const [search] = useState({ page: 1 });

    /**
     * 목록 Row클릭
     */
    const handleRowClicked = useCallback(
        (row) => {
            history.push(`${match.path}/${row.seq}`);
        },
        [history, match.path],
    );

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            paginationClassName="justify-content-center"
            columnDefs={columnDefs}
            rowData={[
                { seq: '1', type: '브리핑', newsLetter: '팩플' },
                { seq: '2', type: '오리지널', newsLetter: '뉴스다이제스트' },
            ]}
            onRowNodeId={(data) => data.seq}
            onRowClicked={handleRowClicked}
            loading={loading}
            page={search.page}
            pageSizes={false}
            showTotalString={false}
        />
    );
};

export default NewsLetterSendArchiveAgGrid;
