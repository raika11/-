import React, { useState, useCallback, useRef } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

import toast from '@utils/toastUtil';
import { ACCEPTED_IMAGE_TYPES } from '@/constants';
import { MokaIcon } from '@components';
import EditThumbCard from './EditThumbCard';

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * 대표 사진 변경 함수
     */
    setRepPhoto: PropTypes.func,
    /**
     * 대표 사진 버튼 click e
     */
    onRepClick: PropTypes.func,
};
const defaultProps = {};

moment.locale('ko');

/**
 * local 이미지파일 input + dropzone
 * react-dropzone 사용
 */
const EditThumbImageInput = (props) => {
    const { className, onRepClick } = props;

    // state
    const [files, setFiles] = useState([]);

    // ref
    const cardRef = useRef(null);
    const wrapRef = useRef(null);

    /**
     * 파일 드롭
     * @param {array} acceptedFiles input의 file객체(array)
     */
    const onDrop = useCallback(
        (acceptedFiles) => {
            wrapRef.current.classList.remove('dropzone-dragover');
            let result = [];

            acceptedFiles.forEach((f, idx) => {
                if (ACCEPTED_IMAGE_TYPES.includes(f.type)) {
                    const id = moment().format('YYYYMMDDsss') + `_${idx}`;
                    result.push({ id: id, File: f, preview: URL.createObjectURL(f), type: 'local' });
                } else {
                    // 이미지 파일이 아닌경우
                    toast.warning('이미지 파일만 등록할 수 있습니다.');
                }
            });

            const arr = files.concat(result);
            setFiles(arr);
        },
        [files],
    );

    const handleDragEnter = () => {
        wrapRef.current.classList.add('dropzone-dragover');
    };

    const handleDragLeave = () => {
        wrapRef.current.classList.remove('dropzone-dragover');
    };

    return (
        <Dropzone noClick noKeyboard onDrop={onDrop} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} preventDropOnDocument>
            {({ getRootProps, getInputProps }) => {
                return (
                    <div {...getRootProps()} className={clsx('w-100 flex-fill overflow-hidden position-relative', className)} ref={wrapRef} style={{ height: 420 }} as="div">
                        {/* default text */}
                        <span className="absolute-top w-100 h-100 d-flex align-items-center justify-content-center pointer-events-none p-3" style={{ whiteSpace: 'pre-wrap' }}>
                            <MokaIcon iconName="fal-cloud-upload" className="mr-2" />
                            Drop files to attach, or browse
                        </span>

                        <div className="d-flex flex-wrap align-content-start custom-scroll p-1 h-100 overflow-y-scroll is-file-dropzone">
                            {/* 이미지 미리보기 */}
                            {files.map((file) => (
                                <EditThumbCard ref={cardRef} key={file.id} img={file.preview} data={file} type={file.type} onRepClick={onRepClick} />
                            ))}

                            <input {...getInputProps()} />

                            {/* drag over mask */}
                            <div className="dropzone-dragover-mask dropzone-border" />
                        </div>
                    </div>
                );
            }}
        </Dropzone>
    );
};

EditThumbImageInput.propTypes = propTypes;
EditThumbImageInput.defaultProps = defaultProps;

export default EditThumbImageInput;
