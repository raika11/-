import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import commonUtil from '@utils/commonUtil';
import imageEditer from '@utils/imageEditorUtil';
import { messageBox } from '@utils/toastUtil';
import { VodModal, EditThumbModal } from '@pages/Desking/modals';
import { MokaIcon, MokaImage, MokaInput, MokaInputLabel } from '@components';

const labelWidth = 50;
const cropHeight = 300;
const cropWidth = 300;

/**
 * 기사 렌더러
 */
const ArticleRenderer = forwardRef((params, ref) => {
    const [show, setShow] = useState(false);
    const [vodShow, setVodShow] = useState(false);
    const [article, setArticle] = useState(params.node.data);

    /**
     * 관련기사 삭제
     */
    const handleDeleteArticle = () => {
        params.api.applyTransaction({ remove: [{ ...params.node.data }] });
    };

    /**
     * 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        setArticle({
            ...article,
            artThumb: imageSrc,
            artThumbFile: file,
        });
        params.api.applyTransaction({ update: [{ ...article, artThumb: imageSrc, artThumbFile: file }] });
    };

    /**
     * 이미지 편집
     */
    const handleEditClick = () => {
        if (article.artThumb) {
            imageEditer.create(
                article.artThumb,
                (editImageSrc) => {
                    (async () => {
                        await fetch(editImageSrc)
                            .then((r) => r.blob())
                            .then((blobFile) => {
                                const file = commonUtil.blobToFile(blobFile, commonUtil.getUniqueKey);
                                setArticle({
                                    ...article,
                                    artThumb: editImageSrc,
                                    artThumbFile: file,
                                });
                                params.api.applyTransaction({ update: [{ ...article, artThumb: editImageSrc, artThumbFile: file }] });
                            });
                    })();
                },
                { cropWidth: 300, cropHeight: 300 },
            );
        } else {
            messageBox.alert('편집할 이미지가 없습니다');
        }
    };

    useImperativeHandle(
        ref,
        () => ({
            refresh: (params) => {
                setArticle(params.node.data || {});
                return true;
            },
        }),
        [],
    );

    return (
        <div className="w-100 h-100 d-flex align-items-center">
            <div className="flex-fill d-flex">
                <div className="flex-shrink-0 d-flex flex-column mr-3">
                    <MokaImage width={115} img={article.artThumb} ratio={[6, 4]} />
                    <div className="d-flex justify-content-between mt-1">
                        <Button size="sm" variant="gray-700" className="mr-1" onClick={() => setShow(true)}>
                            신규 등록
                        </Button>
                        <EditThumbModal
                            show={show}
                            cropHeight={cropHeight}
                            cropWidth={cropWidth}
                            onHide={() => setShow(false)}
                            totalId={article.totalId}
                            thumbFileName={article.artThumb}
                            apply={handleThumbFileApply}
                        />
                        <Button size="sm" variant="outline-gray-700" onClick={handleEditClick}>
                            편집
                        </Button>
                    </div>
                </div>
                <div className="d-flex flex-fill flex-column">
                    <MokaInputLabel label="제목" labelWidth={labelWidth} value={article.artTitle} disabled className="mb-2" />
                    <div className="d-flex mb-2">
                        <MokaInputLabel label="URL" labelWidth={labelWidth} value={article.artTitle} disabled className="flex-fill mr-2" />
                        <div className="flex-shrink-0 d-flex">
                            <MokaInput as="select" disabled>
                                <option value="_self">본창</option>
                                <option value="_blank">새창</option>
                            </MokaInput>
                        </div>
                    </div>
                    <MokaInputLabel label="리드문" labelWidth={labelWidth} as="textarea" value={article.artTitle} disabled className="mb-2" inputProps={{ rows: 3 }} />
                    <div className="d-flex">
                        <MokaInputLabel label="영상 URL" labelWidth={labelWidth} value={article.artTitle} disabled className="flex-fill mr-2" />
                        <Button variant="searching" className="flex-shrink-0" onClick={() => setVodShow(true)}>
                            영상검색
                        </Button>
                        <VodModal show={vodShow} onHide={() => setVodShow(false)} />
                    </div>
                </div>
            </div>
            <div className="pl-2 pr-1 flex-shrink-0 d-flex align-items-center">
                <Button variant="white" className="border-0 p-0 bg-transparent" onClick={handleDeleteArticle}>
                    <MokaIcon iconName="fas-minus-circle" />
                </Button>
            </div>
        </div>
    );
});

