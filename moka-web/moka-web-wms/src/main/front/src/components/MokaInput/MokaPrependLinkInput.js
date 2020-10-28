import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import MokaInput from './MokaInput';

const propTypes = {
    /**
     * 링크 URL
     */
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    /**
     * 링크 타겟
     */
    target: PropTypes.oneOf(['_blank', '_self', '_parent', '_top']),
    /**
     * 링크 텍스트
     */
    linkText: PropTypes.string,
    /**
     * InputGroup의 isInvalid
     */
    isInvalid: PropTypes.bool,
    /**
     * InputGroup 컴포넌트의 추가적인 클래스명
     */
    className: PropTypes.string,
    /**
     * MokaInput 렌더링
     * 배열일 경우 배열의 수만큼 렌더링한다
     * object props는 MokaInput의 props를 참고한다
     */
    inputList: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    /**
     * 아이콘 여부 (있을 경우 append에 추가됨)
     */
    icon: PropTypes.node,
    /**
     * 아이콘 클릭 이벤트
     */
    onIconClick: PropTypes.func,
};
const defaultProps = {
    target: '_blank',
    inputList: {},
    isInvalid: false,
    icon: null,
    onIconClick: null,
};

/**
 * Prepend 링크를 포함한 input
 */
const MokaPrependLinkInput = forwardRef((props, ref) => {
    const { to, linkText, className, inputList, target, icon, onIconClick, isInvalid } = props;

    /**
     * prepend의 link 생성
     */
    const createPrependLink = () => {
        if (to) {
            return (
                <Link to={to} target={target} className="w-100">
                    <InputGroup.Text className="prepend-link-text">{linkText}</InputGroup.Text>
                </Link>
            );
        }
        return <InputGroup.Text className="w-100 prepend-link-text">{linkText}</InputGroup.Text>;
    };

    /**
     * input 생성
     * @param {object} props props
     * @param {any} idx index
     */
    const createInput = (props, idx) => {
        const { id, name, as, type, placeholder, value, onChange, isInvalid, disabled, className, style, mask, ...rest } = props;

        return (
            <MokaInput
                key={idx}
                ref={ref}
                as={as}
                style={style}
                className={className}
                inputProps={rest}
                id={id}
                name={name}
                value={value || undefined}
                onChange={onChange || undefined}
                isInvalid={isInvalid}
                disabled={disabled}
                type={type}
                placeholder={placeholder}
                mask={mask}
            />
        );
    };

    return (
        <InputGroup className={clsx(className, { 'is-invalid': isInvalid })}>
            <InputGroup.Prepend style={{ width: 70 }}>{createPrependLink()}</InputGroup.Prepend>
            {Array.isArray(inputList) ? inputList.map((obj, idx) => createInput(obj, idx)) : createInput(inputList)}
            {icon && (
                <InputGroup.Append>
                    <Button variant="dark" onClick={onIconClick}>
                        {icon}
                    </Button>
                </InputGroup.Append>
            )}
        </InputGroup>
    );
});

MokaPrependLinkInput.propTypes = propTypes;
MokaPrependLinkInput.defaultProps = defaultProps;

export default MokaPrependLinkInput;
