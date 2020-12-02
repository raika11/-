import React from 'react';

import { MokaTable } from '@components';
import { columnDefs, rowData } from './SpecialAgGridColumns';

const SpecialAgGrid = () => {
    const handleRowClicked = () => {};

    const handleChangeSearchOption = () => {};

    return (
        <MokaTable
            agGridHeight={685}
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(special) => special.cdSeq}
            onRowClicked={handleRowClicked}
            // loading={loading}
            total={0}
            page={0}
            size={20}
            onChangeSearchOption={handleChangeSearchOption}
            preventRowClickCell={['urlCopy', 'cmsTagCopy', 'urlConfirm', 'edit']}
            // selected={special.cdSeq}
        />
    );
};

export default SpecialAgGrid;
