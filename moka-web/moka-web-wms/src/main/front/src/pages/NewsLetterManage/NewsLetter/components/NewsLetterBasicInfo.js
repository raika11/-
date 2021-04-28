import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@/components';
import RecommendIssueListModal from '@/pages/Issue/modal/RecommendIssueListModal';
import ReporterListModal from '@/pages/Reporter/modals/ReporterListModal';
import NewsLetterJpodModal from '../modals/NewsLetterJpodModal';
import { EditThumbModal } from '@/pages/Desking/modals';

/**
 * 뉴스레터 편집 > 기본정보 설정
 */
const NewsLetterBasicInfo = ({ letterSeq, temp, setTemp, onChangeValue }) => {
    const storeLetter = useSelector(({ newsLetter }) => newsLetter.newsLetter.letterInfo);

    // 이슈번호, JPOD 채널번호, 기자번호는 channelId로 셋팅되기 때문에 local state로 관리
    const [issueSeq, setIssueSeq] = useState('');
    const [reporterSeq, setReporterSeq] = useState('');
    const [jpodSeq, setJpodSeq] = useState('');
    // 모달 state
    const [pkgModal, setPkgModal] = useState(false);
    const [reporterModal, setReporterModal] = useState(false);
    const [jpodModal, setJpodModal] = useState(false);
    const [imgModal, setImgModal] = useState(false);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'channelType') {
            if (value === 'Trend') {
                onChangeValue({ letterName: '트렌드 뉴스' });
            } else {
                onChangeValue({ [name]: value, letterName: '' });
            }
        } else if (name === 'scbYn') {
            if (checked) {
                onChangeValue({ [name]: 'Y' });
            } else {
                onChangeValue({ [name]: 'N' });
            }
        } else {
            onChangeValue({ [name]: value });
        }
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

    /**
     * JPOD 모달 > JPOD 채널 선택
     * @param {object} chnl 채널 데이터
     */
    const addJpod = (chnl) => {
        setJpodSeq(chnl.chnlSeq);
        setTemp({
            ...temp,
            channelId: chnl.chnlSeq,
        });
    };

    /**
     * 파일 변경
     * @param {any} data 파일데이터
     */
    const handleFileValue = (data) => {
        setTemp({ ...temp, letterImgFile: data });
    };

    /**
     * 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        setTemp({ ...temp, letterImg: imageSrc, letterImgFile: file });
    };

    useEffect(() => {
        // 채널 타입별 lacal state 변경
        if (temp.channelType !== 'ISSUE' || temp.channelType !== 'TOPIC' || temp.channelType !== 'SERIES' || temp.channelType !== 'ARTICLE') {
            setIssueSeq('');
        }

        if (temp.channelType !== 'REPORTER') {
            setReporterSeq('');
        }

        if (temp.channelType !== 'JPOD') {
            setJpodSeq('');
        }
    }, [temp.channelType]);

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
                            inputProps={{ label: '임시저장', custom: true, checked: temp.status === 'P' }}
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
                            <MokaInputLabel label="A/B TEST 여부" value={temp.abtestYn} onChange={handleChangeValue} />
                        </Col>
                    </Form.Row>
                    <hr className="divider" />
                </>
            )}

            {/* 기본정보 설정 */}
            <p className="mb-2">※ 기본정보 설정</p>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel as="none" label="발송 방법" required />
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
                <MokaInputLabel as="none" label="유형" required />
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput
                        as="radio"
                        name="letterType"
                        value="O"
                        id="letter-type-o"
                        inputProps={{ label: '오리지널', custom: true, checked: temp.letterType === 'O' }}
                        onChange={handleChangeValue}
                    />
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput
                        as="radio"
                        name="letterType"
                        value="B"
                        id="letter-type-b"
                        inputProps={{ label: '브리핑', custom: true, checked: temp.letterType === 'B' }}
                        onChange={handleChangeValue}
                    />
                </Col>
                <Col xs={2} className={temp.sendType === 'M' ? 'p-0 pr-2' : 'p-0'}>
                    <MokaInput
                        as="radio"
                        name="letterType"
                        value="N"
                        id="letter-type-n"
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
                            id="letter-type-e"
                            inputProps={{ label: '기타', custom: true, checked: temp.letterType === 'E' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                )}
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel as="none" label="카테고리" required />
                <div className="flex-fill">
                    <Col xs={8} className="p-0">
                        <MokaSearchInput placeholder="" disabled />
                    </Col>
                </div>
            </Form.Row>

            {temp.sendType === 'A' && (
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel as="none" label="발송 콘텐츠 선택" required />
                    <div className="flex-fill">
                        <div className="mb-2 d-flex align-items-center" style={{ height: 31 }}>
                            <MokaInput
                                as="radio"
                                className="mr-2"
                                name="channelType"
                                value="ISSUE"
                                id="letter-channelType-issue"
                                inputProps={{ label: '이슈', custom: true, checked: temp.channelType === 'ISSUE' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                as="radio"
                                className="mr-2"
                                name="channelType"
                                value="TOPIC"
                                id="letter-channelType-topic"
                                inputProps={{ label: '토픽', custom: true, checked: temp.channelType === 'TOPIC' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                as="radio"
                                className="mr-2"
                                name="channelType"
                                value="SERIES"
                                id="letter-channelType-series"
                                inputProps={{ label: '연재', custom: true, checked: temp.channelType === 'SERIES' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                as="radio"
                                className="mr-2"
                                name="channelType"
                                value="ARTICLE"
                                id="letter-channelType-article"
                                inputProps={{ label: '기사', custom: true, checked: temp.channelType === 'ARTICLE' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                as="radio"
                                value="REPORTER"
                                className="mr-2"
                                name="channelType"
                                id="letter-channelType-reporter"
                                inputProps={{ label: '기자', custom: true, checked: temp.channelType === 'REPORTER' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                as="radio"
                                value="JPOD"
                                className="mr-2"
                                name="channelType"
                                id="letter-channelType-jpod"
                                inputProps={{ label: 'J팟', custom: true, checked: temp.channelType === 'JPOD' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                as="radio"
                                value="TREND"
                                name="channelType"
                                id="letter-channelType-trend"
                                inputProps={{ label: '트렌드 뉴스', custom: true, checked: temp.channelType === 'TREND' }}
                                onChange={handleChangeValue}
                            />
                        </div>
                        <div>
                            <Col xs={8} className="p-0">
                                <MokaSearchInput
                                    value={issueSeq}
                                    placeholder=""
                                    onSearch={() => {
                                        if (temp.channelType === 'ISSUE' || temp.channelType === 'TOPIC' || temp.channelType === 'SERIES' || temp.channelType === 'ARTICLE') {
                                            setPkgModal(true);
                                        } else if (temp.channelType === 'REPORTER') {
                                            setReporterModal(true);
                                        } else if (temp.channelType === 'JPOD') {
                                            setJpodModal(true);
                                        } else {
                                            return;
                                        }
                                    }}
                                    inputProps={{ readOnly: true }}
                                    disabled={temp.channelType === 'TREND' ? true : false}
                                />
                            </Col>
                        </div>
                        <RecommendIssueListModal usageNewsLetter show={pkgModal} onHide={() => setPkgModal(false)} />
                        <ReporterListModal show={reporterModal} onHide={() => setReporterModal(false)} onRowClicked={addReporter} />
                        <NewsLetterJpodModal show={jpodModal} onHide={() => setJpodModal(false)} onRowSelected={addJpod} />
                    </div>
                </Form.Row>
            )}
            <MokaInputLabel label="뉴스레터 명(한글)" name="letterName" className="mb-2" value={temp.letterName} onChange={handleChangeValue} required />
            <MokaInputLabel label="뉴스레터 명(영문)" name="letterEngName" className="mb-2" value={temp.letterEngName} onChange={handleChangeValue} />
            <MokaInputLabel
                as="textarea"
                className="mb-2"
                name="letterDesc"
                label="뉴스레터 설명"
                value={temp.letterDesc}
                inputClassName="resize-none"
                inputProps={{ rows: 3 }}
                onChange={handleChangeValue}
                required
            />
            <Form.Row className="mb-2 align-items-end">
                <MokaInputLabel
                    as="imageFile"
                    className="mr-2"
                    label={
                        <React.Fragment>
                            상품 이미지
                            <br />
                            <Button variant="gray-700" size="sm" className="mt-2" onClick={() => setImgModal(true)}>
                                신규등록
                            </Button>
                        </React.Fragment>
                    }
                    inputProps={{ img: temp.letterImg, setFileValue: handleFileValue, width: 170, deleteButton: true, accept: 'image/jpeg, image/png' }}
                />
                <div>
                    <p className="mb-0">사이즈 000 * 000 px</p>
                    <p className="mb-0 color-primary">※ 지정하지 않을 경우 "사진없음" 기본 이미지가 노출됨</p>
                </div>
            </Form.Row>
            <MokaInputLabel
                as="switch"
                label="구독 가능 여부"
                name="scbYn"
                id="letter-scbYn"
                onChange={handleChangeValue}
                inputProps={{ custom: true, checked: temp.scbYn === 'Y' }}
            />

            {/* 포토 아카이브 모달 */}
            <EditThumbModal show={imgModal} cropWidth={290} cropHeight={180} onHide={() => setImgModal(false)} thumbFileName={temp.headerImg} apply={handleThumbFileApply} />

            <hr className="divider" />
        </>
    );
};

export default NewsLetterBasicInfo;
