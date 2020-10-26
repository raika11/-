import React, { forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import MokaPrependLinkInput from './MokaPrependLinkInput';

const propTypes = {
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
     * input의 className
     */
    inputClassName: PropTypes.string,
    /**
     * required 일 경우 라벨 옆에 * 표기
     */
    required: PropTypes.bool,
    /**
     * input element의 타입(기본 input)
     */
    as: PropTypes.oneOf(['input', 'textarea', 'prependLink']),
    /**
     * input의 type
     */
    type: PropTypes.string,
    /**
     * input의 placeholder
     */
    placeholder: PropTypes.string,
    /**
     * input의 value
     */
    value: PropTypes.any,
    /**
     * 값 valid 체크
     */
    isInvalid: PropTypes.bool,
    /**
     * input의 disabled
     */
    disabled: PropTypes.bool,
    /**
     * input의 onChange
     */
    onChange: PropTypes.func,
    /**
     * name
     */
    name: PropTypes.string,
    /**
     * 그 외 input props
     */
    inputProps: PropTypes.shape({
        custom: PropTypes.bool,
        readOnly: PropTypes.bool,
        plaintext: PropTypes.bool,
    }),
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
    const {
        label,
        labelWidth,
        className,
        labelClassName,
        inputClassName,
        required,
        as,
        type,
        placeholder,
        onChange,
        value,
        name,
        inputProps,
        isInvalid,
        disabled,
        inputGroupClassName,
        append,
        prepend,
    } = props;

    /**
     * input 생성
     */
    const createControl = () => {
        // textarea
        if (as === 'textarea') {
            return (
                <Form.Control
                    ref={ref}
                    as="textarea"
                    {...inputProps}
                    className={inputClassName}
                    isInvalid={isInvalid}
                    disabled={disabled}
                    value={value}
                    required={required}
                    onChange={onChange}
                    name={name}
                />
            );
        }

        return (
            <Form.Control
                ref={ref}
                as={as}
                {...inputProps}
                className={inputClassName}
                isInvalid={isInvalid}
                disabled={disabled}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
                required={required}
                name={name}
            />
        );
    };

    /**
     * inputGroup 생성
     */
    const createInputGroup = () => {
        if (as !== 'prependLink') {
            return (
                <InputGroup className={clsx('flex-fill', inputGroupClassName)}>
                    {prepend && <InputGroup.Prepend>{prepend}</InputGroup.Prepend>}
                    {createControl()}
                    {append && <InputGroup.Append>{append}</InputGroup.Append>}
                </InputGroup>
            );
        } else {
            return <MokaPrependLinkInput {...inputProps} />;
        }
    };

    return label ? (
        <Form.Group className={clsx('mb-2', 'd-flex', 'align-items-center', className)}>
            <Form.Label className={clsx('px-0', 'mb-0', 'position-relative', 'mr-3', 'text-right', labelClassName)} style={{ width: labelWidth, minWidth: labelWidth }}>
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
