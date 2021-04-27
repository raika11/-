import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@/components';
import NewsLetterPackageModal from '../modals/NewsLetterPackageModal';
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
        if (data) {
            setTemp({ ...temp, thumbnailFile: data });
        } else {
            setTemp({ ...temp, img: null, thumbnailFile: data });
        }
    };

    /**
     * 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        // setTemp({ ...temp, img: imageSrc, thumbnailFile: file });
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
                <MokaInputLabel as="none" label="카테고리" />
                <Col xs={7} className="p-0">
                    <MokaSearchInput placeholder="" className="w-100" disabled />
                </Col>
            </Form.Row>

            {temp.sendType === 'A' && (
                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" label="발송 콘텐츠 선택" />
                    <div className="flex-fill">
                        <div className="mb-1 d-flex align-items-center" style={{ height: 31 }}>
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
                                    // className="flex-fill"
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
                                    disabled={temp.channelType === '' ? true : false}
                                />
                            </Col>
                        </div>
                        <NewsLetterPackageModal show={pkgModal} onHide={() => setPkgModal(false)} />
                        <ReporterListModal show={reporterModal} onHide={() => setReporterModal(false)} onRowClicked={addReporter} />
                        <NewsLetterJpodModal show={jpodModal} onHide={() => setJpodModal(false)} onRowSelected={addJpod} />
                        {/* <div className="mb-1 d-flex align-items-center">
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
                                            setJpodModal(true);
                                        } else {
                                            return;
                                        }
                                    }}
                                    disabled={temp.channelType === '' ? true : false}
                                />
                                <NewsLetterJpodModal show={jpodModal} onHide={() => setJpodModal(false)} onRowSelected={addJpod} />
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
                        </div> */}
                    </div>
                </Form.Row>
            )}
            <MokaInputLabel label="뉴스레터 명(한글)" name="letterName" className="mb-2" value={temp.letterName} onChange={handleChangeValue} />
            <MokaInputLabel label="뉴스레터 명(영문)" className="mb-2" disabled />
            <MokaInputLabel
                as="textarea"
                className="mb-2"
                name="letterDesc"
                label="뉴스레터 설명"
                value={temp.letterDesc}
                inputClassName="resize-none"
                inputProps={{ rows: 3 }}
                onChange={handleChangeValue}
            />
            <Form.Row className="align-items-end">
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
                    // inputProps={{ img: temp.img, setFileValue: handleFileValue, width: 190, deleteButton: true, accept: 'image/jpeg, image/png' }}
                />
                <p className="mb-0 color-primary">사이즈 000 * 000 px</p>
            </Form.Row>

            {/* 포토 아카이브 모달 */}
            <EditThumbModal show={imgModal} cropWidth={290} cropHeight={180} onHide={() => setImgModal(false)} thumbFileName={temp.headerImg} apply={handleThumbFileApply} />

            <hr className="divider" />
        </>
    );
};

export default NewsLetterBasicInfo;
