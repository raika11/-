import React, { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { GET_MIC_POST, SAVE_MIC_POST } from '@store/mic';
import { MokaModal, MokaInputLabel, MokaImage } from '@components';
import util from '@utils/commonUtil';
import { messageBox } from '@utils/toastUtil';
import imageEditer from '@utils/imageEditorUtil';
import { EditThumbModal } from '@pages/Desking/modals';

/**
 * 포스트 관리 모달
 */
const EditPostModal = (props) => {
    const { show, onHide, agenda, post, onChange, onSave, onDelete } = props;
    const loading = useSelector(({ loading }) => loading[GET_MIC_POST] || loading[SAVE_MIC_POST]);
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
                    answSeq: post.answSeq,
                    relDiv: value,
                },
            });
            setError({});
        } else if (name === 'relUrl') {
            onChange({
                key: 'answerRel',
                value: {
                    ...post.answerRel,
                    relUrl: value,
                },
            });
        } else if (name === 'artTitle') {
            onChange({
                key: 'answerRel',
                value: {
                    ...post.answerRel,
                    artTitle: value,
                },
            });
        } else if (name === 'artSummary') {
            onChange({
                key: 'answerRel',
                value: {
                    ...post.answerRel,
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
                ...post.answerRel,
                artThumbnailFile: data,
                [imgLinkField]: !data ? null : post.answerRel[imgLinkField],
            },
        });
        if (error[imgLinkField]) {
            setError({ ...error, [imgLinkField]: false });
        }
    };

    /**
     * 기사 이미지 편집
     */
    const handleEditClick = () => {
        if (post.answerRel?.artThumbnail) {
            imageEditer.create(
                post.answerRel.artThumbnail,
                (editImageSrc) => {
                    (async () => {
                        await fetch(editImageSrc)
                            .then((r) => r.blob())
                            .then((blobFile) => {
                                const file = util.blobToFile(blobFile, new Date().getTime());
                                onChange({
                                    key: 'answerRel',
                                    value: {
                                        ...post.answerRel,
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
     * 기사 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        onChange({
            key: 'answerRel',
            value: {
                ...post.answerRel,
                artThumbnail: imageSrc,
                artThumbnailFile: file,
            },
        });
    };

    /**
     * 유효성 검사
     * @param {object} post 데이터
     */
    const validate = (post) => {
        let isInvalid = false;

        // 포스트 타입별 데이터 체크
        if (post.answerRel?.relDiv === 'I') {
            // 이미지일 때, 이미지 파일이나 이미지링크(relUrl)이 필수
            if (!post.answerRel?.artThumbnailFile && !post.answerRel?.relUrl) {
                setError({ ...error, relUrl: true });
                isInvalid = isInvalid || true;
            }
        } else if (post.answerRel?.relDiv === 'M') {
            // 동영상일 때, 소스코드(relUrl) 필수
            if (util.isEmpty(post.answerRel?.relUrl)) {
                setError({ ...error, relUrl: true });
                isInvalid = isInvalid || true;
            }
        } else if (post.answerRel?.relDiv === 'A') {
            // 기사일 때, 페이지URL(relUrl), 페이지제목 필수
            let ne = {};
            if (util.isEmpty(post.answerRel?.relUrl)) {
                ne = { relUrl: true };
            }
            if (util.isEmpty(post.answerRel?.artTitle)) {
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
        if (validate(post)) {
            onSave(post);
        }
    };

    useEffect(() => {
        setError({});
    }, [post.answSeq]);

    return (
        <MokaModal
            width={500}
            size="md"
            show={show}
            onHide={onHide}
            title={`❛ ${agenda.agndKwd} ❜ 포스트 관리`}
            buttons={[
                { text: '수정', variant: 'positive', onClick: handleSave },
                { text: '삭제', variant: 'negative', onClick: () => onDelete(post) },
                { text: '취소', variant: 'negative', onClick: onHide },
            ]}
            centered
            loading={loading}
        >
            <h3 className="mb-3 color-primary">❛ {agenda.agndTitle} ❜</h3>

            {/* 작성자(수정불가) */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="작성자" as="none" />
                <span
                    className={clsx('mt-1 icon', {
                        i_kk: post.loginSns === 'K',
                        i_js: post.loginSns === 'J',
                        i_tw: post.loginSns === 'T',
                        i_na: post.loginSns === 'N',
                        i_fb: post.loginSns === 'F',
                    })}
                >
                    {post.loginName}
                </span>
            </Form.Row>

            {/* 포스트 */}
            <Form.Row className="mb-2">
                <Col xs={5} className="p-0">
                    <MokaInputLabel label="포스트타입" as="select" name="relDiv" value={post.answerRel?.relDiv} onChange={handleChangeValue}>
                        <option hidden>선택</option>
                        {ANSWER_REL_DIV.map((div) => (
                            <option value={div.code} key={div.code}>
                                {div.name}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>
            </Form.Row>

            {/* 단문(수정불가) */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="단문" as="none" />
                <div style={{ maxHeight: 150 }} className="custom-scroll w-100 p-2 input-border pre-wrap user-select-text">
                    {post.answMemo}
                </div>
            </Form.Row>

            {/* 장문(수정불가) */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="장문" as="none" />
                <div style={{ maxHeight: 140 }} className="custom-scroll pr-2 pre-wrap user-select-text d-flex align-items-center">
                    {post.answMemoLong}
                </div>
            </Form.Row>

            {/* 피드 타입별 입력(이미지) */}
            {post.answerRel?.relDiv === 'I' && (
                <MokaInputLabel
                    className="mt-2"
                    ref={imgRef}
                    label={
                        <React.Fragment>
                            이미지
                            <Button size="sm" variant="gray-700" className="mt-1" onClick={(e) => imgRef.current.rootRef.onClick(e)}>
                                신규등록
                            </Button>
                        </React.Fragment>
                    }
                    as="imageFile"
                    inputProps={{ img: post.answerRel?.relUrl, width: 178, height: 100, setFileValue: (o) => handleImgFile(o, 'relUrl'), deleteButton: true }}
                    isInvalid={error.relUrl}
                    required
                />
            )}

            {/* 피드 타입별 입력(동영상) */}
            {post.answerRel?.relDiv === 'M' && (
                <MokaInputLabel
                    className="mt-2"
                    label="동영상\n소스코드"
                    as="textarea"
                    inputProps={{ rows: 3 }}
                    name="relUrl"
                    value={post.answerRel?.relUrl}
                    onChange={handleChangeValue}
                    isInvalid={error.relUrl}
                    required
                />
            )}

            {/* 피드 타입별 입력(기사) */}
            {post.answerRel?.relDiv === 'A' && (
                <React.Fragment>
                    <MokaInputLabel
                        label="페이지 URL"
                        name="relUrl"
                        value={post.answerRel?.relUrl}
                        className="flex-fill my-2"
                        onChange={handleChangeValue}
                        isInvalid={error.relUrl}
                        required
                    />
                    <MokaInputLabel
                        className="mb-2"
                        label="페이지 제목"
                        name="artTitle"
                        value={post.answerRel?.artTitle}
                        onChange={handleChangeValue}
                        isInvalid={error.artTitle}
                        required
                    />
                    <MokaInputLabel
                        label="페이지 요약"
                        as="textarea"
                        className="my-2"
                        inputProps={{ rows: 3 }}
                        name="artSummary"
                        value={post.answerRel?.artSummary}
                        onChange={handleChangeValue}
                    />
                    <div className="d-flex">
                        <MokaInputLabel
                            as="none"
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
                        <MokaImage img={post.answerRel?.artThumbnail} width={178} />
                    </div>

                    {/* 포토 아카이브 모달 */}
                    <EditThumbModal
                        show={arcShow}
                        cropHeight={300}
                        cropWidth={300}
                        onHide={() => setArcShow(false)}
                        totalId={post.answerRel?.totalId}
                        thumbFileName={post.answerRel?.artThumbnail}
                        apply={handleThumbFileApply}
                    />
                </React.Fragment>
            )}
        </MokaModal>
    );
};

export default EditPostModal;
