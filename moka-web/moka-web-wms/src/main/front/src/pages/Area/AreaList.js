import React from 'react';
import AgGrid1Dpeth from './AreaAgGrid1Depth';
import AgGrid2Depth from './AreaAgGrid2Depth';
import AgGrid3Depth from './AreaAgGrid3Depth';

const AreaList = () => {
    return (
        <React.Fragment>
            <AgGrid1Dpeth />
            <AgGrid2Depth />
            <AgGrid3Depth />
        </React.Fragment>
    );
};

export default AreaList;
