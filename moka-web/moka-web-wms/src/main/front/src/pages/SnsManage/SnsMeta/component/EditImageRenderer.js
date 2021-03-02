import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import img_logo from '@assets/images/img_logo.png';
import { MokaIcon, NewIcon } from '@components';

/**
 * ag-grid 셀에 이미지를 그리는 컴포넌트.
 * 이미지 url은 field로 넘어온 값을 data에서 찾아서 사용하며 대체 텍스트는 data.imgAlt를 사용한다.
 *
 * @param {object} params ag grid params
 */
const EditImageRenderer = forwardRef((params, ref) => {
    const { colDef } = params;
    const [field] = useState(colDef.field);
    const [data, setData] = useState(params.node.data);
    const boxRef = useRef(null);
    const imgRef = useRef(null);
    const src = data?.[field] || img_logo;
    const isEdit = src.indexOf('FbMetaImage') >= 0;

    const onError = (e) => {
        e.target.src = img_logo;
        boxRef.current.classList.add('onerror-image-wrap');
        e.target.classList.add('onerror-image');
    };

    const onLoad = (e) => {
        if (e.target.src.replace(window.location.origin, '') !== img_logo) {
            boxRef.current.classList.remove('onerror-image-wrap');
            e.target.classList.remove('onerror-image');
        } else if (e.target.src === img_logo) {
            boxRef.current.classList.add('onerror-image-wrap');
            e.target.classList.add('onerror-image');
        }
    };

    useImperativeHandle(ref, () => ({
        refresh: (params) => {
            setData(params.node.data);
            return true;
        },
    }));

    return (
        <div className="d-flex h-100 w-100 align-items-center justify-content-center bg-white border overflow-hidden position-relative" ref={boxRef}>
            <img src={src} className="center-image" ref={imgRef} alt={data?.imgAlt || ''} onError={onError} onLoad={onLoad} loading="lazy" />
            {isEdit && (
                <span className="absolute-top m-1">
                    <NewIcon width={10} height={10} />
                </span>
            )}
        </div>
    );
});

export default EditImageRenderer;
