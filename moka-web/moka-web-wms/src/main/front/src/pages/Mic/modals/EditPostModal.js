import React, { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { GET_MIC_POST, SAVE_MIC_POST } from '@store/mic';
import { MokaModal, MokaInputLabel } from '@components';
import { REQUIRED_REGEX } from '@utils/regexUtil';

/**
 * 포스트 관리 모달
 */
const EditPostModal = (props) => {
    const { show, onHide, agenda, post, onChange, onSave, onDelete } = props;
    const loading = useSelector(({ loading }) => loading[GET_MIC_POST] || loading[SAVE_MIC_POST]);
    const [error, setError] = useState({});
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
     */
    const handleImgFile = (data) => {
        onChange({
            key: 'answerRel',
            value: {
                ...post.answerRel,
                artThumbnailFile: data,
                artThumbnail: !data ? null : post.answerRel?.artThumbnail,
            },
        });
    };

    /**
     * 유효성 검사
     * @param {object} feed 데이터
     */
    const validate = (feed) => {
        let isInvalid = false;
        let ne = {};

        const chkRelUrl = feed.answerRel?.relUrl && REQUIRED_REGEX.test(feed.answerRel?.relUrl);
        const chkArtTitle = feed.answerRel?.artTitle && REQUIRED_REGEX.test(feed.answerRel?.artTitle);

        // answerRel 필드 데이터가 하나라도 있으면 둘 다 필수
        if (chkRelUrl || chkArtTitle) {
            // 페이지URL(relUrl) 필수
            if (!chkRelUrl) {
                ne = { relUrl: true };
            }

            // 페이지제목 필수
            if (!chkArtTitle) {
                ne = { ...ne, artTitle: true };
            }
        }

        if (Object.keys(ne).length > 0) {
            setError({ ...error, ...ne });
            isInvalid = isInvalid || true;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post.answSeq]);

    return (
        <MokaModal
            width={500}
            size="md"
            show={show}
            onHide={onHide}
            title={`❛ ${agenda.agndKwd} ❜ 포스트 관리`}
            buttons={[
                { text: '저장', variant: 'positive', onClick: handleSave },
                { text: '취소', variant: 'negative', onClick: onHide },
                { text: '삭제', variant: 'negative', onClick: () => onDelete(post) },
            ]}
            centered
            loading={loading}
        >
            <h3 className="mb-3 color-primary">{agenda.agndTitle}</h3>

            {/* 작성자(수정불가) */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="작성자" labelWidth={72} as="none" />
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

            {/* 단문(수정불가) */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="단문" labelWidth={72} as="none" />
                <div style={{ maxHeight: 150 }} className="custom-scroll w-100 p-2 input-border pre-wrap user-select-text ft-14">
                    {post.answMemo}
                </div>
            </Form.Row>

            {/* 장문(수정불가) */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="장문" labelWidth={72} as="none" />
                <div style={{ maxHeight: 140 }} className="custom-scroll pr-2 pre-wrap user-select-text d-flex align-items-center ft-14">
                    {post.answMemoLong}
                </div>
            </Form.Row>

            {/* 페이지 URL */}
            <MokaInputLabel
                label="페이지 URL"
                labelWidth={72}
                className="mb-2"
                name="relUrl"
                value={post.answerRel?.relUrl}
                onChange={handleChangeValue}
                isInvalid={error.relUrl}
                required
            />

            {/* 페이지 제목 */}
            <MokaInputLabel
                label="페이지 제목"
                labelWidth={72}
                className="mb-2"
                name="artTitle"
                value={post.answerRel?.artTitle}
                onChange={handleChangeValue}
                isInvalid={error.artTitle}
                required
            />

            {/* 페이지 요약 */}
            <MokaInputLabel
                label="페이지 요약"
                labelWidth={72}
                className="mb-2"
                as="textarea"
                inputClassName="resize-none"
                inputProps={{ rows: 3 }}
                name="artSummary"
                value={post.answerRel?.artSummary}
                onChange={handleChangeValue}
            />

            {/* 페이지 이미지 */}
            <MokaInputLabel
                as="imageFile"
                ref={imgRef}
                labelWidth={72}
                label={
                    <React.Fragment>
                        페이지 이미지
                        <Button variant="gray-700" size="sm" className="my-1 w-100" onClick={(e) => imgRef.current.rootRef.onClick(e)}>
                            신규등록
                        </Button>
                        <Button variant="outline-gray-700" size="sm" className="w-100" onClick={(e) => imgRef.current.rootRef.onClick(e)}>
                            편집
                        </Button>
                    </React.Fragment>
                }
                inputProps={{ img: post.answerRel?.artThumbnail, width: 178, height: 100, setFileValue: handleImgFile, deleteButton: true }}
            />
        </MokaModal>
    );
};

export default EditPostModal;
