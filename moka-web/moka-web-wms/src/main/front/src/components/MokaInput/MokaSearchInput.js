import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import MokaInput from './MokaInput';

const propTypes = {
    /**
     * inputGroup의 추가 스타일
     */
    className: PropTypes.string,
    /**
     * 검색버튼에 노출할 텍스트
     */
    searchText: PropTypes.string,
    /**
     * 검색버튼 onClick 이벤트
     */
    onSearch: PropTypes.func,
    /**
     * 검색버튼 variant
     */
    variant: PropTypes.string,
    /**
     * 검색버튼의 추가 스타일
     */
    buttonClassName: PropTypes.string,
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
     * MokaInput의 className
     */
    inputClassName: PropTypes.string,
    /**
     * MokaInput의 name
     */
    name: PropTypes.string,
    /**
     * 그 외 MokaInput의 props
     * 자세한 설명은 MokaInput의 inputProps를 참고한다
     */
    inputProps: PropTypes.shape({
        readOnly: PropTypes.bool,
        plaintext: PropTypes.bool,
    }),
    /**
     * MokaInput의 mask string
     */
    mask: PropTypes.string,
};
const defaultProps = {
    placeholder: '검색어를 입력하세요',
    variant: 'primary',
    searchText: '검색',
};

/**
 * 검색 버튼이 붙어있는 input
 */
const MokaSearchInput = (props) => {
    // group props
    const { className } = props;

    // 검색버튼 props
    const { buttonClassName, searchText, onSearch, variant } = props;

    // input props
    const { placeholder, onChange, value, id, name, mask, inputProps, isInvalid, inputClassName, disabled } = props;

    /**
     * 키 입력
     * @param {object} e 이벤트
     */
    const handleKeyPress = (e) => {
        // 엔터 기본 동작 막음
        if (e.key === 'Enter') {
            e.preventDefault();
            if (onSearch) {
                onSearch();
            }
        }
    };

    return (
        <Form.Group as={Row} className={clsx('mb-0', className)}>
            <MokaInput
                as="input"
                type="text"
                className={clsx('mr-2', 'flex-fill', inputClassName)}
                inputProps={{
                    ...inputProps,
                    onKeyPress: handleKeyPress,
                }}
                id={id}
                name={name}
                isInvalid={isInvalid}
                disabled={disabled}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                mask={mask}
            />
            <Button variant={variant} className={buttonClassName} style={{ minWidth: 53 }} onClick={onSearch}>
                {searchText}
            </Button>
        </Form.Group>
    );
};

MokaSearchInput.propTypes = propTypes;
MokaSearchInput.defaultProps = defaultProps;

export default MokaSearchInput;
