import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { API_BASE_URL } from '@/constants';
import { previewAreaModal, PREVIEW_AREA_MODAL } from '@store/merge';
import toast from '@utils/toastUtil';
import { MokaLoader } from '@components';

/**
 * 컴포넌트워크 미리보기
 */
const ComponentWorkPreview = ({ show }) => {
    const dispatch = useDispatch();
    const [previewContent, setPreviewContent] = useState(null);

    const { area, loading, componentList } = useSelector((store) => ({
        area: store.desking.area,
        loading: store.loading[PREVIEW_AREA_MODAL],
        componentList: store.desking.list,
    }));

    const iframeRef = useRef(null);

    const handleClickPreview = () => {
        if (area.areaSeq) {
            window.open(`${API_BASE_URL}/preview/desking/area?areaSeq=${area.areaSeq}`, '미리보기');
        }
    };

    useEffect(() => {
        if (!area.areaSeq) {
            setPreviewContent(null);
            return;
        }
        if (!show) return;

        dispatch(
            previewAreaModal({
                areaSeq: area.areaSeq,
                callback: ({ header, body }) => {
                    if (header.success) {
                        setPreviewContent(body);
                    } else {
                        setPreviewContent(null);
                        toast.fail(header.message);
                    }
                },
            }),
        );
    }, [area.areaSeq, componentList, show, dispatch]);

    useEffect(() => {
        if (!iframeRef.current) return;
        const doc = iframeRef.current.contentDocument;
        doc.open();
        doc.write(previewContent || '');

        // if (previewContent) {
        //     let style = document.createElement('style');
        //     style.textContent = 'body { margin: 0px; }';
        //     setTimeout(function () {
        //         doc.head && doc.head.appendChild(style);
        //     }, 300);
        // }
        doc.close();
    }, [previewContent]);

    return (
        <div className="px-card py-20 position-relative">
            {loading && <MokaLoader />}
            <div className="d-flex align-items-center justify-content-between mb-2" style={{ height: 30 }}>
                <p className="h5 mb-0">미리보기</p>
                <Button variant="outline-neutral ft-12" onClick={handleClickPreview} disabled={!area.page}>
                    전체화면으로 보기
                </Button>
            </div>

            <iframe ref={iframeRef} title="컴포넌트미리보기" frameBorder="0" className="w-100" style={{ height: 733 }} />
        </div>
    );
};

export default ComponentWorkPreview;
