import React from 'react';
import EditLogSearch from './EditLogSearch';
import EditLogAgGrid from './EditLogAgGrid';

const EditLogList = (props) => {
    return (
        <>
            <EditLogSearch {...props} />
            <EditLogAgGrid {...props} />
        </>
    );
};

export default EditLogList;
