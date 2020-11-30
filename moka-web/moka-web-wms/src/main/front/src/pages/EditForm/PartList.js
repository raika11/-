import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import PartEdit from './PartEdit';
import { shallowEqual, useSelector } from 'react-redux';

const propTypes = {
    parts: PropTypes.any,
    formId: PropTypes.string,
};
/**
 * 기본 input
 */
const PartList = (props) => {
    const { formId } = props;

    const { editFormParts } = useSelector(
        (store) => ({
            editForm: store.editForm.editForm,
            editFormParts: store.editForm.editFormParts,
            editFormPart: store.editForm.editFormPart,
            invalidList: store.editForm.invalidList,
            publishModalShow: store.editForm.publishModalShow,
            historyModalShow: store.editForm.historyModalShow,
        }),
        shallowEqual,
    );

    const renderFormData = useCallback(() => {
        const formRows = [];
        if (editFormParts && editFormParts.length > 0) {
            editFormParts.forEach((part, partIdx) => {
                formRows.push(<PartEdit key={`part${partIdx}`} partIdx={partIdx} formId={formId} />);
            });
        }

        return formRows;
    });

    useEffect(() => {
        if (editFormParts) {
            renderFormData();
        }
    }, [editFormParts, renderFormData]);

    return <div>{renderFormData()}</div>;
};

PartList.prototype = propTypes;

export default PartList;
