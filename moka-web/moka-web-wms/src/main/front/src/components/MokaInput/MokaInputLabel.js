import React, { forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import MokaInput, { propTypes as inputPropTypes } from './MokaInput';

const propTypes = {
    ...inputPropTypes,
    /**
     * MokaInput의 className
     */
    inputClassName: PropTypes.string,
    /**
     * FormGroup의 className
     */
    className: PropTypes.string,
    /**
     * 라벨 (개행이 들어갈 경우 node 형태로 보낸다)
     */
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    /**
     * 라벨의 넓이 (기본 값 70px)
     */
    labelWidth: PropTypes.number,
    /**
     * 라벨의 className
     */
    labelClassName: PropTypes.string,
    /**
     * required 일 경우 라벨 옆에 * 표기
     */
    required: PropTypes.bool,
    /**
     * none -> label만 그림 (input 없음),
     * 나머지 타입은 MokaInput 확인
     */
    as: PropTypes.oneOf(['input', 'select', 'radio', 'switch', 'checkbox', 'textarea', 'imageFile', 'none', 'autocomplete', 'dateTimePicker']),
};
const defaultProps = {
    label: null,
    labelWidth: 70,
    labelClassName: 'mr-3',
    as: 'input',
    required: false,
    inputProps: {},
    isInvalid: false,
    uncontrolled: false,
};

/**
 * 라벨 + input
 */
const MokaInputLabel = forwardRef((props, ref) => {
    // label props
    const { label, labelWidth, className, labelClassName, required } = props;

    // common props
    const { inputClassName, as, type, placeholder, onChange, children, inputProps, isInvalid, disabled, id, name, uncontrolled } = props;

    // MokaInput props
    const { value } = props;

    return (
        <Form.Group className={clsx('d-flex', 'align-items-center', className)}>
            {label && (
                <Form.Label className={clsx('px-0', 'mb-0', 'position-relative', 'text-right', labelClassName)} style={{ width: labelWidth, minWidth: labelWidth }} htmlFor="none">
                    {required && <span className="required-text">*</span>}
                    {label}
                </Form.Label>
            )}
            {as !== 'none' && (
                <MokaInput
                    ref={ref}
                    as={as}
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={inputClassName}
                    isInvalid={isInvalid}
                    disabled={disabled}
                    placeholder={placeholder}
                    type={type}
                    inputProps={inputProps}
                    uncontrolled={uncontrolled}
                >
                    {children}
                </MokaInput>
            )}
        </Form.Group>
    );
});

MokaInputLabel.propTypes = propTypes;
MokaInputLabel.defaultProps = defaultProps;

export default MokaInputLabel;
