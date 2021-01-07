import React from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/SEOMeta/SEOMetaAgGridColumn';

const SEOMetaAgGrid = () => {
    return (
        <>
            <MokaTable columnDefs={columnDefs} onRowNodeId={(row) => row.id} agGridHeight={625} rowData={[]} size={20} page={0} totla={0} />
        </>
    );
};

export default SEOMetaAgGrid;
