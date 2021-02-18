import React, { forwardRef, useRef, useImperativeHandle, useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import Form from 'react-bootstrap/Form';
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
     * input value가 타당하지 않을 경우 danger 테두리 생성
     */
    isInvalid: PropTypes.bool,
    /**
     * invalid일 때 hover로 노출하는 message
     */
    invalidMessage: PropTypes.string,
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
    const {
        className,
        as,
        type,
        placeholder,
        onChange,
        value,
        id,
        name,
        children,
        inputProps,
        isInvalid,
        invalidMessage,
        disabled,
        uncontrolled,
        size,
        closeOnSelect,
        ...rest
    } = props;
    const inputRef = useRef(null);
    const [invalidShow, setInvalidShow] = React.useState(false);
    useImperativeHandle(ref, () => inputRef?.current);

    /**
     * onMouseEnter event
     */
    const onMouseEnter = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (inputProps.onMouseEnter) {
                inputProps.onMouseEnter();
            }
            if (isInvalid) {
                setInvalidShow(true);
            }
        },
        [inputProps, isInvalid],
    );

    /**
     * onMouseLeave event
     */
    const onMouseLeave = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (inputProps.onMouseLeave) {
                inputProps.onMouseLeave();
            }
            if (isInvalid) {
                setInvalidShow(false);
            }
        },
        [inputProps, isInvalid],
    );

    let Type = Form.Control;
    let contextProps = {
        id,
        name,
        className: clsx('flex-fill', className),
        isInvalid,
        disabled,
        onChange,
        placeholder,
        size,
        ...inputProps,
        onMouseEnter,
        onMouseLeave,
        ...rest,
    };

    if (uncontrolled) {
        contextProps = { ...contextProps, defaultValue: value };
    } else {
        contextProps = { ...contextProps, value: value || '' };
    }

    // 셀렉트
    if (as === 'select') {
        contextProps = { ...contextProps, as, custom: true };
    }
    // textarea
    else if (as === 'textarea') {
        contextProps = { ...contextProps, as };
    }
    // 라디오
    else if (as === 'radio') {
        Type = Form.Check;
        contextProps = { ...contextProps, type: as };
    }
    // 스위치
    else if (as === 'switch') {
        Type = Form.Check;
        contextProps = { ...contextProps, type: as, label: inputProps.label || '' };
    }
    // 체크박스
    else if (as === 'checkbox') {
        Type = Form.Check;
        contextProps = { ...contextProps, type: as };
    }
    // imageFile(드롭가능한 이미지 파일)
    else if (as === 'imageFile') {
        Type = MokaImageInput;
        contextProps = { ...contextProps, className };
    }
    // autocomplete
    else if (as === 'autocomplete') {
        Type = MokaAutocomplete;
    }
    // dateTimePicker
    else if (as === 'dateTimePicker') {
        Type = MokaDateTimePicker;
        contextProps = { ...contextProps, placeholder, closeOnSelect };
    }
    // 기본 input
    else {
        contextProps = { ...contextProps, placeholder, type };
    }

    return (
        <React.Fragment>
            <Type ref={inputRef} {...contextProps}>
                {children}
            </Type>
            {isInvalid && invalidMessage && invalidMessage !== '' && (
                <Overlay target={as === 'imageFile' ? inputRef.current?.wrapRef : as === 'dateTimePicker' ? inputRef.current?.inputGroupRef : inputRef.current} show={invalidShow}>
                    <Tooltip id={`input-invalid-${name}`}>{invalidMessage}</Tooltip>
                </Overlay>
            )}
        </React.Fragment>
    );
});

MokaInput.propTypes = propTypes;
MokaInput.defaultProps = defaultProps;

export default MokaInput;