/**
 * 라이브기사 렌더러
 */
const LiveRenderer = forwardRef((params, ref) => {
    const [article, setArticle] = useState(params.node.data);

    /**
     * 관련기사 삭제
     */
    const handleDeleteArticle = () => {
        params.api.applyTransaction({ remove: [{ ...params.node.data }] });
    };

    useImperativeHandle(
        ref,
        () => ({
            refresh: (params) => {
                setArticle(params.node.data || {});
                return true;
            },
        }),
        [],
    );

    return (
        <div className="w-100 h-100 d-flex align-items-center">
            <div className="flex-fill d-flex flex-column pl-2">
                <MokaInputLabel label="제목" labelWidth={labelWidth} value={article.artTitle} disabled className="mb-2" />
                <div className="d-flex">
                    <MokaInputLabel label="URL" labelWidth={labelWidth} value={article.artTitle} disabled className="flex-fill mr-2" />
                    <div className="flex-shrink-0 d-flex">
                        <MokaInput as="select" disabled>
                            <option value="_self">본창</option>
                            <option value="_blank">새창</option>
                        </MokaInput>
                    </div>
                </div>
            </div>
            <div className="pl-2 pr-1 flex-shrink-0 d-flex align-items-center">
                <Button variant="white" className="border-0 p-0 bg-transparent" onClick={handleDeleteArticle}>
                    <MokaIcon iconName="fas-minus-circle" />
                </Button>
            </div>
        </div>
    );
});

/**
 * 영상/포토 렌더러
 */
const MPRenderer = forwardRef((params, ref) => {
    const [content, setContent] = useState(params.node.data);

    /**
     * 컨텐츠 삭제
     */
    const handleDelete = () => {
        params.api.applyTransaction({ remove: [{ ...params.node.data }] });
    };

    useImperativeHandle(
        ref,
        () => ({
            refresh: (params) => {
                setContent(params.node.data || {});
                return true;
            },
        }),
        [],
    );

    return (
        <div className="w-100 h-100 d-flex align-items-center">
            <div className="flex-fill d-flex flex-column pl-2">
                <MokaInputLabel label="라벨명" labelWidth={labelWidth} value={content.title} disabled />
            </div>
            <div className="pl-2 pr-1 flex-shrink-0 d-flex align-items-center">
                <Button variant="white" className="border-0 p-0 bg-transparent" onClick={handleDelete}>
                    <MokaIcon iconName="fas-minus-circle" />
                </Button>
            </div>
        </div>
    );
});

/**
 * 배너 렌더러
 */
