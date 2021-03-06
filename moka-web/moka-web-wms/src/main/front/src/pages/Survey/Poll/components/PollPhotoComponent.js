import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Figure } from 'react-bootstrap';
import { MokaIcon } from '@components';
import commonUtil from '@utils/commonUtil';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import defaultImage from '@assets/images/img_logo@3x.png';
import clsx from 'clsx';

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
    const [isError, setIsError] = useState(false);
    const { getRootProps, getInputProps, open } = useDropzone({
        accept: ['image/jpeg', 'image/png', 'image/gif'],
        onDrop: (acceptedFiles) => {
            acceptedFiles[0] && setFile(Object.assign(acceptedFiles[0], { preview: URL.createObjectURL(acceptedFiles[0]) }));
            onChange instanceof Function && onChange(acceptedFiles[0]);
        },
    });

    const handleErrorImage = (e) => {
        setIsError(true);
        setFile({ ...file, preview: defaultImage });
    };

    useEffect(() => {
        //if (!commonUtil.isEmpty(src)) {
        setIsError(false);
        setFile({ ...file, preview: src });
        //}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    return (
        <div>
            <Figure
                {...getRootProps({
                    className: clsx(
                        'd-inline-flex align-items-center justify-content-center is-file-dropzone cursor-pointer position-relative bg-white overflow-hidden',
                        isError && 'onerror-image-wrap',
                    ),
                    onClick: (e) => {
                        if (!commonUtil.isEmpty(file.preview)) {
                            e.stopPropagation();
                        }
                    },
                })}
                as="div"
                style={{ width, height }}
            >
                <Figure.Image className={clsx('center-image', isError && 'onerror-image')} src={file.preview} onError={handleErrorImage} />
                {!commonUtil.isEmpty(file.preview) && !isError && (
                    <Button
                        variant="searching"
                        className="border-0 p-0 moka-table-button"
                        style={{ position: 'absolute', top: '5px', right: '5px', opacity: '0.8' }}
                        onClick={() => {
                            setFile({});
                            onChange instanceof Function && onChange(null);
                        }}
                    >
                        <MokaIcon iconName="fas-times" />
                    </Button>
                )}
                <input {...getInputProps()} />
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
            <div className="mb-2" onClick={open}>
                <Button variant="gray-700" size="sm">
                    ????????????
                </Button>
            </div>
        </div>
    );
};

PollPhotoComponent.propTypes = propTypes;
PollPhotoComponent.defaultProps = defaultProps;
export default PollPhotoComponent;
