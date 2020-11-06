import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import PartEdit from './PartEdit';

const propTypes = {
    formData: PropTypes.any,
};
/**
 * 기본 input
 */
const PartList = (props) => {
    const { formData } = props;
    const [editForm, setEditForm] = useState(formData);

    const renderFormData = () => {
        const formRows = [];
        if (editForm != null && editForm !== '') {
            if (formData && formData.parts) {
                formData.parts.forEach((part, partIdx) => {
                    formRows.push(<PartEdit part={part} channelId={editForm.id} />);
                });
            }
        }

        return formRows;
    };

    useEffect(() => {
        if (formData) {
            setEditForm(formData);
        }
    }, [formData, setEditForm]);

    return <div>{renderFormData()}</div>;
};

PartList.prototype = propTypes;

export default PartList;