const BannerRenderer = forwardRef((params, ref) => {
    const [content, setContent] = useState(params.node.data);
    const [show, setShow] = useState(false);

    /**
     * 컨텐츠 삭제
     */
    const handleDelete = () => {
        params.api.applyTransaction({ update: [{ id: params.node.data.id }] });
    };

    /**
     * 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        setContent({
            ...content,
            thumb: imageSrc,
            thumbFile: file,
        });
        params.api.applyTransaction({ update: [{ ...content, thumb: imageSrc, thumbFile: file }] });
    };

    /**
     * 이미지 편집
     */
    const handleEditClick = () => {
        if (content.thumb) {
            imageEditer.create(
                content.thumb,
                (editImageSrc) => {
                    (async () => {
                        await fetch(editImageSrc)
                            .then((r) => r.blob())
                            .then((blobFile) => {
                                const file = commonUtil.blobToFile(blobFile, commonUtil.getUniqueKey);
                                setContent({
                                    ...content,
                                    thumb: editImageSrc,
                                    thumbFile: file,
                                });
                                params.api.applyTransaction({ update: [{ ...content, thumb: editImageSrc, thumbFile: file }] });
                            });
                    })();
                },
                { cropWidth: 300, cropHeight: 300 },
            );
        } else {
            messageBox.alert('편집할 이미지가 없습니다');
        }
    };

    useImperativeHandle(
        ref,
        () => ({
            refresh: (params) => {
                setContent(params.node.data || {});
                return true;
            },
        }),
        [],
    );

    return (
        <div className="w-100 h-100 d-flex align-items-center">
            <Row className="flex-fill align-items-center" noGutters>
                <Col xs={4} className="d-flex">
                    <div className="d-flex flex-column justify-content-center mr-2">
                        <Button size="sm" variant="gray-700" className="mb-2" onClick={() => setShow(true)}>
                            신규 등록
                        </Button>
                        <EditThumbModal
                            show={show}
                            cropHeight={cropHeight}
                            cropWidth={cropWidth}
                            onHide={() => setShow(false)}
                            thumbFileName={content.thumb}
                            apply={handleThumbFileApply}
                        />
                        <Button size="sm" variant="outline-gray-700" onClick={handleEditClick}>
                            편집
                        </Button>
                    </div>
                    <MokaImage width={105} className="flex-shrink-0" img={content.thumb} ratio={[6, 4]} />
                </Col>
                <Col xs={8} className="d-flex flex-column pl-3">
                    <div className="d-flex mb-2">
                        <MokaInputLabel label="제목" labelWidth={labelWidth} value={content.title} disabled className="flex-fill mr-2" />
                        <MokaInputLabel label="배경컬러" labelWidth={labelWidth} value={content.backgroundColor} inputProps={{ style: { width: 80 } }} disabled />
                    </div>
                    <div className="d-flex">
                        <MokaInputLabel label="URL" labelWidth={labelWidth} value={content.Url} disabled className="flex-fill mr-2" />
                        <div className="flex-shrink-0 d-flex">
                            <MokaInput as="select" disabled>
                                <option value="_self">본창</option>
                                <option value="_blank">새창</option>
                            </MokaInput>
                        </div>
                    </div>
                </Col>
            </Row>
            <div className="pl-2 pr-1 flex-shrink-0 d-flex align-items-center">
                <Button variant="white" className="border-0 p-0 bg-transparent" onClick={handleDelete}>
                    <MokaIcon iconName="fas-minus-circle" />
                </Button>
            </div>
        </div>
    );
});

/**
 * 키워드 렌더러
 */
const KeywordRenderer = forwardRef((params, ref) => {
    const [content, setContent] = useState(params.node.data);

    /**
     * 컨텐츠 삭제
     */
    const handleDelete = () => {
        params.api.applyTransaction({ update: [{ id: params.node.data.id }] });
    };

    useImperativeHandle(
        ref,
        () => ({
            refresh: (params) => {
                setContent(params.node.data || {});
                return true;
            },
        }),
        [],
    );

    return (
        <div className="w-100 h-100 d-flex align-items-center">
            <div className="flex-fill d-flex flex-column pl-2">
                <MokaInputLabel label="제목" labelWidth={labelWidth} value={content.title} className="mb-2" disabled />
                <MokaInputLabel label="키워드" labelWidth={labelWidth} value={content.title} disabled />
            </div>
            <div className="pl-2 pr-1 flex-shrink-0 d-flex align-items-center">
                <Button variant="white" className="border-0 p-0 bg-transparent" onClick={handleDelete}>
                    <MokaIcon iconName="fas-minus-circle" />
                </Button>
            </div>
        </div>
    );
});

export { ArticleRenderer, LiveRenderer, MPRenderer, BannerRenderer, KeywordRenderer };
