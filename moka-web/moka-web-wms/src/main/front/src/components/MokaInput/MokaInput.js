import React, { forwardRef } from 'react';
import InputMask from 'react-input-mask';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

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
     * required 일 경우 라벨 옆에 * 표기
     */
    required: PropTypes.bool,
    /**
     * input element의 타입(기본 input)
     */
    as: PropTypes.oneOf(['input', 'select', 'radio', 'switch', 'checkbox', 'textarea']),
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
     * react-input-mask의 mask string
     */
    mask: PropTypes.string,
};
const defaultProps = {
    label: null,
    labelWidth: 90,
    as: 'input',
    required: false,
    inputProps: {},
    isInvalid: false,
};

/**
 * 공통 input 컴포넌트 (라벨 처리)
 */
const MokaInput = forwardRef((props, ref) => {
    const { label, labelWidth, className, labelClassName, required, as, type, placeholder, onChange, value, name, children, inputProps, mask, isInvalid, disabled } = props;

    /**
     * input 스타일 생성
     */
    const createControlStyle = () => ({
        width: label ? `calc(100% - ${labelWidth}px)` : '100%',
    });

    /**
     * input 생성
     */
    const createControl = () => {
        // 셀렉트
        if (as === 'select') {
            return (
                <Form.Control
                    ref={ref}
                    as="select"
                    {...inputProps}
                    placeholder={placeholder}
                    required={required}
                    onChange={onChange}
                    value={value}
                    name={name}
                    custom
                    isInvalid={isInvalid}
                    disabled={disabled}
                    style={createControlStyle()}
                >
                    {children}
                </Form.Control>
            );
        }
        // textarea
        else if (as === 'textarea') {
            return (
                <Form.Control
                    ref={ref}
                    as="textarea"
                    {...inputProps}
                    isInvalid={isInvalid}
                    disabled={disabled}
                    value={value}
                    required={required}
                    onChange={onChange}
                    style={createControlStyle()}
                />
            );
        }
        // 라디오
        else if (as === 'radio') {
            return (
                <Form.Check
                    ref={ref}
                    type="radio"
                    {...inputProps}
                    isInvalid={isInvalid}
                    disabled={disabled}
                    value={value}
                    required={required}
                    onChange={onChange}
                    style={createControlStyle()}
                />
            );
        }
        // 스위치
        else if (as === 'switch') {
            return (
                <Form.Check
                    ref={ref}
                    type="switch"
                    {...inputProps}
                    isInvalid={isInvalid}
                    disabled={disabled}
                    value={value}
                    required={required}
                    onChange={onChange}
                    style={createControlStyle()}
                />
            );
        }
        // 체크박스
        else if (as === 'checkbox') {
            return (
                <Form.Check
                    ref={ref}
                    type="checkbox"
                    {...inputProps}
                    isInvalid={isInvalid}
                    disabled={disabled}
                    value={value}
                    required={required}
                    onChange={onChange}
                    style={createControlStyle()}
                />
            );
        }
        // plainText
        else if (as === 'plainText') {
            return (
                <Form.Control
                    ref={ref}
                    as={as}
                    {...inputProps}
                    plainText
                    disabled={disabled}
                    isInvalid={isInvalid}
                    placeholder={placeholder}
                    type={type}
                    onChange={onChange}
                    required={required}
                    value={value}
                    name={name}
                    style={createControlStyle()}
                />
            );
        }
        return (
            <InputMask
                mask={mask}
                onChange={onChange}
                value={value}
                onPaste={inputProps.onPaste}
                onMouseDown={inputProps.onMouseDown}
                onFocus={inputProps.onFocus}
                onBlur={inputProps.onFocus}
                disabled={inputProps.disabled}
                readOnly={inputProps.readOnly}
            >
                {(maskProps) => {
                    console.log(maskProps);
                    return (
                        <Form.Control
                            ref={ref}
                            as={as}
                            {...inputProps}
                            {...maskProps}
                            isInvalid={isInvalid}
                            value={value}
                            onChange={onChange}
                            placeholder={placeholder}
                            type={type}
                            required={required}
                            name={name}
                            style={createControlStyle()}
                        />
                    );
                }}
            </InputMask>
        );
    };

    return (
        <>
            <Form.Group className={clsx('mb-2', 'd-flex', 'align-items-center', className)}>
                {label && (
                    <Form.Label className={clsx('px-0', 'mb-0', 'position-relative', labelClassName)} style={{ width: labelWidth }}>
                        {label}
                        {required && <span className="required-text">*</span>}
                    </Form.Label>
                )}
                {createControl()}
            </Form.Group>
            <Form.Control.Feedback type="invalid">Please choose a username.</Form.Control.Feedback>
        </>
    );
});

MokaInput.propTypes = propTypes;
MokaInput.defaultProps = defaultProps;

export default MokaInput;
