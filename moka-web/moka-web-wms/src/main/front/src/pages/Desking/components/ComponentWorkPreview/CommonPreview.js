import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { previewAreaModal, PREVIEW_AREA_MODAL } from '@store/merge';
import toast from '@utils/toastUtil';
import { MokaLoader, MokaResizableBox } from '@components';
import { BREAKPOINT_SERVICE } from '@/constants';

/**
 * 컴포넌트워크 미리보기
 */
const ComponentWorkPreview = ({ show, breakpoint, isNaverChannel }) => {
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[PREVIEW_AREA_MODAL]);
    const area = useSelector(({ desking }) => desking.area);
    const [minConstraints, setMinConstraints] = useState([0, 0]);
    const [maxConstraints, setMaxConstraints] = useState([0, 0]);
    const noticeRef = useRef(null);
    const iframeRef = useRef(null);
    const flexableRef = useRef(null);

    /**
     * preview
     */
    const setPreview = useCallback((previewContent) => {
        if (iframeRef.current) {
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
        }
    }, []);

    useEffect(() => {
        if (show && iframeRef.current && noticeRef.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    if (entry.contentBoxSize) {
                        let w = Math.ceil(entry.contentRect.width);
                        const h = Math.ceil(entry.contentRect.height);
                        if (noticeRef.current) noticeRef.current.innerText = `${w}*${h}`;
                    }
                }
            });
            resizeObserver.observe(iframeRef.current);
        }
    }, [show]);

    useEffect(() => {
        if (show && flexableRef.current) {
            /**
             * 감싸고 있는 div가 변경되면 높이값 변경
             */
            const resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    if (entry.contentBoxSize) {
                        let w = 0;
                        const h = entry.contentRect.height;

                        if (isNaverChannel) {
                            w = [530, 530];
                        } else {
                            w = BREAKPOINT_SERVICE[breakpoint];
                        }

                        if (flexableRef.current) {
                            setMinConstraints([w[0], h]);
                            setMaxConstraints([w[1], h]);
                        }
                    }
                }
            });
            resizeObserver.observe(flexableRef.current);
        }
    }, [isNaverChannel, breakpoint, show]);

    useEffect(() => {
        if (show && area.areaSeq) {
            dispatch(
                previewAreaModal({
                    areaSeq: area.areaSeq,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            setPreview(body);
                        } else {
                            setPreview(null);
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        } else {
            setPreview(null);
        }
    }, [area.areaSeq, dispatch, setPreview, show]);

    useEffect(() => {
        return () => {
            setMinConstraints([0, 0]);
            setMaxConstraints([0, 0]);
        };
    }, []);

    return (
        <div className="position-relative h-100">
            {loading && <MokaLoader />}
            <div className="absolute-top-right border bg-white px-2 color-searching" style={{ top: '-21px', zIndex: 1 }} ref={noticeRef}></div>

            <div className="overflow-hidden d-flex h-100">
                <div className="flex-fill overflow-x-auto" ref={flexableRef}>
                    <MokaResizableBox
                        width={minConstraints[0]}
                        height={minConstraints[1]}
                        minConstraints={minConstraints}
                        maxConstraints={maxConstraints}
                        axis="x"
                        handleSize={[40, 40]}
                    >
                        <iframe ref={iframeRef} title="컴포넌트미리보기" frameBorder="0" className="h-100 w-100" />
                    </MokaResizableBox>
                </div>

                {isNaverChannel && (
                    <div className="flex-shrink-0 pt-card pl-gutter user-select-text" style={{ width: 460 }}>
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
        </div>
    );
};

export default ComponentWorkPreview;
