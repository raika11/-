import React, { forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { MokaAutocomplete } from '@components';
// import { MokaImageInput, MokaDateTimePicker } from '@components';

const propTypes = {
    /**
     * input의 className
     */
    className: PropTypes.string,
    /**
     * input element의 타입(기본 input)
     */
    as: PropTypes.oneOf(['input', 'select', 'radio', 'switch', 'checkbox', 'textarea', 'imageFile', 'autocomplete', 'dateTimePicker']),
    /**
     * input의 type
     */
    type: PropTypes.string,
    /**
     * input의 placeholder
     */
    placeholder: PropTypes.string,
    /**
     * input의 defaultValue
     */
    defaultValue: PropTypes.any,
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
};
const defaultProps = {
    as: 'input',
    type: 'text',
    inputProps: {},
};

/**
 * react-hook-form의 ref를 받아서 구현되는 uncontrolled input
 */
const MokaUncontrolledInput = forwardRef((props, ref) => {
    const { control } = useForm();
    const { className, as, type, placeholder, onChange, defaultValue, id, name, children, inputProps, isInvalid, disabled } = props;

    // 셀렉트
    if (as === 'select') {
        return (
            <Form.Control
                {...inputProps}
                ref={ref}
                as="select"
                id={id}
                name={name}
                className={clsx('flex-fill', className)}
                isInvalid={isInvalid}
                disabled={disabled}
                defaultValue={defaultValue}
                onChange={onChange}
                custom
            >
                {children}
            </Form.Control>
        );
    }
    // textarea
    else if (as === 'textarea') {
        return (
            <Form.Control
                {...inputProps}
                ref={ref}
                as="textarea"
                id={id}
                name={name}
                className={clsx('flex-fill', className)}
                isInvalid={isInvalid}
                disabled={disabled}
                defaultValue={defaultValue}
                onChange={onChange}
            />
        );
    }
    // 라디오
    else if (as === 'radio') {
        return (
            <Form.Check
                {...inputProps}
                ref={ref}
                type="radio"
                id={id}
                name={name}
                className={clsx('flex-fill', className)}
                isInvalid={isInvalid}
                disabled={disabled}
                defaultValue={defaultValue}
                onChange={onChange}
            />
        );
    }
    // 스위치
    else if (as === 'switch') {
        return (
            <Form.Check
                {...inputProps}
                ref={ref}
                type="switch"
                id={id}
                name={name}
                className={clsx('flex-fill', className)}
                isInvalid={isInvalid}
                disabled={disabled}
                defaultValue={defaultValue}
                onChange={onChange}
                label={inputProps.label || ''}
            />
        );
    }
    // 체크박스
    else if (as === 'checkbox') {
        return (
            <Form.Check
                {...inputProps}
                ref={ref}
                type="checkbox"
                id={id}
                name={name}
                className={clsx('flex-fill', className)}
                isInvalid={isInvalid}
                disabled={disabled}
                defaultValue={defaultValue}
                onChange={onChange}
            />
        );
    }
    // 드롭가능한 이미지 파일
    // else if (as === 'imageFile') {
    //     return <MokaImageInput ref={ref} {...inputProps} />;
    // }
    // auto complete
    else if (as === 'autocomplete') {
        return (
            <Controller
                defaultValue={defaultValue}
                name={name}
                control={control}
                render={(props) => <MokaAutocomplete isInvalid={isInvalid} id={id} onChange={onChange} {...inputProps} {...props} />}
            />
        );
    }
    // dateTimePicker
    // else if (as === 'dateTimePicker') {
    //     return <MokaDateTimePicker onChange={onChange} placeholder={placeholder} disabled={disabled} {...inputProps} />;
    // }

    return (
        <Form.Control
            {...inputProps}
            ref={ref}
            type={type}
            as={as}
            id={id}
            name={name}
            className={clsx('flex-fill', className)}
            isInvalid={isInvalid}
            disabled={disabled}
            defaultValue={defaultValue}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
});

MokaUncontrolledInput.propTypes = propTypes;
MokaUncontrolledInput.defaultProps = defaultProps;

export default MokaUncontrolledInput;
