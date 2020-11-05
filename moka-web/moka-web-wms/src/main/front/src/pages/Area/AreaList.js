import React from 'react';
import { Route } from 'react-router-dom';
import Depth1 from './AreaAgGridDepth1';

const AreaList = ({ match }) => {
    return <Route path={[`${match.url}/:areaSeq`, match.url]} strict component={Depth1} />;
};

export default AreaList;
