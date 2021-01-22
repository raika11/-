import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@components';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import columnDefs, { test_data } from './CdnArticleAgGridColumns';

moment.locale('ko');

const ArticleCdnAgGrid = ({ match }) => {
    const history = useHistory();
    const [rowData, setRowData] = useState([]);

    /**
     * row clicked
     * @param {object} data RowData
     */
    const handleRowClicked = (data) => {
        history.push(`${match.path}/${data.totalId}`);
    };

    useEffect(() => {
        setRowData(
            test_data.map((data) => ({
                ...data,
                usedYn: data.totalId % 3 !== 0 ? 'Y' : 'N',
                regDt: moment(data.serviceDaytime, DB_DATEFORMAT).format('YYYY-MM-DD'),
            })),
        );
    }, []);

    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={rowData}
            rowHeight={50}
            className="overflow-hidden flex-fill"
            onRowNodeId={(data) => data.totalId}
            onRowClicked={handleRowClicked}
        />
    );
};

export default ArticleCdnAgGrid;
