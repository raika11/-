import React, { forwardRef } from 'react';
import clsx from 'clsx';
// import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import { MokaImageInput, MokaAutocomplete, MokaDateTimePicker } from '@components';

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
     * uncontrolled input (기본 false)
     */
    uncontrolled: PropTypes.bool,
};
const defaultProps = {
    as: 'input',
    type: 'text',
    inputProps: {},
    uncontrolled: false,
};

/**
 * controlled input
 */
const InputFactory = forwardRef((props, ref) => {
    const { className, as, type, placeholder, onChange, value, id, name, children, inputProps, isInvalid, disabled, uncontrolled, ...rest } = props;

    let Element = Form.Control;
    let attributes = {
        id,
        name,
        className: clsx('flex-fill', className),
        isInvalid,
        disabled,
        onChange,
        placeholder,
        ref,
        ...inputProps,
        ...rest,
    };

    if (uncontrolled) {
        attributes = { ...attributes, defaultValue: value };
    } else {
        attributes = { ...attributes, value: value || '' };
    }

    // 셀렉트
    if (as === 'select') {
        attributes = { ...attributes, as, custom: true };
    }
    // textarea
    else if (as === 'textarea') {
        attributes = { ...attributes, as };
    }
    // 라디오
    else if (as === 'radio') {
        Element = Form.Check;
        attributes = { ...attributes, type: as };
    }
    // 스위치
    else if (as === 'switch') {
        Element = Form.Check;
        attributes = { ...attributes, type: as, label: inputProps.label || '' };
    }
    // 체크박스
    else if (as === 'checkbox') {
        Element = Form.Check;
        attributes = { ...attributes, type: as };
    }
    // 드롭가능한 이미지 파일
    else if (as === 'imageFile') {
        Element = MokaImageInput;
        attributes = { ...inputProps, ref };

        /*return <MokaImageInput ref={ref} {...inputProps} />;*/
    }
    // auto complete
    else if (as === 'autocomplete') {
        Element = MokaAutocomplete;
        /*if (uncontrolled) {
            inputObject = {
                ...inputObject,
                value,
            };

            console.log(inputObject);
            return (
                <Controller
                    name={name}
                    rules={rules}
                    control={control}
                    defaultValue={value}
                    render={(props) => {
                        const { onChange: controllerChange, value, ...restControllerProps } = props;
                        // restControllerProps에 value 제외하여야함(이유는 모르겠음..)
                        return (
                            <MokaAutocomplete
                                id={id}
                                isInvalid={isInvalid}
                                onChange={(value) => {
                                    controllerChange(value);
                                    if (onChange) {
                                        onChange(value);
                                    }
                                }}
                                value={inputObject.defaultValue}
                                className={className}
                                {...inputProps}
                                {...restControllerProps}
                            />
                        );
                    }}
                />
            );
        }*/
    }
    // dateTimePicker
    else if (as === 'dateTimePicker') {
        Element = MokaDateTimePicker;
        attributes = { ...attributes, placeholder };
    }
    // 기본 input
    else {
        attributes = { ...attributes, placeholder, type };
    }

    return <Element {...attributes}>{children && children}</Element>;
});

InputFactory.propTypes = propTypes;
InputFactory.defaultProps = defaultProps;

export default InputFactory;
