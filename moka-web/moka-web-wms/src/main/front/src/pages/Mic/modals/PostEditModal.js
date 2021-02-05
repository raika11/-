import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { GET_MIC_POST, SAVE_MIC_POST } from '@store/mic';
import { MokaModal, MokaInputLabel } from '@components';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import ArticleListModal from '@pages/Article/modals/ArticleListModal';

/**
 * 포스트 관리 모달
 */
const PostEditModal = (props) => {
    const { show, onHide, agenda, post, onChange, onSave, onDelete } = props;
    const loading = useSelector(({ loading }) => loading[GET_MIC_POST] || loading[SAVE_MIC_POST]);
    const PDS_URL = useSelector(({ app }) => app.PDS_URL);
    const [error, setError] = useState({});
    const [mshow, setMshow] = useState(false);
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
     * 기사 변경
     * @param {object} articleData 기사데이터
     */
    const handleChangeArticle = (articleData) => {
        onChange({
            key: 'answerRel',
            value: {
                ...post.answerRel,
                artTitle: unescapeHtmlArticle(articleData.artTitle),
                relUrl: '',
                artThumbnail: articleData.artThumb ? `${PDS_URL}${articleData.artThumb}` : null,
                artThumbnailFile: null,
            },
        });
        setError({ ...error, artTitle: false });
        setMshow(false);
    };

    /**
     * 유효성 검사
     * @param {object} feed 데이터
     */
    const validate = (feed) => {
        let isInvalid = false;
        let ne = {};

        // 페이지URL(relUrl) 필수
        if (!feed.answerRel?.relUrl || !REQUIRED_REGEX.test(feed.answerRel?.relUrl)) {
            ne = { relUrl: true };
        }

        // 페이지제목 필수
        if (!feed.answerRel?.artTitle || !REQUIRED_REGEX.test(feed.answerRel?.artTitle)) {
            ne = { ...ne, artTitle: true };
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
            <MokaInputLabel label="작성자" labelWidth={72} className="mb-2" value={post.loginName} inputProps={{ plaintext: true }} disabled />

            {/* 단문(수정불가) */}
            <MokaInputLabel
                label="단문"
                labelWidth={72}
                inputClassName="resize-none custom-scroll pr-2"
                className="mb-2"
                as="textarea"
                inputProps={{ plaintext: true, readOnly: true, rows: 4 }}
                value={post.answMemo}
                disabled
            />

            {/* 페이지 URL */}
            <div className="d-flex mb-2">
                <MokaInputLabel
                    label="페이지 URL"
                    labelWidth={72}
                    className="flex-fill"
                    name="relUrl"
                    value={post.answerRel?.relUrl}
                    onChange={handleChangeValue}
                    isInvalid={error.relUrl}
                    required
                />
                <Button variant="searching" className="flex-shrink-0 ml-2" onClick={() => setMshow(true)}>
                    기사 검색
                </Button>
                <ArticleListModal show={mshow} onHide={() => setMshow(false)} onRowClicked={handleChangeArticle} />
            </div>

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

export default PostEditModal;
