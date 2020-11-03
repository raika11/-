import React, { forwardRef } from 'react';
import clsx from 'clsx';
// import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import { MokaImageInput, MokaAutocomplete } from '@components';

const propTypes = {
    /**
     * input의 className
     */
    className: PropTypes.string,
    /**
     * input element의 타입(기본 input)
     */
    as: PropTypes.oneOf(['input', 'select', 'radio', 'switch', 'checkbox', 'textarea', 'imageFile', 'autocomplete']),
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
     * input id
     */
    id: PropTypes.string,
    /**
     * input의 name
     */
    name: PropTypes.string,
    /**
     * ---------------------------------------------------------------------------------------------
     * value, placeholder, type, onChange, disabled, name, isInvalid가 아닌
     * input의 추가 props를 정의한다.
     * (input 형태에 따라 필요한 props가 각기 다르기 때문에 모두 명시하지 않음, 아래는 예제 props)
     * ---------------------------------------------------------------------------------------------
     */
    inputProps: PropTypes.shape({
        /**
         * custom 여부(라디오, 체크박스)
         */
        custom: PropTypes.bool,
        /**
         * readOnly (텍스트, textarea)
         */
        readOnly: PropTypes.bool,
        /**
         * type="input" 에서 사용하며 input을 plaintext처럼 보이게 한다
         */
        plaintext: PropTypes.bool,
    }),
    /**
     * react-input-mask의 mask string
     */
    mask: PropTypes.string,
};
const defaultProps = {
    as: 'input',
    type: 'text',
    inputProps: {},
};

/**
 * 기본 input
 */
const MokaInput = forwardRef((props, ref) => {
    const { className, as, type, placeholder, onChange, value, id, name, children, inputProps, mask, isInvalid, disabled, ...rest } = props;

    // 셀렉트
    if (as === 'select') {
        return (
            <Form.Control
                ref={ref}
                as="select"
                {...inputProps}
                id={id}
                name={name}
                className={clsx('flex-fill', className)}
                isInvalid={isInvalid}
                disabled={disabled}
                value={value || undefined}
                onChange={onChange || undefined}
                custom
                {...rest}
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
                id={id}
                name={name}
                className={clsx('flex-fill', className)}
                isInvalid={isInvalid}
                disabled={disabled}
                value={value || ''}
                onChange={onChange}
                {...rest}
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
                id={id}
                name={name}
                className={clsx('flex-fill', className)}
                isInvalid={isInvalid}
                disabled={disabled}
                value={value || undefined}
                onChange={onChange || undefined}
                {...rest}
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
                id={id}
                name={name}
                className={clsx('flex-fill', className)}
                isInvalid={isInvalid}
                disabled={disabled}
                value={value || undefined}
                onChange={onChange || undefined}
                label={inputProps.label || ''}
                {...rest}
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
                id={id}
                name={name}
                className={clsx('flex-fill', className)}
                isInvalid={isInvalid}
                disabled={disabled}
                value={value || undefined}
                onChange={onChange || undefined}
                {...rest}
            />
        );
    }
    // 드롭가능한 이미지 파일
    else if (as === 'imageFile') {
        return <MokaImageInput ref={ref} {...inputProps} />;
    }
    // auto complete
    else if (as === 'autocomplete') {
        return <MokaAutocomplete value={value} onChange={onChange} {...inputProps} />;
    }

    return (
        <Form.Control
            ref={ref}
            as={as}
            {...inputProps}
            id={id}
            name={name}
            className={clsx('flex-fill', className)}
            isInvalid={isInvalid}
            disabled={disabled}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            {...rest}
        />
    );

    // return (
    //     <InputMask
    //         mask={mask}
    //         onChange={onChange || undefined}
    //         value={value || undefined}
    //         disabled={disabled}
    //         // readOnly={inputProps.readOnly}
    //         // onPaste={inputProps.onPaste}
    //         // onMouseDown={inputProps.onMouseDown}
    //         // onFocus={inputProps.onFocus}
    //         // onBlur={inputProps.onBlur}
    //         {...inputProps}
    //     >
    //         {(maskProps) => (
    //             <Form.Control
    //                 ref={ref}
    //                 as={as}
    //                 {...inputProps}
    //                 {...maskProps}
    //                 id={id}
    //                 name={name}
    //                 className={clsx('flex-fill', className)}
    //                 isInvalid={isInvalid}
    //                 disabled={disabled}
    //                 value={value || undefined}
    //                 onChange={onChange || undefined}
    //                 placeholder={placeholder}
    //                 type={type}
    //                 {...rest}
    //             />
    //         )}
    //     </InputMask>
    // );
});

MokaInput.propTypes = propTypes;
MokaInput.defaultProps = defaultProps;

export default MokaInput;
