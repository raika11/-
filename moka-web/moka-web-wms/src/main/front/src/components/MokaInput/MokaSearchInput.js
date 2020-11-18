import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import MokaInput, { propTypes as inputPropTypes } from './MokaInput';

const propTypes = {
    ...inputPropTypes,
    /**
     * MokaInput의 className
     */
    inputClassName: PropTypes.string,
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
     * 검색버튼의 추가 스타일
     */
    buttonClassName: PropTypes.string,
};
const defaultProps = {
    placeholder: '검색어를 입력하세요',
    searchText: '검색',
};

/**
 * 검색 버튼이 붙어있는 input
 */
const MokaSearchInput = (props) => {
    // group props
    const { className } = props;

    // 검색버튼 props
    const { buttonClassName, searchText, onSearch } = props;

    // input props
    const { placeholder, onChange, value, id, name, inputProps, isInvalid, inputClassName, disabled } = props;

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
            />
            <Button variant="searching" className={buttonClassName} style={{ minWidth: 53 }} onClick={onSearch} disabled={disabled}>
                {searchText}
            </Button>
        </Form.Group>
    );
};

MokaSearchInput.propTypes = propTypes;
MokaSearchInput.defaultProps = defaultProps;

export default MokaSearchInput;
