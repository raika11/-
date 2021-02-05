import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { GET_MIC_FEED } from '@store/mic';
import { MokaModal, MokaInputLabel } from '@components';

/**
 * 시민 마이크 피드 편집 모달
 */
const FeedEditModal = (props) => {
    const { show, onHide, agenda, feed, onChange } = props;
    const loading = useSelector(({ loading }) => loading[GET_MIC_FEED]);
    const ANSWER_REL_DIV = useSelector(({ app }) => app.ANSWER_REL_DIV || []);
    const imgRef = useRef(null);

    const handleHide = () => {
        onHide();
    };

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
                    ...feed.answerRel,
                    relUrl: value,
                },
            });
        } else {
            onChange({ key: name, value });
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
                ...feed.answerRel,
                artThumbnailFile: data,
                relUrl: !data ? '' : feed.answerRel.relUrl,
            },
        });
    };

    return (
        <MokaModal
            width={500}
            size="md"
            show={show}
            onHide={handleHide}
            title={`❛ ${agenda.agndKwd} ❜ 관리자 피드 ${feed.answSeq ? '수정' : '등록'}`}
            buttons={[
                { text: '저장', variant: 'positive' },
                { text: '취소', variant: 'negative', onClick: handleHide },
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
                        inputProps={{ img: feed.answerRel?.relUrl, width: 178, height: 100, setFileValue: handleImgFile, deleteButton: true }}
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
                    />
                )}

                {/* 피드 타입별 입력(기사) */}
                {feed.answerRel?.relDiv === 'A' && (
                    <React.Fragment>
                        <div className="d-flex my-2">
                            <MokaInputLabel
                                label="페이지 URL"
                                labelWidth={72}
                                name="relUrl"
                                value={feed.answerRel?.relUrl}
                                className="flex-fill"
                                onChange={handleChangeValue}
                                required
                            />
                            <Button variant="searching" className="flex-shrink-0 ml-2">
                                기사 검색
                            </Button>
                        </div>
                        <MokaInputLabel
                            className="mb-2"
                            label="페이지 제목"
                            labelWidth={72}
                            name="artTitle"
                            value={feed.answerRel?.artTitle}
                            onChange={handleChangeValue}
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
                            inputProps={{ img: feed.answerRel?.relUrl, width: 178, height: 100, setFileValue: handleImgFile, deleteButton: true }}
                        />
                    </React.Fragment>
                )}
            </Form>
        </MokaModal>
    );
};

export default FeedEditModal;
