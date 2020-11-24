import React from 'react';
import { useSelector } from 'react-redux';

import { MokaTable } from '@components';
import columnDefs from './ReporterSearchAgGridColumns';
import { GET_REPORTER_LIST } from '@store/reporter';

const ReporterSearchAgGrid = (props) => {
    const { rowData, total, page, size, pageSizes, handleChangeSearchOption } = props;
    const { loading } = useSelector((store) => ({
        loading: store.loading[GET_REPORTER_LIST],
    }));

    return (
        <MokaTable
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(reporter) => reporter.repSeq}
            agGridHeight={600}
            rowHeight={50}
            // onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={page}
            size={size}
            onChangeSearchOption={handleChangeSearchOption}
            pageSizes={pageSizes}
        />
    );
};

export default ReporterSearchAgGrid;
