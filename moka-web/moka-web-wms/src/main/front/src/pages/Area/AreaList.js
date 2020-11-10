import React from 'react';
import { Route } from 'react-router-dom';
import Depth1 from './AreaAgGridDepth1';

const AreaList = ({ match, onDelete }) => {
    return <Route path={[`${match.url}/:areaSeq`, match.url]} strict render={(props) => <Depth1 {...props} onDelete={onDelete} />} />;
};

export default AreaList;
