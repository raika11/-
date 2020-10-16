import React, { forwardRef } from 'react';
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
     * input의 type (기본 text)
     */
    type: PropTypes.oneOf(['text', 'select', 'radio', 'switch', 'checkbox']),
    /**
     * input의 placeholder
     */
    placeholder: PropTypes.string,
    /**
     * input의 value
     */
    value: PropTypes.any,
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
    }),
};
const defaultProps = {
    label: null,
    labelWidth: 90,
    type: 'text',
    required: false,
    inputProps: {},
};

/**
 * 공통 input 컴포넌트 (라벨 처리)
 */
const MokaInput = forwardRef((props, ref) => {
    const { label, labelWidth, className, labelClassName, required, type, placeholder, onChange, value, name, children, inputProps } = props;

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
        if (type === 'select') {
            return (
                <Form.Control ref={ref} as="select" placeholder={placeholder} onChange={onChange} value={value} name={name} custom {...inputProps} style={createControlStyle()}>
                    {children}
                </Form.Control>
            );
        } else if (type === 'radio') {
            return <Form.Check type="radio" {...inputProps} value={value} onChange={onChange} style={createControlStyle()} />;
        } else if (type === 'switch') {
            return <Form.Check type="switch" {...inputProps} value={value} onChange={onChange} style={createControlStyle()} />;
        } else if (type === 'checkbox') {
            return <Form.Check type="checkbox" {...inputProps} value={value} onChange={onChange} style={createControlStyle()} />;
        }

        return <Form.Control ref={ref} type={type} placeholder={placeholder} onChange={onChange} value={value} name={name} {...inputProps} style={createControlStyle()} />;
    };

    return (
        <Form.Group className={clsx('mb-2', 'd-flex', 'align-items-center', className)}>
            {label && (
                <Form.Label className={clsx('px-0', 'mb-0', 'position-relative', labelClassName)} style={{ width: labelWidth }}>
                    {label}
                    {required && <span className="required-text">*</span>}
                </Form.Label>
            )}
            {createControl()}
        </Form.Group>
    );
});

MokaInput.propTypes = propTypes;
MokaInput.defaultProps = defaultProps;

export default MokaInput;
