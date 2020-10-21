import React, { forwardRef } from 'react';
import clsx from 'clsx';
import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import { MokaImageInput } from '@components';

const propTypes = {
    /**
     * input의 className
     */
    className: PropTypes.string,
    /**
     * input element의 타입(기본 input)
     */
    as: PropTypes.oneOf(['input', 'select', 'radio', 'switch', 'checkbox', 'textarea', 'imageFile']),
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
        id: PropTypes.string,
        custom: PropTypes.bool,
        readOnly: PropTypes.bool,
        plaintext: PropTypes.bool,
    }),
    /**
     * react-input-mask의 mask string
     */
    mask: PropTypes.string,
};
const defaultProps = {};

/**
 * 기본 input
 */
const MokaInput = forwardRef((props, ref) => {
    const { className, as, type, placeholder, onChange, value, name, children, inputProps, mask, isInvalid, disabled } = props;

    // 셀렉트
    if (as === 'select') {
        return (
            <Form.Control
                ref={ref}
                as="select"
                {...inputProps}
                className={clsx('flex-fill', className)}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                name={name}
                custom
                isInvalid={isInvalid}
                disabled={disabled}
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
                className={clsx('flex-fill', className)}
                isInvalid={isInvalid}
                disabled={disabled}
                value={value}
                onChange={onChange}
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
                className={clsx('flex-fill', className)}
                isInvalid={isInvalid}
                disabled={disabled}
                value={value}
                onChange={onChange}
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
                label={inputProps.label || ''}
                className={clsx('flex-fill', className)}
                isInvalid={isInvalid}
                disabled={disabled}
                value={value}
                onChange={onChange}
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
                className={clsx('flex-fill', className)}
                isInvalid={isInvalid}
                disabled={disabled}
                value={value}
                onChange={onChange}
            />
        );
    }
    // 드롭가능한 이미지 파일
    else if (as === 'imageFile') {
        return <MokaImageInput ref={ref} {...inputProps} />;
    }

    return (
        <InputMask
            mask={mask}
            onChange={onChange}
            value={value}
            disabled={disabled}
            {...inputProps}
            // onPaste={inputProps.onPaste}
            // onMouseDown={inputProps.onMouseDown}
            // onFocus={inputProps.onFocus}
            // onBlur={inputProps.onBlur}
            // readOnly={inputProps.readOnly}
        >
            {(maskProps) => (
                <Form.Control
                    ref={ref}
                    as={as}
                    {...inputProps}
                    {...maskProps}
                    className={clsx('flex-fill', className)}
                    isInvalid={isInvalid}
                    disabled={disabled}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    type={type}
                    name={name}
                />
            )}
        </InputMask>
    );
});

MokaInput.propTypes = propTypes;
MokaInput.defaultProps = defaultProps;

export default MokaInput;
