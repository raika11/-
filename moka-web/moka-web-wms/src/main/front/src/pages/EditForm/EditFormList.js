import React from 'react';
import AgGrid from './EditFormAgGrid';

/**
 * 편집폼 리스트
 */
const EditFormList = (props) => {
    const { onDelete } = props;
    return <AgGrid onDelete={onDelete} />;
};

export default EditFormList;
