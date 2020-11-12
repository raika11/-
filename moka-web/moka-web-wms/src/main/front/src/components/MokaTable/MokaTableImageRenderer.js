import React, { useCallback, useRef, useEffect } from 'react';

/**
 * ag-grid 셀에 이미지를 그리는 컴포넌트.
 * 이미지 url은 field로 넘어온 값을 data에서 찾아서 사용하며
 * 대체 텍스트는 data.imgAlt를 사용한다.
 * @param {object} params ag grid params
 */
const MokaTableImageRenderer = (params) => {
    const { data } = params;
    const field = params.colDef.field;
    const { imgAlt } = data;

    const boxRef = useRef(null);
    const imgRef = useRef(null);

    /**
     * 이미지 프리뷰 생성
     */
    const previewImg = useCallback((src) => {
        let image = new Image();
        image.src = src;
        image.onload = (imgProps) => {
            let w = imgProps.path[0].width;
            let h = imgProps.path[0].height;
            let rate = 1;

            if (boxRef.current) {
                const box = boxRef.current;
                rate = box.offsetWidth / box.offsetHeight;
            }

            if (w / h > rate) {
                imgRef.current.className = 'landscape';
            } else {
                imgRef.current.className = 'portrait';
            }
            imgRef.current.src = src;
        };
    }, []);

    useEffect(() => {
        previewImg(data[field]);
    }, [data, field, previewImg]);

    return (
        <div className="d-flex h-100 w-100 align-items-center justify-content-center border" ref={boxRef}>
            <img ref={imgRef} alt={imgAlt} />
        </div>
    );
};

export default MokaTableImageRenderer;
