import React from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Survey/Poll/components/RelationPollAgGridColumns';

const RelationPollModalAgGridComponent = () => {
    return <MokaTable columnDefs={columnDefs} size={20} total={0} page={0} rowData={[]} rowHeight={65} agGridHeight={645} />;
};

export default RelationPollModalAgGridComponent;
