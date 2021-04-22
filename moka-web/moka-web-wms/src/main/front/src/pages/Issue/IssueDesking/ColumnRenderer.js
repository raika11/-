import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ISSUE_CHANNEL_TYPE } from '@/constants';
import { initialState } from '@store/issue';
import commonUtil from '@utils/commonUtil';
import imageEditer from '@utils/imageEditorUtil';
import { messageBox } from '@utils/toastUtil';
import { VodModal, EditThumbModal } from '@pages/Desking/modals';
import { MokaIcon, MokaImage, MokaInput, MokaInputLabel } from '@components';

const labelWidth = 50;
const cropWidth = 500;
const cropHeight = 300;

/**
 * 기사 렌더러
 */
const ArticleRenderer = forwardRef((params, ref) => {
    const [show, setShow] = useState(false);
    const [vodShow, setVodShow] = useState(false);
    const [contents, setContents] = useState(params.node.data);

    /**
     * 관련기사 삭제
     */
    const handleDeleteArticle = () => {
        params.node.data.afterOnChange();
        params.api.applyTransaction({ remove: [{ ...params.node.data }] });
    };

    /**
     * 컨텐츠 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        setContents({ ...contents, [e.target.name]: e.target.value });
        params.api.applyTransaction({ update: [{ ...params.node.data, [e.target.name]: e.target.value }] });
        params.node.data.afterOnChange();
    };

    /**
     * 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        setContents({
            ...contents,
            thumbFileName: imageSrc,
            thumbFile: file,
        });
        params.api.applyTransaction({ update: [{ ...contents, thumbFileName: imageSrc, thumbFile: file }] });
        params.node.data.afterOnChange();
    };

    /**
     * 이미지 편집
     */
    const handleEditClick = () => {
        if (contents.thumbFileName) {
            imageEditer.create(
                contents.thumbFileName,
                (editImageSrc) => {
                    (async () => {
                        await fetch(editImageSrc)
                            .then((r) => r.blob())
                            .then((blobFile) => {
                                const file = commonUtil.blobToFile(blobFile, commonUtil.getUniqueKey);
                                setContents({
                                    ...contents,
                                    thumbFileName: editImageSrc,
                                    thumbFile: file,
                                });
                                params.api.applyTransaction({ update: [{ ...contents, thumbFileName: editImageSrc, thumbFile: file }] });
                                params.node.data.afterOnChange();
                            });
                    })();
                },
                { cropWidth, cropHeight },
            );
        } else {
            messageBox.alert('편집할 이미지가 없습니다');
        }
    };

    useImperativeHandle(
        ref,
        () => ({
            refresh: (params) => {
                setContents(params.node.data || {});
                return true;
            },
        }),
        [],
    );

    return (
        <div className="w-100 h-100 d-flex align-items-center">
            <div className="flex-fill d-flex">
                <div className="flex-shrink-0 d-flex flex-column mr-3">
                    <Form.Row>이미지size 500 * 300</Form.Row>
                    <MokaImage width={115} img={contents.thumbFileName} ratio={[6, 4]} />
                    <div className="d-flex justify-content-between mt-2">
                        <Button size="sm" variant="gray-700" className="mr-1" onClick={() => setShow(true)}>
                            신규 등록
                        </Button>
                        <EditThumbModal
                            show={show}
                            cropHeight={cropHeight}
                            cropWidth={cropWidth}
                            onHide={() => setShow(false)}
                            totalId={contents.channelType === ISSUE_CHANNEL_TYPE.A.code || contents.channelType === ISSUE_CHANNEL_TYPE.M.code ? contents.contentsId : undefined}
                            thumbFileName={contents.thumbFileName}
                            apply={handleThumbFileApply}
                        />
                        <Button size="sm" variant="outline-gray-700" onClick={handleEditClick}>
                            편집
                        </Button>
                    </div>
                </div>
                <div className="d-flex flex-fill flex-column">
                    <MokaInputLabel label="제목" name="title" labelWidth={labelWidth} value={contents.title} onChange={handleChangeValue} className="mb-1" required />
                    <div className="d-flex mb-1">
                        <MokaInputLabel
                            label="URL"
                            name="linkUrl"
                            labelWidth={labelWidth}
                            value={contents.linkUrl}
                            onChange={handleChangeValue}
                            className="flex-fill mr-1"
                            required
                        />
                        <div className="flex-shrink-0 d-flex">
                            <MokaInput as="select" name="linkTarget" value={contents.linkTarget} onChange={handleChangeValue}>
                                <option value="_self">본창</option>
                                <option value="_blank">새창</option>
                            </MokaInput>
                        </div>
                    </div>
                    <MokaInputLabel
                        label="리드문"
                        labelWidth={labelWidth}
                        as="textarea"
                        name="bodyHead"
                        value={contents.bodyHead}
                        onChange={handleChangeValue}
                        className="mb-1"
                        inputProps={{ rows: 3 }}
                    />
                    <div className="d-flex">
                        <MokaInputLabel label="영상 URL" labelWidth={labelWidth} name="vodUrl" value={contents.vodUrl} onChange={handleChangeValue} className="flex-fill mr-1" />
                        <Button variant="searching" className="flex-shrink-0" onClick={() => setVodShow(true)}>
                            영상검색
                        </Button>
                        <VodModal show={vodShow} onHide={() => setVodShow(false)} onSave={(url) => handleChangeValue({ target: { name: 'vodUrl', value: url } })} />
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
    const [contents, setContents] = useState(params.node.data);

    /**
     * 관련기사 삭제
     */
    const handleDeleteArticle = () => {
        params.node.data.afterOnChange();
        params.api.applyTransaction({ update: [{ ...initialState.initialDesking, afterOnChange: params.node.data.afterOnChange, id: params.node.data.id }] });
    };

    /**
     * 컨텐츠 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        setContents({ ...contents, [e.target.name]: e.target.value });
        params.api.applyTransaction({ update: [{ ...params.node.data, [e.target.name]: e.target.value }] });
        params.node.data.afterOnChange();
    };

    useImperativeHandle(
        ref,
        () => ({
            refresh: (params) => {
                setContents(params.node.data || {});
                return true;
            },
        }),
        [],
    );

    return (
        <div className="w-100 h-100 d-flex align-items-center">
            <div className="flex-fill d-flex flex-column pl-3">
                <MokaInputLabel label="제목" labelWidth={labelWidth} name="title" value={contents.title} onChange={handleChangeValue} className="mb-1" required />
                <div className="d-flex">
                    <MokaInputLabel label="URL" labelWidth={labelWidth} name="linkUrl" value={contents.linkUrl} onChange={handleChangeValue} className="flex-fill mr-1" required />
                    <div className="flex-shrink-0 d-flex">
                        <MokaInput name="linkTarget" value={contents.linkTarget} as="select" onChange={handleChangeValue}>
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
 * 관련기사 꾸러미 렌더러
 */
const PacketRenderer = forwardRef((params, ref) => {
    const [contents, setContents] = useState(params.node.data);

    /**
     * 관련기사 삭제
     */
    const handleDeleteArticle = () => {
        params.node.data.afterOnChange();
        params.api.applyTransaction({ remove: [{ ...params.node.data }] });
    };

    /**
     * 컨텐츠 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        setContents({ ...contents, [e.target.name]: e.target.value });
        params.api.applyTransaction({ update: [{ ...params.node.data, [e.target.name]: e.target.value }] });
        params.node.data.afterOnChange();
    };

    useImperativeHandle(
        ref,
        () => ({
            refresh: (params) => {
                setContents(params.node.data || {});
                return true;
            },
        }),
        [],
    );

    return (
        <div className="w-100 h-100 d-flex align-items-center">
            <div className="flex-fill d-flex flex-column">
                <MokaInputLabel label="제목" labelWidth={labelWidth} name="title" value={contents.title} onChange={handleChangeValue} className="mb-1" required />
                <div className="d-flex">
                    <MokaInputLabel label="URL" labelWidth={labelWidth} name="linkUrl" value={contents.linkUrl} onChange={handleChangeValue} className="flex-fill mr-1" required />
                    <div className="flex-shrink-0 d-flex">
                        <MokaInput name="linkTarget" value={contents.linkTarget} as="select" onChange={handleChangeValue}>
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
        params.node.data.afterOnChange();
        params.api.applyTransaction({ remove: [{ ...params.node.data }] });
    };

    /**
     * 컨텐츠 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value });
        params.api.applyTransaction({ update: [{ ...params.node.data, [e.target.name]: e.target.value }] });
        params.node.data.afterOnChange();
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
                <MokaInputLabel label="라벨명" name="title" labelWidth={labelWidth} value={content.title} onChange={handleChangeValue} required />
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
        params.node.data.afterOnChange();
        params.api.applyTransaction({ update: [{ ...initialState.initialDesking, afterOnChange: params.node.data.afterOnChange, id: params.node.data.id }] });
    };

    /**
     * 컨텐츠 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value });
        params.api.applyTransaction({ update: [{ ...params.node.data, [e.target.name]: e.target.value }] });
        params.node.data.afterOnChange();
    };

    /**
     * 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        setContent({ ...content, thumbFileName: imageSrc, thumbFile: file });
        params.api.applyTransaction({ update: [{ ...content, thumbFileName: imageSrc, thumbFile: file }] });
        params.node.data.afterOnChange();
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
                    <div className="pl-1 mr-2">
                        <Button size="sm" variant="gray-700" className="mb-1" onClick={() => setShow(true)}>
                            신규 등록
                        </Button>
                        <EditThumbModal
                            show={show}
                            cropHeight={cropHeight}
                            cropWidth={cropWidth}
                            onHide={() => setShow(false)}
                            thumbFileName={content.thumbFileName}
                            apply={handleThumbFileApply}
                        />
                    </div>
                    <MokaImage width={105} className="flex-shrink-0" img={content.thumbFileName} ratio={[6, 4]} />
                </Col>
                <Col xs={8} className="d-flex flex-column pl-4">
                    <div className="d-flex mb-1">
                        <MokaInputLabel label="제목" name="title" labelWidth={35} value={content.title} onChange={handleChangeValue} className="flex-fill mr-1" required />
                        <MokaInputLabel
                            label="배경컬러"
                            name="bgColor"
                            labelWidth={labelWidth}
                            value={content.bgColor}
                            onChange={handleChangeValue}
                            inputProps={{ style: { width: 80 } }}
                        />
                    </div>
                    <div className="d-flex">
                        <MokaInputLabel label="URL" name="linkUrl" labelWidth={35} value={content.linkUrl} onChange={handleChangeValue} className="flex-fill mr-1" />
                        <div className="flex-shrink-0 d-flex">
                            <MokaInput as="select" name="linkTarget" value={content.linkTarget} onChange={handleChangeValue}>
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
        params.node.data.afterOnChange();
        params.api.applyTransaction({ update: [{ ...initialState.initialDesking, afterOnChange: params.node.data.afterOnChange, id: params.node.data.id }] });
    };

    /**
     * 컨텐츠 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value });
        params.api.applyTransaction({ update: [{ ...params.node.data, [e.target.name]: e.target.value }] });
        params.node.data.afterOnChange();
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
            <div className="flex-fill d-flex flex-column pl-3">
                <MokaInputLabel label="제목" name="title" labelWidth={labelWidth} value={content.title} className="mb-1" onChange={handleChangeValue} required />
                <MokaInputLabel
                    label="키워드"
                    name="bodyHead"
                    labelWidth={labelWidth}
                    value={content.bodyHead}
                    onChange={handleChangeValue}
                    placeholder="구분자는 (,) 입니다"
                    required
                />
            </div>
            <div className="pl-2 pr-1 flex-shrink-0 d-flex align-items-center">
                <Button variant="white" className="border-0 p-0 bg-transparent" onClick={handleDelete}>
                    <MokaIcon iconName="fas-minus-circle" />
                </Button>
            </div>
        </div>
    );
});

export { ArticleRenderer, LiveRenderer, PacketRenderer, MPRenderer, BannerRenderer, KeywordRenderer };
