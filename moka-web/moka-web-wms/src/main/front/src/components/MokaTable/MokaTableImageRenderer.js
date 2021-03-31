import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import clsx from 'clsx';
import img_logo from '@assets/images/img_logo.png';

const defaultProps = {
    roundedCircle: false,
};

/**
 * ag-grid 셀에 이미지를 그리는 컴포넌트.
 * 이미지 url은 field로 넘어온 값을 data에서 찾아서 사용하며 대체 텍스트는 data.imgAlt를 사용한다.
 *
 * @param {object} params ag grid params
 */
const MokaTableImageRenderer = forwardRef((params, ref) => {
    const { colDef, roundedCircle } = params;
    const [field] = useState(colDef.field);
    const [data, setData] = useState(params.node.data);
    const boxRef = useRef(null);
    const imgRef = useRef(null);

    /**
     * 이미지 로드 실패
     * @param {object} e 이벤트
     */
    const onError = (e) => {
        e.target.src = img_logo;
        boxRef.current.classList.add('onerror-image-wrap');
        e.target.classList.add('onerror-image');
    };

    /**
     * 이미지 로드 후 실행
     * @param {object} e 이벤트
     */
    const onLoad = (e) => {
        if (e.target.src.replace(window.location.origin, '') !== img_logo) {
            boxRef.current.classList.remove('onerror-image-wrap');
            e.target.classList.remove('onerror-image');
        }
    };

    useImperativeHandle(ref, () => ({
        refresh: (params) => {
            setData(params.node.data);
            return true;
        },
    }));

    useEffect(() => {
        if (!data?.[field] && boxRef.current && imgRef.current) {
            boxRef.current.classList.add('onerror-image-wrap');
            imgRef.current.src = img_logo;
            imgRef.current.classList.add('onerror-image');
        }
    }, [data, field]);

    return (
        <div
            className={clsx('d-flex h-100 w-100 align-items-center justify-content-center overflow-hidden position-relative', {
                'bg-white': !roundedCircle,
                border: !roundedCircle,
                'rounded-circle': roundedCircle,
            })}
            ref={boxRef}
        >
            <img
                src={data?.[field]}
                // className={clsx('center-image', { 'rounded-circle': roundedCircle })}
                className="center-image"
                ref={imgRef}
                alt={data?.imgAlt || ''}
                onError={onError}
                onLoad={onLoad}
                loading="lazy"
            />
        </div>
    );
});

MokaTableImageRenderer.defaultProps = defaultProps;

export default MokaTableImageRenderer;
