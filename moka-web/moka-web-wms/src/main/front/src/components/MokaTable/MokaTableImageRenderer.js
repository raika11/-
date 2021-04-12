import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import clsx from 'clsx';
import img_logo from '@assets/images/img_logo.png';

const defaultProps = {
    roundedCircle: false,
    autoRatio: true,
};

/**
 * ag-grid 셀에 이미지를 그리는 컴포넌트.
 * 이미지 url은 field로 넘어온 값을 data에서 찾아서 사용하며 대체 텍스트는 data.imgAlt를 사용한다.
 *
 * @param {object} params ag grid params
 */
const MokaTableImageRenderer = forwardRef((params, ref) => {
    const { colDef, roundedCircle, autoRatio } = params;
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
        } else {
            imgRef.current.src = data?.[field];
        }
    }, [data, field]);

    useEffect(() => {
        if (boxRef.current) {
            const w = boxRef.current.parentElement.offsetWidth;
            let h = boxRef.current.parentElement.offsetHeight;
            if (autoRatio) {
                // 16:9 자동 셋팅
                h = Math.floor(((w || 0) / 16) * 9);
            } else if (roundedCircle) {
                // 동그라미인 경우 정사각형으로 셋팅
                if (h > w) h = w;
                else if (w > h) boxRef.current.style.setProperty('width', `${h}px`, 'important');
            }
            boxRef.current.style.setProperty('height', `${h}px`, `important`);
        }
    }, [params, colDef, autoRatio, roundedCircle]);

    return (
        <div className="d-flex h-100 w-100 align-items-center justify-content-center">
            <div
                className={clsx('w-100 overflow-hidden position-relative', {
                    'bg-white': !roundedCircle,
                    border: !roundedCircle,
                    'rounded-circle': roundedCircle,
                })}
                ref={boxRef}
            >
                <img className="center-image" ref={imgRef} alt={data?.imgAlt || ''} onError={onError} onLoad={onLoad} loading="lazy" />
            </div>
        </div>
    );
});

MokaTableImageRenderer.defaultProps = defaultProps;

export default MokaTableImageRenderer;
