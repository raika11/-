import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import PartEdit from './PartEdit';

const propTypes = {
    parts: PropTypes.any,
    formId: PropTypes.string,
};
/**
 * 기본 input
 */
const PartList = (props) => {
    const { formId, parts } = props;
    const [editForm, setEditForm] = useState(parts);

    const renderFormData = () => {
        const formRows = [];
        if (parts && parts.length > 0) {
            parts.forEach((part, partIdx) => {
                formRows.push(<PartEdit key={`part${partIdx}`} partIdx={partIdx} formId={formId} />);
            });
        }

        return formRows;
    };

    useEffect(() => {
        if (parts) {
            setEditForm(parts);
        }
    }, [parts, setEditForm]);

    return <div>{renderFormData()}</div>;
};

PartList.prototype = propTypes;

export default PartList;
