import React from 'react';
import DesignSearch from './DesignSearch';
import DesignAgGrid from './DesignAgGrid';

/**
 * 구독 관리 > 구독 설계 > 리스트
 */
const DesignList = (props) => {
    return (
        <React.Fragment>
            <DesignSearch {...props} />
            <DesignAgGrid {...props} />
        </React.Fragment>
    );
};

export default DesignList;
