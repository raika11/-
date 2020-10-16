import React from 'react';
import PropTypes from 'prop-types';

import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const propTypes = {
    /**
     * input의 placeholder
     */
    placeholder: PropTypes.string,
    /**
     * input value
     */
    value: PropTypes.string,
    /**
     * input onChange 이벤트
     */
    onChange: PropTypes.func,
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
    const { placeholder, value, onChange, className, searchText, onSearch, variant, buttonClassName, ...rest } = props;

    return (
        <InputGroup className={className}>
            <Form.Control placeholder={placeholder} value={value} onChange={onChange} {...rest} />
            <InputGroup.Append>
                <Button variant={variant} className={buttonClassName} onClick={onSearch}>
                    {searchText}
                </Button>
            </InputGroup.Append>
        </InputGroup>
    );
};

MokaSearchInput.propTypes = propTypes;
MokaSearchInput.defaultProps = defaultProps;

export default MokaSearchInput;
