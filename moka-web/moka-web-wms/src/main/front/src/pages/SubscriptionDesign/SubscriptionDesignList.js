import React from 'react';
import SubscriptionDesignSearch from './SubscriptionDesignSearch';
import SubscriptionDesignAgGrid from './SubscriptionDesignAgGrid';

/**
 * 구독 관리 > 구독 설계 > 리스트
 */
const SubscriptionDesignList = (props) => {
    return (
        <React.Fragment>
            <SubscriptionDesignSearch {...props} />
            <SubscriptionDesignAgGrid {...props} />
        </React.Fragment>
    );
};

export default SubscriptionDesignList;
