import React, { forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import MokaInput from './MokaInput';

const propTypes = {
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
     * ---------------------------------------------------------------------------------------------
     * input element의 타입(기본 input)
     * imageFile -> MokaImageInput
     * none -> label만 그림 (input 없음)
     * autocomplete -> MokaAutocomplete
     * ---------------------------------------------------------------------------------------------
     */
    as: PropTypes.oneOf(['input', 'select', 'radio', 'switch', 'checkbox', 'textarea', 'imageFile', 'none', 'autocomplete']),
    /**
     * MokaInput의 className
     */
    inputClassName: PropTypes.string,
    /**
     * MokaInput의 type
     */
    type: PropTypes.string,
    /**
     * MokaInput의 placeholder
     */
    placeholder: PropTypes.string,
    /**
     * MokaInput의 value
     */
    value: PropTypes.any,
    /**
     * MokaInput의 isInvalid
     */
    isInvalid: PropTypes.bool,
    /**
     * MokaInput의 disabled
     */
    disabled: PropTypes.bool,
    /**
     * MokaInput의 onChange
     */
    onChange: PropTypes.func,
    /**
     * MokaInput의 id
     */
    id: PropTypes.string,
    /**
     * MokaInput의 name
     */
    name: PropTypes.string,
    /**
     * 그 외 MokaInput의 props
     * 자세한 설명은 MokaInput의 inputProps를 참고한다
     */
    inputProps: PropTypes.shape({
        custom: PropTypes.bool,
        readOnly: PropTypes.bool,
        plaintext: PropTypes.bool,
    }),
    /**
     * MokaInput의 mask string
     */
    mask: PropTypes.string,
};
const defaultProps = {
    label: null,
    labelWidth: 70,
    labelClassName: 'mr-3',
    as: 'input',
    required: false,
    inputProps: {},
    isInvalid: false,
};

/**
 * 라벨 + input
 */
const MokaInputLabel = forwardRef((props, ref) => {
    // label props
    const { label, labelWidth, className, labelClassName, required } = props;

    // input props
    const { inputClassName, as, type, placeholder, onChange, value, id, name, children, inputProps, mask, isInvalid, disabled } = props;

    return (
        <Form.Group className={clsx('d-flex', 'align-items-center', className)}>
            <Form.Label className={clsx('px-0', 'mb-0', 'position-relative', 'text-right', labelClassName)} style={{ width: labelWidth, minWidth: labelWidth }} htmlFor="none">
                {required && <span className="required-text">*</span>}
                {label}
            </Form.Label>
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
                    mask={mask}
                    placeholder={placeholder}
                    type={type}
                    inputProps={inputProps}
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
