import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@/components';
import NewsLetterPackageModal from '../modals/NewsLetterPackageModal';
import ReporterListModal from '@/pages/Reporter/modals/ReporterListModal';

/**
 * 뉴스레터 편집 > 기본정보 설정
 */
const NewsLetterBasicInfo = ({ letterSeq, temp, setTemp, onChangeValue }) => {
    const storeLetter = useSelector(({ newsLetter }) => newsLetter.newsLetter.letterInfo);

    // 이슈번호, JPOD 채널번호, 기자번호는 channelId로 셋팅되기 때문에 local state로 관리
    const [issueSeq, setIssueSeq] = useState('');
    const [reporterSeq, setReporterSeq] = useState('');
    const [jpodSeq, setJpodSeq] = useState('');
    const [pkgModal, setPkgModal] = useState(false);
    const [reporterModal, setReporterModal] = useState(false);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        onChangeValue({ [name]: value });
    };

    /**
     * 기자 모달 > 기자 선택
     * @param {object} reporter 기자 데이터
     */
    const addReporter = (reporter) => {
        setReporterSeq(reporter.repSeq);
        setTemp({
            ...temp,
            channelId: reporter.repSeq,
        });
        setReporterModal(false);
    };

    return (
        <>
            {letterSeq && (
                <>
                    {/* 상품 상태 값 정의 */}
                    <Form.Row className="mb-2 align-items-center">
                        <MokaInputLabel as="none" label="상태" />
                        <MokaInput
                            as="radio"
                            value="Y"
                            name="status"
                            id="letter-status-y"
                            className="mr-2"
                            inputProps={{ label: '활성', custom: true, checked: temp.status === 'Y' }}
                            onChange={handleChangeValue}
                        />
                        <MokaInput
                            as="radio"
                            value="P"
                            name="status"
                            id="letter-status-p"
                            className="mr-2"
                            inputProps={{ label: '임시 저장', custom: true, checked: temp.status === 'P' }}
                            disabled={storeLetter.status !== 'P' ? true : false}
                            onChange={handleChangeValue}
                        />
                        <MokaInput
                            as="radio"
                            value="S"
                            name="status"
                            id="letter-status-s"
                            className="mr-2"
                            inputProps={{ label: '중지', custom: true, checked: temp.status === 'S' }}
                            onChange={handleChangeValue}
                        />
                        <MokaInput
                            as="radio"
                            value="Q"
                            name="status"
                            id="letter-status-q"
                            className="mr-2"
                            inputProps={{ label: '종료', custom: true, checked: temp.status === 'Q' }}
                            onChange={handleChangeValue}
                        />
                        <Col xs={3} className="p-0">
                            <MokaInputLabel label="A/B TEST 여부" value={temp.abtestYN} onChange={handleChangeValue} />
                        </Col>
                    </Form.Row>
                    <hr className="divider" />
                </>
            )}

            {/* 기본정보 설정 */}
            <p className="mb-2">※ 기본정보 설정</p>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel as="none" label="발송 방법" />
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput
                        as="radio"
                        value="A"
                        name="sendType"
                        id="letter-sendType-a"
                        inputProps={{ label: '자동', custom: true, checked: temp.sendType === 'A' }}
                        onChange={handleChangeValue}
                    />
                </Col>
                <Col xs={2} className="p-0">
                    <MokaInput
                        as="radio"
                        value="E"
                        name="sendType"
                        id="letter-sendType-e"
                        inputProps={{ label: '수동', custom: true, checked: temp.sendType === 'E' }}
                        onChange={handleChangeValue}
                    />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel as="none" label="유형" />
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput
                        as="radio"
                        name="letterType"
                        value="O"
                        id="letter-type-org"
                        inputProps={{ label: '오리지널', custom: true, checked: temp.letterType === 'O' }}
                        onChange={handleChangeValue}
                    />
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput
                        as="radio"
                        name="letterType"
                        value="B"
                        id="letter-type-briefing"
                        inputProps={{ label: '브리핑', custom: true, checked: temp.letterType === 'B' }}
                        onChange={handleChangeValue}
                    />
                </Col>
                <Col xs={2} className={temp.sendType === 'M' ? 'p-0 pr-2' : 'p-0'}>
                    <MokaInput
                        as="radio"
                        name="letterType"
                        value="N"
                        id="letter-type-notice"
                        inputProps={{ label: '알림', custom: true, checked: temp.letterType === 'N' }}
                        onChange={handleChangeValue}
                    />
                </Col>
                {temp.sendType === 'E' && (
                    <Col xs={2} className="p-0">
                        <MokaInput
                            as="radio"
                            name="letterType"
                            value="E"
                            id="letter-type-etc"
                            inputProps={{ label: '기타', custom: true, checked: temp.letterType === 'E' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                )}
            </Form.Row>

            {temp.sendType === 'A' && (
                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" label="발송 콘텐츠 선택" />
                    <div className="flex-fill">
                        <div className="mb-1 d-flex align-items-center" style={{ height: 31 }}>
                            <Col xs={2} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    name="channelType"
                                    value="ISSUE"
                                    id="letter-channelType-article-issue"
                                    inputProps={{ label: '이슈', custom: true, checked: temp.channelType === 'ISSUE' }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={2} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    name="channelType"
                                    value="TOPIC"
                                    id="letter-channelType-article-topic"
                                    inputProps={{ label: '토픽', custom: true, checked: temp.channelType === 'TOPIC' }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={2} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    name="channelType"
                                    value="SERIES"
                                    id="letter-channelType-article-series"
                                    inputProps={{ label: '연재', custom: true, checked: temp.channelType === 'SERIES' }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={3} className="p-0">
                                <MokaInput
                                    as="radio"
                                    name="channelType"
                                    value="ARTICLE"
                                    id="letter-channelType-article-pkg"
                                    inputProps={{ label: '기사 패키지', custom: true, checked: temp.channelType === 'ARTICLE' }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                        </div>
                        <div className="mb-1 d-flex align-items-center">
                            <MokaInputLabel as="none" label="연결 이슈 선택" labelWidth={80} />
                            <MokaSearchInput
                                className="flex-fill"
                                value={issueSeq}
                                placeholder="이슈를 검색하세요"
                                onSearch={() => {
                                    if (temp.channelType === 'ISSUE') {
                                        setPkgModal(true);
                                    } else {
                                        return;
                                    }
                                }}
                                inputProps={{ readOnly: true }}
                                disabled={temp.channelType === '' ? true : false}
                            />
                            <NewsLetterPackageModal show={pkgModal} onHide={() => setPkgModal(false)} />
                        </div>
                        <div className="mb-1 d-flex align-items-center">
                            <Col xs={6} className="p-0 pr-20 d-flex align-items-center">
                                <div className="mr-2" style={{ width: 80 }}>
                                    <MokaInput
                                        as="radio"
                                        value="REPORTER"
                                        name="channelType"
                                        id="letter-channelType-reporter"
                                        inputProps={{ label: '기자', custom: true, checked: temp.channelType === 'REPORTER' }}
                                        onChange={handleChangeValue}
                                    />
                                </div>
                                <MokaSearchInput
                                    placeholder=""
                                    value={reporterSeq}
                                    onSearch={() => {
                                        if (temp.channelType === 'REPORTER') {
                                            setReporterModal(true);
                                        } else {
                                            return;
                                        }
                                    }}
                                    inputProps={{ readOnly: true }}
                                    disabled={temp.channelType === '' ? true : false}
                                />
                                <ReporterListModal show={reporterModal} onHide={() => setReporterModal(false)} onRowClicked={addReporter} />
                            </Col>
                            <Col xs={6} className="p-0 pl-20 d-flex align-items-center">
                                <div className="mr-2" style={{ width: 80 }}>
                                    <MokaInput
                                        as="radio"
                                        value="JPOD"
                                        name="channelType"
                                        id="letter-channelType-jpod"
                                        inputProps={{ label: 'J팟', custom: true, checked: temp.channelType === 'JPOD' }}
                                        onChange={handleChangeValue}
                                    />
                                </div>
                                <MokaSearchInput
                                    placeholder=""
                                    value={jpodSeq}
                                    inputProps={{ readOnly: true }}
                                    onSearch={() => {
                                        if (temp.channelType === 'JPOD') {
                                            return;
                                        } else {
                                            return;
                                        }
                                    }}
                                    disabled={temp.channelType === '' ? true : false}
                                />
                            </Col>
                        </div>
                        <div className="d-flex align-items-center" style={{ height: 31 }}>
                            <Col xs={3} className="p-0 pr-2">
                                <MokaInput
                                    as="radio"
                                    value="TREND"
                                    name="channelType"
                                    id="letter-channelType-trend"
                                    inputProps={{ label: '트렌드 뉴스', custom: true, checked: temp.channelType === 'TREND' }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={3} className="p-0">
                                <MokaInput
                                    as="radio"
                                    value=""
                                    name="channelType"
                                    id="letter-channelType-null"
                                    inputProps={{ label: '해당 없음', custom: true, checked: temp.channelType === '' }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                        </div>
                    </div>
                </Form.Row>
            )}
            <MokaInputLabel label="뉴스레터 명" className="mb-2" value={temp.letterName} onChange={handleChangeValue} />
            <MokaInputLabel as="textarea" label="뉴스레터 설명" value={temp.letterDesc} inputClassName="resize-none" inputProps={{ rows: 3 }} onChange={handleChangeValue} />

            <hr className="divider" />
        </>
    );
};

export default NewsLetterBasicInfo;
