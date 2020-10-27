import React, { forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import MokaPrependLinkInput from './MokaPrependLinkInput';
import MokaInput from './MokaInput';

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
     * ---------------------------------------------------------------------------------------------
     * input element의 타입(기본 input)
     * prependLink -> MokaPrependLinkInput
     * ---------------------------------------------------------------------------------------------
     */
    as: PropTypes.oneOf(['input', 'textarea', 'prependLink']),
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
    const { inputGroupClassName, append, prepend, style } = props;

    // input props
    const { inputClassName, as, type, placeholder, onChange, value, id, name, mask, inputProps, isInvalid, disabled } = props;

    /**
     * inputGroup 생성
     */
    const createInputGroup = () => {
        if (as !== 'prependLink') {
            return (
                <InputGroup className={clsx('flex-fill', inputGroupClassName)} style={style}>
                    {prepend && <InputGroup.Prepend>{prepend}</InputGroup.Prepend>}
                    <MokaInput
                        ref={ref}
                        as={as}
                        className={inputClassName}
                        {...inputProps}
                        id={id}
                        name={name}
                        isInvalid={isInvalid}
                        disabled={disabled}
                        value={value}
                        onChange={onChange}
                        type={type}
                        placeholder={placeholder}
                        mask={mask}
                    />
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
