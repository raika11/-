import React, { useRef } from 'react';
import Button from 'react-bootstrap/Button';

const ImageUploadButton = (props) => {
    const { fileUrl, ...rest } = props;
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
                신규 등록
            </Button>
            <input ref={inputRef} accept="image/*" type="file" style={{ display: 'none' }} onChange={handleChangeInput} />
        </>
    );
};

export default ImageUploadButton;
