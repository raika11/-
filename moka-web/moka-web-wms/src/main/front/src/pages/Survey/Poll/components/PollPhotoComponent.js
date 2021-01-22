import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Figure } from 'react-bootstrap';
import { MokaIcon } from '@components';
import commonUtil from '@utils/commonUtil';
import PropTypes from 'prop-types';

const propTypes = {
    children: PropTypes.string,
};

const defaultProps = {
    width: '150px',
    height: '150px',
    children: '',
};

const PollPhotoComponent = ({ src, width, height, onChange, children }) => {
    const [file, setFile] = useState({});
    const { getRootProps, getInputProps } = useDropzone({
        accept: ['image/jpeg', 'image/png'],
        onDrop: (acceptedFiles) => {
            acceptedFiles[0] && setFile(Object.assign(acceptedFiles[0], { preview: URL.createObjectURL(acceptedFiles[0]) }));
            onChange instanceof Function && onChange(acceptedFiles[0]);
        },
    });

    useEffect(() => {
        //if (!commonUtil.isEmpty(src)) {
        setFile({ ...file, preview: src });
        //}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    return (
        <Figure
            {...getRootProps({
                className: 'd-inline-flex align-items-center justify-content-center is-file-dropzone cursor-pointer position-relative bg-white overflow-hidden m-2',
            })}
            as="div"
            style={{ width, height }}
        >
            <Figure.Image className="center-image" src={file.preview} />
            <input
                {...getInputProps({
                    onClick: () => {
                        setFile({});
                        onChange instanceof Function && onChange(null);
                    },
                })}
            />
            {commonUtil.isEmpty(file.preview) && (
                <span className="absolute-top w-100 h-100 d-flex align-items-center justify-content-center pointer-events-none p-3" style={{ whiteSpace: 'pre-wrap' }}>
                    <>
                        <MokaIcon iconName="fal-cloud-upload" className="mr-2" />
                        {children}
                    </>
                </span>
            )}
            <div className="dropzone-dragover-mask input-border" />
        </Figure>
    );
};

PollPhotoComponent.propTypes = propTypes;
PollPhotoComponent.defaultProps = defaultProps;
export default PollPhotoComponent;
