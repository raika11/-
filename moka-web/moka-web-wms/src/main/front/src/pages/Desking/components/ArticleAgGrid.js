import React from 'react';
import { MokaTable } from '@components';
import columnDefs from './ArticleAgGridColums';

const ArticleAgGrid = () => {
    return (
        <MokaTable
            headerHeight={50}
            agGridHeight={667}
            columnDefs={columnDefs}
            rowData={[]}
            onRowNodeId={(article) => article.contentsId}
            // onRowClicked={handleRowClicked}
            // loading={loading}
            total={0}
            page={0}
            size={20}
            showTotalString={false}
            // displayPageNum={3}
            // onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default ArticleAgGrid;
