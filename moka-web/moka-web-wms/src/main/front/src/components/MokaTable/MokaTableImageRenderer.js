import React, { useCallback, useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import util from '@utils/commonUtil';

/**
 * ag-grid 셀에 이미지를 그리는 컴포넌트.
 * 이미지 url은 field로 넘어온 값을 data에서 찾아서 사용하며 대체 텍스트는 data.imgAlt를 사용한다.
 *
 * @param {object} params ag grid params
 */
const MokaTableImageRenderer = forwardRef((params, ref) => {
    const { data: initialData, colDef } = params;
    const [field] = useState(colDef.field);
    const [data, setData] = useState(initialData);

    const boxRef = useRef(null);
    const imgRef = useRef(null);

    useImperativeHandle(ref, () => ({
        refresh: (params) => {
            // if (params.data[field] !== data[field]) {
            //     setData(params.data);
            //     return true;
            // } else {
            //     return false;
            // }
            setData(params.data);
            return true;
        },
    }));

    /**
     * 이미지 프리뷰 생성
     */
    const previewImg = useCallback((src) => {
        util.makeImgPreview(src, imgRef.current, boxRef.current, null, () => {
            imgRef.current.src = src;
        });
    }, []);

    useEffect(() => {
        previewImg(data[field]);
    }, [data, field, previewImg]);

    return (
        <div className="d-flex h-100 w-100 align-items-center justify-content-center bg-white border" ref={boxRef}>
            <img ref={imgRef} alt={data.imgAlt} />
        </div>
    );
});

export default MokaTableImageRenderer;
