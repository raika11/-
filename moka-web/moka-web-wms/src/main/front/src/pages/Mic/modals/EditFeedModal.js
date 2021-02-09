import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { GET_MIC_FEED, SAVE_MIC_FEED } from '@store/mic';
import { MokaModal, MokaInputLabel, MokaImage } from '@components';
import commonUtil from '@utils/commonUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import imageEditer from '@utils/imageEditorUtil';
import { messageBox } from '@utils/toastUtil';
import { EditThumbModal } from '@pages/Desking/modals';

/**
 * 시민 마이크 피드 편집 모달
 */
const EditFeedModal = (props) => {
    const { show, onHide, agenda, feed, onChange, onSave } = props;
    const loading = useSelector(({ loading }) => loading[GET_MIC_FEED] || loading[SAVE_MIC_FEED]);
    const ANSWER_REL_DIV = useSelector(({ app }) => app.ANSWER_REL_DIV || []);
    const [error, setError] = useState({});
    const [arcShow, setArcShow] = useState(false);
    const imgRef = useRef(null);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'usedYn') {
            onChange({ key: name, value: checked ? 'Y' : 'N' });
        } else if (name === 'relDiv') {
            onChange({
                key: 'answerRel',
                value: {
                    relDiv: value,
                },
            });
            setError({});
        } else if (name === 'relUrl') {
            onChange({
                key: 'answerRel',
                value: {
                    ...feed.answerRel,
                    relUrl: value,
                },
            });
        } else if (name === 'artTitle') {
            onChange({
                key: 'answerRel',
                value: {
                    ...feed.answerRel,
                    artTitle: value,
                },
            });
        } else if (name === 'artSummary') {
            onChange({
                key: 'answerRel',
                value: {
                    ...feed.answerRel,
                    artSummary: value,
                },
            });
        } else {
            onChange({ key: name, value });
        }

        if (error[name]) {
            setError({ ...error, [name]: false });
        }
    };

    /**
     * 이미지파일 변경
     * @param {*} data 파일데이터
     * @param {string} imgLinkField 데이터가 없을 때 데이터 날릴 이미지링크 필드
     */
    const handleImgFile = (data, imgLinkField) => {
        onChange({
            key: 'answerRel',
            value: {
                ...feed.answerRel,
                artThumbnailFile: data,
                [imgLinkField]: !data ? null : feed.answerRel[imgLinkField],
            },
        });
        if (error[imgLinkField]) {
            setError({ ...error, [imgLinkField]: false });
        }
    };

    /**
     * 기사 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        onChange({
            key: 'answerRel',
            value: {
                ...feed.answerRel,
                artThumbnail: imageSrc,
                artThumbnailFile: file,
            },
        });
    };

    /**
     * 기사 이미지 편집
     */
    const handleEditClick = () => {
        if (feed.answerRel?.artThumbnail) {
            imageEditer.create(
                feed.answerRel.artThumbnail,
                (editImageSrc) => {
                    (async () => {
                        await fetch(editImageSrc)
                            .then((r) => r.blob())
                            .then((blobFile) => {
                                const file = commonUtil.blobToFile(blobFile, new Date().getTime());
                                onChange({
                                    key: 'answerRel',
                                    value: {
                                        ...feed.answerRel,
                                        artThumbnail: editImageSrc,
                                        artThumbnailFile: file,
                                    },
                                });
                            });
                    })();
                },
                { cropWidth: 300, cropHeight: 300 },
            );
        } else {
            messageBox.alert('편집할 이미지가 없습니다');
        }
    };

    /**
     * 유효성 검사
     * @param {object} feed 데이터
     */
    const validate = (feed) => {
        let isInvalid = false;

        // 피드타입별 데이터 체크
        if (feed.answerRel?.relDiv === 'I') {
            // 이미지일 때, 이미지 파일이나 이미지링크(relUrl)이 필수
            if (!feed.answerRel?.artThumbnailFile && !feed.answerRel?.relUrl) {
                setError({ ...error, relUrl: true });
                isInvalid = isInvalid || true;
            }
        } else if (feed.answerRel?.relDiv === 'M') {
            // 동영상일 때, 소스코드(relUrl) 필수
            if (!feed.answerRel?.relUrl || !REQUIRED_REGEX.test(feed.answerRel?.relUrl)) {
                setError({ ...error, relUrl: true });
                isInvalid = isInvalid || true;
            }
        } else if (feed.answerRel?.relDiv === 'A') {
            // 기사일 때, 페이지URL(relUrl), 페이지제목 필수
            let ne = {};
            if (!feed.answerRel?.relUrl || !REQUIRED_REGEX.test(feed.answerRel?.relUrl)) {
                ne = { relUrl: true };
            }
            if (!feed.answerRel?.artTitle || !REQUIRED_REGEX.test(feed.answerRel?.artTitle)) {
                ne = { ...ne, artTitle: true };
            }

            if (Object.keys(ne).length > 0) {
                setError({ ...error, ...ne });
                isInvalid = isInvalid || true;
            }
        }

        return !isInvalid;
    };

    /**
     * 저장
     */
    const handleSave = () => {
        // validate
        if (validate(feed)) {
            onSave(feed);
        }
    };

    useEffect(() => {
        setError({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feed.answSeq]);

    return (
        <MokaModal
            width={500}
            size="md"
            show={show}
            onHide={onHide}
            title={`❛ ${agenda.agndKwd} ❜ 관리자 피드 ${feed.answSeq ? '수정' : '등록'}`}
            buttons={[
                { text: '저장', variant: 'positive', onClick: handleSave },
                { text: '취소', variant: 'negative', onClick: onHide },
            ]}
            centered
            loading={loading}
        >
            <h3 className="mb-3 color-primary">❛ {agenda.agndTitle} ❜</h3>
            <Form>
                {/* 사용여부 */}
                <MokaInputLabel
                    label="사용여부"
                    labelWidth={72}
                    className="mb-2"
                    id="mic-feed-usedYn"
                    as="switch"
                    name="usedYn"
                    inputProps={{ custom: true, checked: feed.usedYn === 'Y' }}
                    onChange={handleChangeValue}
                />

                {/* 피드타입 */}
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel label="피드타입" labelWidth={72} as="select" name="relDiv" value={feed.answerRel?.relDiv} onChange={handleChangeValue}>
                            <option hidden>선택</option>
                            {ANSWER_REL_DIV.map((div) => (
                                <option value={div.code} key={div.code}>
                                    {div.name}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>

                {/* 제목 */}
                <MokaInputLabel label="제목" labelWidth={72} className="mb-2" name="answTitle" value={feed.answTitle} onChange={handleChangeValue} />

                {/* 내용 */}
                <MokaInputLabel
                    label="내용"
                    labelWidth={72}
                    as="textarea"
                    inputClassName="resize-none custom-scroll"
                    inputProps={{ rows: 3 }}
                    name="answMemo"
                    value={feed.answMemo}
                    onChange={handleChangeValue}
                />

                {/* 피드 타입별 입력(이미지) */}
                {feed.answerRel?.relDiv === 'I' && (
                    <MokaInputLabel
                        className="mt-2"
                        ref={imgRef}
                        labelWidth={72}
                        label={
                            <React.Fragment>
                                이미지
                                <Button size="sm" variant="gray-700" className="mt-2" onClick={(e) => imgRef.current.rootRef.onClick(e)}>
                                    신규등록
                                </Button>
                            </React.Fragment>
                        }
                        as="imageFile"
                        inputProps={{ img: feed.answerRel?.relUrl, width: 178, height: 100, setFileValue: (o) => handleImgFile(o, 'relUrl'), deleteButton: true }}
                        isInvalid={error.relUrl}
                        required
                    />
                )}

                {/* 피드 타입별 입력(동영상) */}
                {feed.answerRel?.relDiv === 'M' && (
                    <MokaInputLabel
                        className="mt-2"
                        label="동영상\n소스코드"
                        labelWidth={72}
                        as="textarea"
                        inputClassName="resize-none custom-scroll"
                        inputProps={{ rows: 3 }}
                        name="relUrl"
                        value={feed.answerRel?.relUrl}
                        onChange={handleChangeValue}
                        isInvalid={error.relUrl}
                        required
                    />
                )}

                {/* 피드 타입별 입력(기사) */}
                {feed.answerRel?.relDiv === 'A' && (
                    <React.Fragment>
                        <MokaInputLabel
                            label="페이지 URL"
                            labelWidth={72}
                            name="relUrl"
                            value={feed.answerRel?.relUrl}
                            className="flex-fill my-2"
                            onChange={handleChangeValue}
                            isInvalid={error.relUrl}
                            required
                        />
                        <MokaInputLabel
                            className="mb-2"
                            label="페이지 제목"
                            labelWidth={72}
                            name="artTitle"
                            value={feed.answerRel?.artTitle}
                            onChange={handleChangeValue}
                            isInvalid={error.artTitle}
                            required
                        />
                        <MokaInputLabel
                            label="페이지 요약"
                            labelWidth={72}
                            as="textarea"
                            className="my-2"
                            inputClassName="resize-none custom-scroll"
                            inputProps={{ rows: 3 }}
                            name="artSummary"
                            value={feed.answerRel?.artSummary}
                            onChange={handleChangeValue}
                        />
                        <div className="d-flex">
                            <MokaInputLabel
                                as="none"
                                labelWidth={72}
                                label={
                                    <React.Fragment>
                                        페이지 이미지
                                        <Button variant="gray-700" size="sm" className="my-1 w-100" onClick={() => setArcShow(true)}>
                                            신규등록
                                        </Button>
                                        <Button variant="outline-gray-700" size="sm" className="w-100" onClick={handleEditClick}>
                                            편집
                                        </Button>
                                    </React.Fragment>
                                }
                            />
                            <MokaImage img={feed.answerRel?.artThumbnail} width={178} />
                        </div>

                        {/* 포토 아카이브 모달 */}
                        <EditThumbModal
                            show={arcShow}
                            cropHeight={300}
                            cropWidth={300}
                            onHide={() => setArcShow(false)}
                            contentId={feed.answerRel?.totalId}
                            thumbFileName={feed.answerRel?.artThumbnail}
                            apply={handleThumbFileApply}
                        />
                    </React.Fragment>
                )}
            </Form>
        </MokaModal>
    );
};

export default EditFeedModal;
