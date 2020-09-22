import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

const propTypes = {
    /**
     * 링크 URL
     */
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    /**
     * 링크 타겟
     */
    target: PropTypes.oneOf(['_blank', '_self', '_parent', '_top']),
    /**
     * 링크 텍스트
     */
    linkText: PropTypes.string,
    /**
     * InputGroup 컴포넌트의 추가적인 클래스명
     */
    className: PropTypes.string,
    /**
     * inputProps (배열 | 오브젝트)
     * 배열일 경우 배열의 수만큼 input 생성
     */
    inputProps: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)])
};
const defaultProps = {
    target: '_blank',
    inputProps: {}
};

const MokaPrependLinkInput = (props) => {
    const { to, linkText, className, inputProps, target } = props;

    return (
        <InputGroup className={className}>
            <InputGroup.Prepend>
                <Link to={to} target={target}>
                    <InputGroup.Text>{linkText}</InputGroup.Text>
                </Link>
            </InputGroup.Prepend>
            {Array.isArray(inputProps) ? (
                inputProps.map((obj, idx) => <Form.Control key={idx} {...obj} />)
            ) : (
                <Form.Control {...inputProps} />
            )}
        </InputGroup>
    );
};

MokaPrependLinkInput.propTypes = propTypes;
MokaPrependLinkInput.defaultProps = defaultProps;

export default MokaPrependLinkInput;
