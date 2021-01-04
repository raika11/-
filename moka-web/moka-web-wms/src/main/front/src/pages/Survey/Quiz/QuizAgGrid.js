import React from 'react';
import { MokaTable } from '@components';
import { columnDefs } from '@pages/Survey/Quiz/QuizAgGridColumns';

const QuizAgGrid = () => {
    return (
        <>
            <MokaTable columnDefs={columnDefs} onRowNodeId={(row) => row.id} agGridHeight={600} rowData={[]} page={0} size={20} total={0} />
        </>
    );
};

export default QuizAgGrid;
