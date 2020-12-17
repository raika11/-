import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import Dropzone from 'react-dropzone';

const propTypes = {};
const defaultProps = {};

/**
 * 이미지파일input + preview + dropzone
 * react-dropzone 사용
 */
const EditThumbImageInput = (props, ref) => {
    const [files, setFiles] = useState([]);

    const handleDrop = useCallback((accepted) => setFiles([...files, ...accepted]));

    const withPreviews = (dropHandler) => (accepted, rejected) => {
        const acceptedWithPreview = accepted.map((file) => ({
            ...file,
            preview: URL.createObjectURL(file),
        }));

        dropHandler(acceptedWithPreview, rejected);
    };

    const clearPreviews = (files) => files.forEach((file) => URL.revokeObjectURL(file.preview));

    useEffect(() => () => clearPreviews(files), [files]);

    return (
        <>
            <Dropzone onDrop={withPreviews(handleDrop)} style={{}}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} style={{ width: '300px', height: '300px', border: '2px solid #2c67d8', padding: '30px' }} className="is-file-dropzone">
                        <input {...getInputProps()} />
                        Drop files here
                    </div>
                )}
            </Dropzone>
            {files.map((file) => (
                <img key={file.name} src={file.preview} style={{ maxWidth: 200, display: 'block' }} alt="" />
            ))}
        </>
    );
};

EditThumbImageInput.propTypes = propTypes;
EditThumbImageInput.defaultProps = defaultProps;

export default EditThumbImageInput;
