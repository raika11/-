import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@/components';
import NewsLetterPackageModal from '../modals/NewsLetterPackageModal';
import ReporterListModal from '@/pages/Reporter/modals/ReporterListModal';
import NewsLetterJpodModal from '../modals/NewsLetterJpodModal';
import { EditThumbModal } from '@/pages/Desking/modals';
import NewsLetterArticlePackageModal from '../modals/NewsLetterArticlePackageModal';

/**
 * 뉴스레터 편집 > 기본정보 설정
 */
const NewsLetterBasicInfo = ({ letterSeq, temp, onChangeValue, error, setError }) => {
    // 모달 state
    const [pkgModal, setPkgModal] = useState(false);
    const [articlePkgModal, setArticlePkgModal] = useState(false);
    const [reporterModal, setReporterModal] = useState(false);
    const [jpodModal, setJpodModal] = useState(false);
    const [imgModal, setImgModal] = useState(false);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'channelType') {
            if (value === 'TREND') {
                onChangeValue({ [name]: value, letterName: '트렌드 뉴스' });
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
     * 발송 콘텐츠 모달 > 콘텐츠 선택
     * (뉴스레터 명(한글), 뉴스레터 설명 셋팅)
     * @param {object} obj 콘텐츠 데이터
     */
    const addChannelType = (obj) => {
        let channelId, letterName, letterDesc;
        if (temp.channelType === 'ISSUE' || temp.channelType === 'TOPIC' || temp.channelType === 'SERIES') {
            channelId = Number(obj.pkgSeq);
            letterName = obj.pkgTitle;
            letterDesc = obj.pkgDesc;
        } else if (temp.channelType === 'REPORTER') {
            channelId = Number(obj.repSeq);
        } else if (temp.channelType === 'JPOD') {
            channelId = Number(obj.chnlSeq);
            letterName = obj.chnlNm;
            letterDesc = obj.chnlMemo;
        }

        onChangeValue({ channelId, letterName, letterDesc });
        setError({ ...error, channelId: false, letterName: false, letterDesc: false });
    };

    /**
     * 파일 변경
     * @param {any} data 파일데이터
     */
    const handleFileValue = (data) => {
        if (data) {
            onChangeValue({ letterImgFile: data });
        } else {
            onChangeValue({ letterImg: null, letterImgFile: data });
        }
    };

    /**
     * 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        onChangeValue({ letterImg: imageSrc, letterImgFile: file });
    };

    useEffect(() => {
        // 채널 타입이 바뀌면 channelId, channelDataId 초기화
        if (temp.channelType !== 'TREND') {
            onChangeValue({ channelId: 0, channelDataId: 0, letterName: '', letterDesc: '' });
            setError({ ...error, channelId: false, letterName: false, letterDesc: false, channelDataId: false });
        } else {
            onChangeValue({ channelDataId: 0, letterDesc: '' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [temp.channelType]);

    return (
        <>
            {letterSeq && (
                <>
                    {/* 상품 상태 값 정의 */}
                    <Form.Row className="justify-content-end">
                        {/* <MokaInputLabel as="none" label="상태" />
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
                            disabled={storeLetter.status !== 'P'}
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
                        /> */}
                        <Col xs={2} className="p-0">
                            <MokaInputLabel
                                label="A/B TEST 여부"
                                name="abtestYn"
                                value={temp.abtestYn}
                                onChange={handleChangeValue}
                                inputProps={{ readOnly: true, plaintext: true }}
                            />
                        </Col>
                    </Form.Row>
                    <hr className="divider" />
                </>
            )}

            {/* 기본정보 설정 */}
            <p className="mb-2">※ 기본정보 설정</p>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel as="none" label="발송 방법" required isInvalid={error.sendType} />
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput
                        as="radio"
                        value="A"
                        name="sendType"
                        id="letter-sendType-a"
                        inputProps={{ label: '자동', custom: true, checked: temp.sendType === 'A' }}
                        onChange={handleChangeValue}
                        disabled={temp.status === 'Y' || temp.status === 'S'}
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
                        disabled={temp.status === 'Y' || temp.status === 'S'}
                    />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel as="none" label="유형" required isInvalid={error.letterType} />
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput
                        as="radio"
                        name="letterType"
                        value="O"
                        id="letter-type-o"
                        inputProps={{ label: '오리지널', custom: true, checked: temp.letterType === 'O' }}
                        onChange={handleChangeValue}
                        disabled={temp.status === 'Y'}
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
                        disabled={temp.status === 'Y'}
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
                        disabled={temp.status === 'Y'}
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
                            disabled={temp.status === 'Y'}
                        />
                    </Col>
                )}
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel as="none" label="카테고리" required />
                <div className="flex-fill">
                    <Col xs={8} className="p-0">
                        <MokaSearchInput
                            placeholder=""
                            name="category"
                            value={temp.category}
                            onChange={handleChangeValue}
                            disabled={temp.status === 'Y'}
                            isInvalid={error.category}
                        />
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
                                disabled={temp.status === 'Y' || temp.status === 'S'}
                            />
                            <MokaInput
                                as="radio"
                                className="mr-2"
                                name="channelType"
                                value="TOPIC"
                                id="letter-channelType-topic"
                                inputProps={{ label: '토픽', custom: true, checked: temp.channelType === 'TOPIC' }}
                                onChange={handleChangeValue}
                                disabled={temp.status === 'Y' || temp.status === 'S'}
                            />
                            <MokaInput
                                as="radio"
                                className="mr-2"
                                name="channelType"
                                value="SERIES"
                                id="letter-channelType-series"
                                inputProps={{ label: '연재', custom: true, checked: temp.channelType === 'SERIES' }}
                                onChange={handleChangeValue}
                                disabled={temp.status === 'Y' || temp.status === 'S'}
                            />
                            <MokaInput
                                as="radio"
                                className="mr-2"
                                name="channelType"
                                value="ARTPKG"
                                id="letter-channelType-article"
                                inputProps={{ label: '기사', custom: true, checked: temp.channelType === 'ARTPKG' }}
                                onChange={handleChangeValue}
                                disabled={temp.status === 'Y' || temp.status === 'S'}
                            />
                            <MokaInput
                                as="radio"
                                value="REPORTER"
                                className="mr-2"
                                name="channelType"
                                id="letter-channelType-reporter"
                                inputProps={{ label: '기자', custom: true, checked: temp.channelType === 'REPORTER' }}
                                onChange={handleChangeValue}
                                disabled={temp.status === 'Y' || temp.status === 'S'}
                            />
                            <MokaInput
                                as="radio"
                                value="JPOD"
                                className="mr-2"
                                name="channelType"
                                id="letter-channelType-jpod"
                                inputProps={{ label: 'J팟', custom: true, checked: temp.channelType === 'JPOD' }}
                                onChange={handleChangeValue}
                                disabled={temp.status === 'Y' || temp.status === 'S'}
                            />
                            <MokaInput
                                as="radio"
                                value="TREND"
                                name="channelType"
                                id="letter-channelType-trend"
                                inputProps={{ label: '트렌드 뉴스', custom: true, checked: temp.channelType === 'TREND' }}
                                onChange={handleChangeValue}
                                disabled={temp.status === 'Y' || temp.status === 'S'}
                            />
                        </div>
                        <div>
                            <Col xs={8} className="p-0">
                                <MokaSearchInput
                                    value={
                                        temp.channelType === 'ARTPKG'
                                            ? Number(temp.channelDataId) === 0
                                                ? ''
                                                : temp.channelDataId
                                            : Number(temp.channelId) === 0
                                            ? ''
                                            : temp.channelId
                                    }
                                    isInvalid={error.channelId || error.channelDataId}
                                    placeholder=""
                                    onSearch={() => {
                                        if (temp.channelType === 'ISSUE' || temp.channelType === 'TOPIC' || temp.channelType === 'SERIES') {
                                            setPkgModal(true);
                                        } else if (temp.channelType === 'ARTPKG') {
                                            setArticlePkgModal(true);
                                        } else if (temp.channelType === 'REPORTER') {
                                            setReporterModal(true);
                                        } else if (temp.channelType === 'JPOD') {
                                            setJpodModal(true);
                                        } else {
                                            return;
                                        }
                                    }}
                                    inputProps={{ readOnly: true }}
                                    disabled={temp.status === 'Y' || temp.channelType === 'TREND'}
                                />
                            </Col>
                        </div>
                        {/* 모달 */}
                        <NewsLetterPackageModal show={pkgModal} onHide={() => setPkgModal(false)} channelType={temp.channelType} onRowClicked={addChannelType} />
                        <NewsLetterArticlePackageModal
                            show={articlePkgModal}
                            onHide={() => setArticlePkgModal(false)}
                            channelType={temp.channelType}
                            onRowClicked={addChannelType}
                        />
                        <ReporterListModal show={reporterModal} onHide={() => setReporterModal(false)} channelType={temp.channelType} onRowClicked={addChannelType} />
                        <NewsLetterJpodModal show={jpodModal} onHide={() => setJpodModal(false)} channelType={temp.channelType} onRowClicked={addChannelType} />
                    </div>
                </Form.Row>
            )}
            <MokaInputLabel
                label="뉴스레터 명(한글)"
                name="letterName"
                className="mb-2"
                value={temp.letterName}
                onChange={handleChangeValue}
                required
                isInvalid={error.letterName}
                disabled={temp.status === 'Y'}
            />
            <MokaInputLabel label="뉴스레터 명(영문)" name="letterEngName" className="mb-2" value={temp.letterEngName} onChange={handleChangeValue} />
            <MokaInputLabel
                as="textarea"
                className="mb-2"
                name="letterDesc"
                label="뉴스레터 설명"
                value={temp.letterDesc}
                isInvalid={error.letterDesc}
                inputClassName="resize-none"
                inputProps={{ rows: 3 }}
                onChange={handleChangeValue}
                disabled={temp.status === 'Y'}
                required
            />
            <Form.Row className="mb-2 align-items-end">
                <MokaInputLabel
                    as="imageFile"
                    className="mr-2"
                    disabled={temp.status === 'Y'}
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
                disabled={temp.status === 'Y'}
            />

            {/* 포토 아카이브 모달 */}
            <EditThumbModal show={imgModal} cropWidth={290} cropHeight={180} onHide={() => setImgModal(false)} thumbFileName={temp.headerImg} apply={handleThumbFileApply} />

            <hr className="divider" />
        </>
    );
};

export default NewsLetterBasicInfo;
