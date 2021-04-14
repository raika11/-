import React, { useState } from 'react';
import { useParams } from 'react-router';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaInputLabel } from '@/components';
import NewsLetterSendArticleAgGrid from './NewsLetterSendArticleAgGrid';
import ArticleListModal from '@/pages/Article/modals/ArticleListModal';
import NewsLetterSendEditor from './NewsLetterSendEditor';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 편집
 */
const NewsLetterSendEdit = ({ match }) => {
    const { sendSeq } = useParams();
    const [temp, setTemp] = useState({
        form: 'L',
        recipient: 'S',
        abTest: '',
        editor: '',
    });
    const [articleModal, setArticleModal] = useState(false);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setTemp({ ...temp, [name]: value });
    };

    return (
        <MokaCard
            className="w-100"
            title={`뉴스레터 상품 ${sendSeq ? '수정' : '등록'}`}
            footer
            footerButtons={[
                {
                    text: '미리보기',
                    variant: 'outline-neutral',
                    className: 'mr-1',
                },
                {
                    text: '발송',
                    variant: 'positive',
                    className: 'mr-1',
                },
                {
                    text: '취소',
                    variant: 'negative',
                },
            ].filter(Boolean)}
        >
            <Form>
                <MokaInputLabel
                    as="autocomplete"
                    label="뉴스레터 명 선택"
                    className="mb-2"
                    value={null}
                    inputProps={{ options: [{ value: 'test', label: 'test' }], maxMenuHeight: 150, placeholder: '뉴스레터 명 선택' }}
                />
                <MokaInputLabel label="유형" className="mb-2" inputProps={{ readOnly: true, plaintext: true }} />
                <MokaInputLabel label="형식 구분" className="mb-2" inputProps={{ readOnly: true, plaintext: true }} />
                <MokaInputLabel label="뉴스레터 설명" className={temp.form === 'L' && 'mb-2'} inputProps={{ readOnly: true, plaintext: true }} />
                {temp.form === 'L' && (
                    <>
                        <MokaInputLabel label="레이아웃" className="mb-2" inputProps={{ readOnly: true, plaintext: true }} />
                        <MokaInputLabel label="편집폼" inputProps={{ readOnly: true, plaintext: true }} />
                    </>
                )}
                <hr className="divider" />
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel as="select" name="abTest" label="A/B TEST" value={temp.abTest} onChange={handleChangeValue}>
                            <option value="">테스트 안 함</option>
                            <option value="sendDt">발송 일시</option>
                            <option value="senderNm">발송자 명</option>
                            <option value="title">제목</option>
                            <option value="layout">레이아웃</option>
                        </MokaInputLabel>
                    </Col>
                </Form.Row>

                {/* 발송 일시 */}
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel as="none" label={temp.abTest === 'sendDt' ? '발송 일시(A)' : '발송 일시'} />
                    <Col xs={4} className="p-0 pr-2">
                        <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null }} />
                    </Col>
                    <Col xs={3} className="p-0 pr-2">
                        <MokaInput as="dateTimePicker" inputProps={{ dateFormat: null }} />
                    </Col>
                    <MokaInput as="checkbox" id="immediate" inputProps={{ label: '즉시', custom: true }} disabled />
                </Form.Row>
                {temp.abTest === 'sendDt' && (
                    <Form.Row className="mb-2 align-items-center">
                        <MokaInputLabel as="none" label="발송 일시(B)" />
                        <Col xs={4} className="p-0 pr-2">
                            <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null }} />
                        </Col>
                        <Col xs={3} className="p-0 pr-2">
                            <MokaInput as="dateTimePicker" inputProps={{ dateFormat: null }} />
                        </Col>
                        <MokaInput as="checkbox" id="immediate" inputProps={{ label: '즉시', custom: true }} disabled />
                    </Form.Row>
                )}
                {/* 발송자 명 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" label={temp.abTest === 'senderNm' ? '발송자 명(A)' : '발송자 명'} />
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput as="select" disabled>
                            <option>중앙일보</option>
                        </MokaInput>
                    </Col>
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput disabled />
                    </Col>
                    <MokaInput placeholder="root@joongang.co.kr" disabled />
                </Form.Row>
                {temp.abTest === 'senderNm' && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel as="none" label="발송자 명(B)" />
                        <Col xs={2} className="p-0 pr-2">
                            <MokaInput as="select" disabled>
                                <option>중앙일보</option>
                            </MokaInput>
                        </Col>
                        <Col xs={2} className="p-0 pr-2">
                            <MokaInput disabled />
                        </Col>
                        <MokaInput placeholder="root@joongang.co.kr" disabled />
                    </Form.Row>
                )}
                {/* 받는 이 */}
                <Form.Row>
                    <MokaInputLabel as="none" label="받는이" />
                    <div className="flex-fill">
                        <div className="d-flex align-items-center" style={{ height: 31 }}>
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    name="recipient"
                                    value="S"
                                    id="subscribe"
                                    inputProps={{ label: '구독자 연동', custom: true, checked: temp.recipient === 'S' ? true : false }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    name="recipient"
                                    value="D"
                                    id="direct"
                                    inputProps={{ label: '직접 등록', custom: true, checked: temp.recipient === 'D' ? true : false }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            {temp.recipient === 'D' && (
                                <Button variant="positive" size="sm" style={{ overflow: 'visible' }}>
                                    Excel 업로드
                                </Button>
                            )}
                        </div>
                        {temp.recipient === 'D' && <p className="mb-0 color-primary">※ 직접 등록 시 Excel 업로드는 필수입니다.</p>}
                    </div>
                </Form.Row>
                <hr className="divider" />
                <p className="mb-0 color-primary">※ [필독] 발송 전 반드시 확인해 주세요.</p>
                <p className={temp.recipient === 'D' ? 'mb-0 color-info' : 'mb-2 color-info'}>1. 광고성 메일인 경우 메일 제목 시작 부분에 [광고]를 반드시 표기해 주세요.</p>
                {temp.recipient === 'D' && <p className="mb-2 color-info">2. 발송 대상자가 수신 동의한 경우에만 발송해 주세요.</p>}

                {/* 레이아웃 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" label={temp.abTest === 'layout' ? '레이아웃(A)' : '레이아웃'} />
                    <div className="flex-fill">
                        <div className="d-flex align-items-center">
                            {!temp.abTest === 'layout' && (
                                <Button variant="searching" size="sm" className="mr-2" style={{ overflow: 'visible' }}>
                                    찾아보기
                                </Button>
                            )}
                            <MokaInput placeholder="레이아웃을 검색해 주세요" className="flex-fill" disabled />
                        </div>
                        {!temp.abTest === 'layout' && <p className="mb-0 color-primary">※ 레이아웃이 미정인 경우 상품은 자동 임시 저장 상태 값으로 지정됩니다.</p>}
                    </div>
                </Form.Row>
                {temp.abTest === 'layout' && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel as="none" label="레이아웃(B)" />
                        <Button variant="searching" size="sm" className="mr-2" style={{ overflow: 'visible' }}>
                            찾아보기
                        </Button>
                        <MokaInput placeholder="레이아웃을 검색해 주세요" className="flex-fill" disabled />
                    </Form.Row>
                )}

                {/* 제목 */}
                <MokaInputLabel label={temp.abTest === 'title' ? '제목(A)' : '제목'} className="mb-2" disabled />
                {temp.abTest === 'title' && <MokaInputLabel label="제목(B)" className="mb-2" disabled />}
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel as="none" label="상단 이미지 선택\n(xxx * xxx px)" />
                    <div className="flex-fill">
                        <div className="d-flex align-items-center">
                            <Button variant="searching" size="sm" className="mr-2" style={{ overflow: 'visible', maxHeight: 31 }}>
                                찾아보기
                            </Button>
                            <MokaInput disabled />
                        </div>
                        <p className="mb-0 color-primary">※ 변경하지 않을 경우 기본 이미지가 적용됩니다.</p>
                    </div>
                </Form.Row>

                {/* 기사 검색 */}
                <Form.Row className="mb-2 input-border align-items-center">
                    <Col xs={2} clsssName="p-0">
                        <Button variant="searching" size="sm" onClick={() => setArticleModal(true)}>
                            기사 검색
                        </Button>
                        <ArticleListModal show={articleModal} onHide={() => setArticleModal(false)} />
                    </Col>
                    <Col xs={10} className="p-0">
                        <div className="component-work component-hot-click border-top pt-0" id="agGrid-0">
                            <NewsLetterSendArticleAgGrid />
                        </div>
                    </Col>
                </Form.Row>

                {/* 에디터 */}
                <NewsLetterSendEditor />

                {/* 테스트 발송 */}
                <Form.Row className="align-items-end">
                    <MokaInputLabel
                        as="textarea"
                        label="테스트 발송"
                        className="mr-2 flex-fill"
                        placeholder="테스트 발송 할 이메일을 입력하세요"
                        inputProps={{ rows: 5 }}
                        disabled
                    />
                    <Button variant="positive-a" style={{ overflow: 'visible' }}>
                        발송
                    </Button>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default NewsLetterSendEdit;
