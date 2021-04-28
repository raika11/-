import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaInputLabel, MokaSearchInput } from '@/components';
import NewsLetterSendRelArticleAgGrid from './components/NewsLetterSendRelArticleAgGrid';
import NewsLetterSendEditor from './NewsLetterSendEditor';
import { EditThumbModal } from '@/pages/Desking/modals';
import NewsLetterLayoutModal from '../NewsLetter/modals/NewsLetterLayoutModal';
import { initialState } from '@store/newsLetter';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 편집
 */
const NewsLetterSendEdit = ({ match }) => {
    const history = useHistory();
    const { sendSeq } = useParams();
    const sendInfo = useSelector(({ newsLetter }) => newsLetter.send.sendInfo);
    // const [temp, setTemp] = useState({
    //     form: 'L',
    //     recipient: 'S',
    //     abVariantType: '',
    //     editor: '',
    // });
    const [temp, setTemp] = useState(initialState.send.sendInfo);
    const [nlName, setNlName] = useState([]);
    const [letterInfo, setLetterInfo] = useState({});
    const [sn, setSn] = useState('ja');
    const [imgModal, setImgModal] = useState(false);
    const [gridInstance, setGridInstance] = useState(null); // 기사 ag-grid instance
    const [layoutModal, setLayoutModal] = useState(false);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        if (name === 'sn') {
            setSn(value);
            if (value === 'ja') {
                setTemp({ ...temp, senderName: '중앙일보', senderEmail: 'root@joongang.co.kr' });
            } else {
                setTemp({ ...temp, senderName: '', senderEmail: '' });
            }
        } else {
            setTemp({ ...temp, [name]: value });
        }
    };

    /**
     * 파일 변경
     * @param {any} data 파일데이터
     */
    const handleFileValue = (data) => {
        if (data) {
            setTemp({ ...temp, thumbnailFile: data });
        } else {
            setTemp({ ...temp, imgUrl: null, thumbnailFile: data });
        }
    };

    /**
     * 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        setTemp({ ...temp, imgUrl: imageSrc, thumbnailFile: file });
    };

    /**
     * 취소
     */
    const handleClickCancel = () => {
        history.push(match.path);
    };

    useEffect(() => {
        setTemp(sendInfo);
    }, [sendInfo]);

    return (
        <MokaCard
            className="w-100"
            letterTitle={`뉴스레터 ${sendSeq ? '수정' : '발송'}`}
            footer
            footerButtons={[
                sendSeq && {
                    text: '미리보기',
                    variant: 'outline-neutral',
                    className: 'mr-1',
                },
                {
                    text: '테스트 발송',
                    variant: 'positive-a',
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
                    onClick: handleClickCancel,
                },
            ].filter(Boolean)}
        >
            <Form>
                <MokaInputLabel
                    as="autocomplete"
                    label="뉴스레터 명 선택"
                    className="mb-2"
                    value={nlName}
                    inputProps={{
                        options: [
                            { value: '001', label: '정치 언박싱' },
                            { value: '002', label: '팩플' },
                            { value: '003', label: '백성호의 현문우답' },
                            { value: '004', label: '풀인 인사이트' },
                            { value: '005', label: '뉴스다이제스트' },
                            { value: '006', label: '기타 상품' },
                        ],
                        maxMenuHeight: 300,
                        placeholder: '뉴스레터 명 선택',
                    }}
                    onChange={(value) => {
                        setNlName(value);
                        // setLetterInfo({ ...letterInfo, letterTitle: value?.value });
                    }}
                />
                <MokaInputLabel label="유형" className="mb-2" value={letterInfo.letterType} inputProps={{ readOnly: true, plaintext: true }} />
                <MokaInputLabel label="형식 구분" className="mb-2" value={letterInfo.editLetterType} inputProps={{ readOnly: true, plaintext: true }} />
                <MokaInputLabel label="뉴스레터 설명" className={letterInfo.editLetterType === 'L' ? 'mb-2' : ''} inputProps={{ readOnly: true, plaintext: true }} />
                {letterInfo.editLetterType === 'L' && (
                    <>
                        <MokaInputLabel label="레이아웃" className="mb-2" inputProps={{ readOnly: true, plaintext: true }} />
                        <MokaInputLabel label="편집폼" inputProps={{ readOnly: true, plaintext: true }} />
                    </>
                )}

                <hr className="divider" />

                {/* A/B TEST 항목 선택 (A/B 테스트 지정이 없는 경우 Hidden) */}
                {temp.abtestYn === 'Y' && (
                    <Form.Row className="mb-2">
                        <Col xs={6} className="p-0">
                            <MokaInputLabel as="select" name="abVariantType" label="A/B TEST" value={temp.abVariantType} onChange={handleChangeValue}>
                                <option value="">테스트 안 함</option>
                                <option value="D">발송 일시</option>
                                <option value="N">발송자 명</option>
                                <option value="T">제목</option>
                                <option value="L">레이아웃</option>
                            </MokaInputLabel>
                        </Col>
                    </Form.Row>
                )}

                {/* 발송 일시 */}
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel as="none" label={temp.abVariantType === 'D' ? '발송 일시(A)' : '발송 일시'} />
                    <Col xs={4} className="p-0 pr-2">
                        <MokaInput
                            as="dateTimePicker"
                            value={temp.sendDt}
                            inputProps={{ timeFormat: null }}
                            onChange={(date) => {
                                if (typeof date === 'object') {
                                    setTemp({ ...temp, sendDt: date });
                                } else {
                                    setTemp({ ...temp, sendDt: null });
                                }
                            }}
                        />
                    </Col>
                    <Col xs={3} className="p-0 pr-2">
                        <MokaInput
                            as="dateTimePicker"
                            value={temp.sendTime}
                            inputProps={{ dateFormat: null }}
                            onChange={(date) => {
                                if (typeof date === 'object') {
                                    setTemp({ ...temp, sendTime: date });
                                } else {
                                    setTemp({ ...temp, sendTime: null });
                                }
                            }}
                        />
                    </Col>
                    <MokaInput as="checkbox" id="immediate" inputProps={{ label: '즉시', custom: true }} disabled />
                </Form.Row>
                {temp.abVariantType === 'D' && (
                    <Form.Row className="mb-2 align-items-center">
                        <MokaInputLabel as="none" label="발송 일시(B)" />
                        <Col xs={4} className="p-0 pr-2">
                            <MokaInput
                                as="dateTimePicker"
                                value={temp.sendDt}
                                inputProps={{ timeFormat: null }}
                                onChange={(date) => {
                                    if (typeof date === 'object') {
                                        setTemp({ ...temp, sendDt: date });
                                    } else {
                                        setTemp({ ...temp, sendDt: null });
                                    }
                                }}
                            />
                        </Col>
                        <Col xs={3} className="p-0 pr-2">
                            <MokaInput
                                as="dateTimePicker"
                                value={temp.sendTime}
                                inputProps={{ dateFormat: null }}
                                onChange={(date) => {
                                    if (typeof date === 'object') {
                                        setTemp({ ...temp, sendTime: date });
                                    } else {
                                        setTemp({ ...temp, sendTime: null });
                                    }
                                }}
                            />
                        </Col>
                        <MokaInput as="checkbox" id="immediate" inputProps={{ label: '즉시', custom: true }} disabled />
                    </Form.Row>
                )}
                {/* 발송자 명 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" label={temp.abVariantType === 'N' ? '발송자 명(A)' : '발송자 명'} />
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput as="select" value={sn} onChange={handleChangeValue}>
                            <option value="ja">중앙일보</option>
                            <option value="">직접 입력</option>
                        </MokaInput>
                    </Col>
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput name="senderName" value={temp.senderName} onChange={handleChangeValue} />
                    </Col>
                    <MokaInput placeholder="root@joongang.co.kr" name="senderEmail" value={temp.senderEmail} onChange={handleChangeValue} />
                </Form.Row>
                {temp.abVariantType === 'N' && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel as="none" label="발송자 명(B)" />
                        <Col xs={2} className="p-0 pr-2">
                            <MokaInput as="select" value={sn} onChange={handleChangeValue}>
                                <option value="ja">중앙일보</option>
                                <option value="">직접 입력</option>
                            </MokaInput>
                        </Col>
                        <Col xs={2} className="p-0 pr-2">
                            <MokaInput name="senderName" value={temp.senderName} onChange={handleChangeValue} />
                        </Col>
                        <MokaInput placeholder="root@joongang.co.kr" name="senderEmail" value={temp.senderEmail} onChange={handleChangeValue} />
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
                                    name="scbLinkYn"
                                    value="Y"
                                    id="subscribe"
                                    inputProps={{ label: '구독자 연동', custom: true, checked: temp.scbLinkYn === 'Y' }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    name="scbLinkYn"
                                    value="N"
                                    id="direct"
                                    inputProps={{ label: '직접 등록', custom: true, checked: temp.scbLinkYn === 'N' }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            {temp.scbLinkYn === 'N' && (
                                <Button variant="positive" size="sm" style={{ overflow: 'visible' }}>
                                    Excel 업로드
                                </Button>
                            )}
                        </div>
                        {temp.scbLinkYn === 'N' && <p className="mb-0 color-primary">※ 직접 등록 시 Excel 업로드는 필수입니다.</p>}
                    </div>
                </Form.Row>

                <hr className="divider" />

                <p className="mb-0 color-primary">※ [필독] 발송 전 반드시 확인해 주세요.</p>
                <p className={temp.scbLinkYn === 'N' ? 'mb-0 color-info' : 'mb-2 color-info'}>1. 광고성 메일인 경우 메일 제목 시작 부분에 [광고]를 반드시 표기해 주세요.</p>
                {temp.scbLinkYn === 'N' && <p className="mb-2 color-info">2. 발송 대상자가 수신 동의한 경우에만 발송해 주세요.</p>}

                {/* 레이아웃 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" label={temp.abVariantType === 'L' ? '레이아웃(A)' : '레이아웃'} />
                    <div>
                        <MokaSearchInput
                            placeholder="레이아웃을 검색해 주세요"
                            className="flex-fill"
                            value={temp.containerSeq || ''}
                            onSearch={() => setLayoutModal(true)}
                            inputProps={{ readOnly: true }}
                            disabled={temp.abVariantType === 'L' && true}
                        />
                        {temp.abVariantType !== 'L' && <p className="mb-0 color-primary">※ 레이아웃이 미정인 경우 상품은 자동 임시저장 상태 값으로 지정됩니다.</p>}
                    </div>
                    <NewsLetterLayoutModal show={layoutModal} onHide={() => setLayoutModal(false)} />
                </Form.Row>
                {temp.abVariantType === 'L' && (
                    <Form.Row className="mb-2">
                        <MokaInputLabel as="none" label="레이아웃(B)" />
                        <MokaSearchInput
                            placeholder="레이아웃을 검색해 주세요"
                            className="flex-fill"
                            value={temp.containerSeq || ''}
                            onSearch={() => setLayoutModal(true)}
                            inputProps={{ readOnly: true }}
                        />
                    </Form.Row>
                )}

                {/* 제목 */}
                <MokaInputLabel label={temp.abVariantType === 'T' ? '제목(A)' : '제목'} className="mb-2" value={temp.letterTitle} onChange={handleChangeValue} />
                {temp.abVariantType === 'T' && <MokaInputLabel label="제목(B)" className="mb-2" value={temp.letterTitle} onChange={handleChangeValue} />}

                {/* 이미지 등록 */}
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel
                        as="imageFile"
                        className="mr-2"
                        label={
                            <React.Fragment>
                                상단 이미지 선택
                                <br />
                                <Button variant="gray-700" size="sm" className="mt-2" onClick={() => setImgModal(true)}>
                                    신규등록
                                </Button>
                            </React.Fragment>
                        }
                        inputProps={{ img: temp.imgUrl, setFileValue: handleFileValue, width: 190, deleteButton: true, accept: 'image/jpeg, image/png, image/gif' }}
                    />

                    {/* 포토 아카이브 모달 */}
                    <EditThumbModal show={imgModal} cropWidth={290} cropHeight={180} onHide={() => setImgModal(false)} thumbFileName={temp.imgUrl} apply={handleThumbFileApply} />
                    <p className="mb-0 color-primary">※ 변경하지 않을 경우 기본 이미지가 적용됩니다.</p>
                </Form.Row>

                {/* 기사 검색 */}
                <NewsLetterSendRelArticleAgGrid articles={[]} gridInstance={gridInstance} setGridInstance={setGridInstance} />

                {/* 에디터 */}
                <NewsLetterSendEditor />

                {/* 테스트 발송 */}
                <Form.Row className="align-items-end">
                    <MokaInputLabel as="textarea" label="테스트 발송" className="flex-fill" placeholder="테스트 발송 할 이메일을 입력하세요" inputProps={{ rows: 2 }} disabled />
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default NewsLetterSendEdit;
