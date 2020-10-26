import React from 'react';
import AgGrid from './DomainAgGrid';

/**
 * 도메인 리스트
 */
const DomainList = (props) => {
    const { onDelete } = props;
    return <AgGrid onDelete={onDelete} />;
};

export default DomainList;
