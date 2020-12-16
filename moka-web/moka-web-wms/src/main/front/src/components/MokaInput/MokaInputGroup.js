import React, { forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import MokaPrependLinkInput from './MokaPrependLinkInput';
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
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * 라벨의 넓이 (기본 값 90px)
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
     * inputGroup의 className
     */
    inputGroupClassName: PropTypes.string,
    /**
     * InputGroup.Append에 들어갈 노드
     */
    append: PropTypes.node,
    /**
     * InputGroup.prepend에 들어갈 노드
     */
    prepend: PropTypes.node,
    /**
     * style 객체
     */
    style: PropTypes.object,
    /**
     * InputGroup의 isInvalid
     */
    isInvalid: PropTypes.bool,
    /**
     * prependLink -> MokaPrependLinkInput
     */
    as: PropTypes.oneOf(['input', 'textarea', 'prependLink']),
};
const defaultProps = {
    label: null,
    labelWidth: 70,
    as: 'input',
    required: false,
    inputProps: {},
    isInvalid: false,
};

/**
 * 라벨 붙여주는 inputGroup
 */
const MokaInputGroup = forwardRef((props, ref) => {
    // label props
    const { label, labelWidth, className, labelClassName, required } = props;

    // inputGroup props
    const { inputGroupClassName, append, prepend, style, isInvalid } = props;

    // input props
    const { inputClassName, as, type, placeholder, onChange, value, id, name, inputProps, disabled } = props;

    /**
     * inputGroup 생성
     */
    const createInputGroup = () => {
        if (as !== 'prependLink') {
            return (
                <InputGroup className={clsx('flex-fill', inputGroupClassName, { 'is-invalid': isInvalid })} style={style}>
                    {prepend && <InputGroup.Prepend>{prepend}</InputGroup.Prepend>}
                    <MokaInput
                        ref={ref}
                        as={as}
                        className={inputClassName}
                        {...inputProps}
                        id={id}
                        name={name}
                        disabled={disabled}
                        value={value}
                        onChange={onChange}
                        type={type}
                        placeholder={placeholder}
                    />
                    {append && <InputGroup.Append>{append}</InputGroup.Append>}
                </InputGroup>
            );
        } else {
            return <MokaPrependLinkInput {...inputProps} isInvalid={isInvalid} />;
        }
    };

    return label ? (
        <Form.Group className={clsx('mb-2', 'd-flex', 'align-items-center', className)}>
            <Form.Label
                className={clsx('px-0 mb-0 position-relative flex-shrink-0', labelClassName)}
                style={{ width: labelWidth, minWidth: labelWidth, marginRight: 12, marginLeft: 8 }}
            >
                {required && <span className="required-text">*</span>}
                {label}
            </Form.Label>
            {createInputGroup()}
        </Form.Group>
    ) : (
        createInputGroup()
    );
});

MokaInputGroup.propTypes = propTypes;
MokaInputGroup.defaultProps = defaultProps;

export default MokaInputGroup;
