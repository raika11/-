import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

const propTypes = {
    /**
     * 버튼 텍스트
     */
    text: PropTypes.string,
    /**
     * 이미지 path
     */
    fileUrl: PropTypes.func,
};

const defaultProps = {
    text: '신규 등록',
    fileUrl: null,
};

/**
 * 이미지 업로드 버튼
 */
const ImageUploadButton = (props) => {
    const { text, fileUrl, ...rest } = props;
    const inputRef = useRef(null);

    const handleClickUpload = () => {
        inputRef.current.click();
    };

    const handleChangeInput = (e) => {
        fileUrl(e.target.value);
    };

    return (
        <>
            <Button variant="positive" onClick={handleClickUpload} {...rest}>
                {text}
            </Button>
            <input ref={inputRef} accept="image/*" type="file" style={{ display: 'none' }} onChange={handleChangeInput} />
        </>
    );
};

ImageUploadButton.propTypes = propTypes;
ImageUploadButton.defaultProps = defaultProps;

export default ImageUploadButton;
