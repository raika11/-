import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { API_BASE_URL } from '@/constants';
import { previewAreaModal, PREVIEW_AREA_MODAL } from '@store/merge';
import toast from '@utils/toastUtil';
import { MokaLoader } from '@components';

/**
 * 컴포넌트워크 미리보기
 */
const ComponentWorkPreview = ({ show, componentList, isNaverChannel }) => {
    const dispatch = useDispatch();
    const [previewContent, setPreviewContent] = useState(null);
    const loading = useSelector(({ loading }) => loading[PREVIEW_AREA_MODAL]);
    const area = useSelector(({ desking }) => desking.area);
    const iframeRef = useRef(null);

    /**
     * 전체화면 미리보기
     */
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
        let doc = iframeRef.current.contentDocument;
        if (!doc) {
            iframeRef.current.src = 'about:blank';
            iframeRef.current.onload = function () {
                doc = iframeRef.current.contentDocument;
                doc.open();
                doc.write(previewContent || '');
                doc.close();
                iframeRef.current.onload = null;
            };
        } else {
            doc.open();
            doc.write(previewContent || '');
            doc.close();
        }

        // if (previewContent) {
        //     let style = document.createElement('style');
        //     style.textContent = 'body { margin: 0px; }';
        //     setTimeout(function () {
        //         doc.head && doc.head.appendChild(style);
        //     }, 300);
        // }
    }, [previewContent]);

    return (
        <div className="px-card py-20 position-relative overflow-hidden">
            {loading && <MokaLoader />}
            <div className="d-flex align-items-center justify-content-between mb-2" style={{ height: 30 }}>
                <h2 className="mb-0">미리보기</h2>
                <Button variant="outline-neutral" onClick={handleClickPreview} disabled={!area.page}>
                    전체화면으로 보기
                </Button>
            </div>

            {/* iframe 클릭 막기 */}
            {/* <div className="absolute-top" style={{ bottom: 0, top: 58, right: 41 }} /> */}

            <iframe
                ref={iframeRef}
                title="컴포넌트미리보기"
                frameBorder="0"
                className={clsx('float-left', { 'w-100': !isNaverChannel })}
                style={{ height: 733, width: isNaverChannel ? 530 : undefined }}
            />

            {isNaverChannel && (
                <div className="float-left pt-card pl-gutter" style={{ width: 'calc(100% - 530px)' }}>
                    <h2 className="color-positive">네이버 채널</h2>
                    <h4 className="color-positive">연예/스포츠 기사 편집시 오류!</h4>
                    <p className="mb-2 color-gray-900">top-single: 상단 이미지 기사 1꼭지 (이미지 없는 기사 편집 시 텍스트로 노출)</p>
                    <p className="mb-2 color-gray-900">bottom-double: 하단 이미지 기사 2꼭지 (이미지 없는 기사 편집 시 오류!)</p>
                    <p className="mb-2 color-gray-900">반드시 기사 SE버튼을 통해서 선택하여 입력 (벌크전송 기사만 편집하기 위함)</p>
                    <p className="mb-2 color-gray-900">오류 발생 시 통째로 반영되지 않으며 오류 내용은</p>
                    <p className="mb-2 color-gray-900">jj.digital@joongang.co.kr 메일로 피드백</p>
                </div>
            )}
        </div>
    );
};

export default ComponentWorkPreview;
