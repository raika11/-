import React, { forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
// import { Controller } from 'react-hook-form';
import { MokaImageInput, MokaAutocomplete, MokaDateTimePicker } from '@components';

export const propTypes = {
    /**
     * input의 className
     */
    className: PropTypes.string,
    /**
     * input size
     */
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    /**
     * ---------------------------------------------------------------------------------------------
     * Input element의 타입 정의
     *
     * input -> react-bootstrap/Form.Control
     * select -> react-bootstrap/Form.Control
     * radio -> react-bootstrap/Form.Check
     * switch -> react-bootstrap/Form.Check
     * checkbox -> react-bootstrap/Form.Check
     * textarea -> react-bootstrap/Form.Control
     * imageFile -> MokaImageInput
     * autocomplete -> MokaAutocomplete
     * dateTimePicker -> MokaDateTimePicker
     * ---------------------------------------------------------------------------------------------
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
const MokaInput = forwardRef((props, ref) => {
    const { className, as, type, placeholder, onChange, value, id, name, children, inputProps, isInvalid, disabled, uncontrolled, size, ...rest } = props;
    // const { rules, control } = props;

    let Type = Form.Control;
    let inputObject = {
        id,
        name,
        className: clsx('flex-fill', className),
        isInvalid,
        disabled,
        onChange,
        placeholder,
        ref,
        size,
        ...inputProps,
        ...rest,
    };

    if (uncontrolled) {
        inputObject = { ...inputObject, defaultValue: value };
    } else {
        inputObject = { ...inputObject, value: value || '' };
    }

    // 셀렉트
    if (as === 'select') {
        inputObject = { ...inputObject, as, custom: true };
    }
    // textarea
    else if (as === 'textarea') {
        inputObject = { ...inputObject, as };
    }
    // 라디오
    else if (as === 'radio') {
        Type = Form.Check;
        inputObject = { ...inputObject, type: as };
    }
    // 스위치
    else if (as === 'switch') {
        Type = Form.Check;
        inputObject = { ...inputObject, type: as, label: inputProps.label || '' };
    }
    // 체크박스
    else if (as === 'checkbox') {
        Type = Form.Check;
        inputObject = { ...inputObject, type: as };
    }
    // 드롭가능한 이미지 파일
    else if (as === 'imageFile') {
        Type = MokaImageInput;
        inputObject = { ...inputProps, ref, onChange, value };
    }
    // auto complete
    else if (as === 'autocomplete') {
        Type = MokaAutocomplete;

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
        /* return <MokaAutocomplete ref={ref} name={name} id={id} value={value} onChange={onChange} isInvalid={isInvalid} {...inputProps} />;*/
    }
    // dateTimePicker
    else if (as === 'dateTimePicker') {
        Type = MokaDateTimePicker;
        inputObject = { ...inputObject, placeholder };
    }
    // 기본 input
    else {
        inputObject = { ...inputObject, placeholder, type };
    }

    return <Type {...inputObject}>{children}</Type>;
});

MokaInput.propTypes = propTypes;
MokaInput.defaultProps = defaultProps;

export default MokaInput;
