import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Field from './Field';
import { useSelector } from 'react-redux';

const propTypes = {
    field: PropTypes.any,
};
/**
 * 기본 input
 */
const FieldGroup = (props) => {
    const { groupIdx, partIdx, onFieldChange } = props;

    const { editFormParts } = useSelector((store) => ({
        editFormParts: store.editForm.editFormParts,
    }));

    const part = editFormParts[partIdx];
    const fieldGroup = part.fieldGroups[groupIdx];

    return (
        <Form key={'F' + fieldGroup.group}>
            {fieldGroup.fields.map((field, idx) => (
                <Field key={`${field.group}_${idx}`} id={`${field.group}_${idx}`} name={`${field.group}_${idx}`} partIdx={partIdx} groupIdx={groupIdx} fieldIdx={idx}></Field>
            ))}
        </Form>
    );
};

FieldGroup.prototype = propTypes;

export default FieldGroup;
