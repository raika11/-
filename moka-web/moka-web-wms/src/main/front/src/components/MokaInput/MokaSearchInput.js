import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
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
            <Form.Control className="mr-2 flex-fill" placeholder={placeholder} value={value} onChange={onChange} onKeyPress={handleKeyPress} {...rest} />
            <Button variant={variant} className={buttonClassName} style={{ minWidth: 53 }} onClick={onSearch}>
                {searchText}
            </Button>
        </Form.Group>
    );
};

MokaSearchInput.propTypes = propTypes;
MokaSearchInput.defaultProps = defaultProps;

export default MokaSearchInput;
