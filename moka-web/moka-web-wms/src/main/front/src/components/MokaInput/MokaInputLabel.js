import React, { useState, useEffect, forwardRef } from 'react';
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
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * 라벨의 넓이
     * @default
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
    as: PropTypes.oneOf(['input', 'select', 'radio', 'switch', 'checkbox', 'textarea', 'file', 'imageFile', 'none', 'autocomplete', 'dateTimePicker']),
};
const defaultProps = {
    label: null,
    labelWidth: 70,
    as: 'input',
    required: false,
    inputProps: {},
    isInvalid: false,
    uncontrolled: false,
};
const newlineRegex = /[\n|\\n]/;

/**
 * 라벨 + input
 */
const MokaInputLabel = forwardRef((props, ref) => {
    const {
        // label props
        label,
        labelWidth,
        className,
        labelClassName,
        required,
        // common props
        inputClassName,
        as,
        type,
        placeholder,
        onChange,
        children,
        inputProps,
        isInvalid,
        invalidMessage,
        disabled,
        id,
        name,
        uncontrolled,
        // MokaInput props
        value,
        style,
        ...rest
    } = props;

    // state
    const [ln, setLn] = useState('');

    useEffect(() => {
        // label이 문자열이고 \n이 있으면 <br />로 변환
        if (typeof label === 'string' && newlineRegex.test(label)) {
            setLn(
                label.split(newlineRegex).map(
                    (l, idx) =>
                        l !== '' && (
                            <React.Fragment key={idx}>
                                {l}
                                <br />
                            </React.Fragment>
                        ),
                ),
            );
        } else {
            setLn(label);
        }
    }, [label]);

    return (
        <Form.Group className={clsx('d-flex align-items-center', className)} style={{ height: as === 'switch' ? 31 : undefined, ...style }}>
            {label && (
                <Form.Label
                    className={clsx('px-0 mb-0 position-relative flex-shrink-0 ft-13', labelClassName)}
                    style={{ width: labelWidth, minWidth: labelWidth, marginRight: 12 }}
                    htmlFor={id || 'none'}
                >
                    {required && <span className="required-text">*</span>}
                    {ln}
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
                    invalidMessage={invalidMessage}
                    disabled={disabled}
                    placeholder={placeholder}
                    type={type}
                    inputProps={inputProps}
                    uncontrolled={uncontrolled}
                    {...rest}
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
