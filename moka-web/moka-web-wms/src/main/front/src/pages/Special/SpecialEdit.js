import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaInputLabel, MokaImageInput, MokaCopyTextButton } from '@components';

const pageCd = [{ name: '페이지 코드 전체' }, { name: '디지털 스페셜(257)' }, { name: '디지털 AD(108)' }, { name: '기타' }];

const type = [{ name: '제목' }, { name: '담당자' }];

const SpecialEdit = (props) => {
    const { show, onSave } = props;

    const [stateObj, setStateObj] = useState({
        usedYn: 'N',
        schYn: 'N',
        listYn: 'N',
        pageCd: '',
        ordinal: '',
        schKwd: '',
        pageTitle: '',
        pageSdate: '',
        pageEdate: '',
        pcUrl: '',
        mobUrl: '',
        joinsAdTag: '',
        joinsAdTagMob: '',
        googleTag: '',
        pageDesc: '',
        repDeptName: '',
        deptList: '',
        devName: '',
        devEmail: '',
        devPhone: '',
        regId: '',
        regDt: '',
        modId: '',
        modDt: '',
    });

    // ref
    const imgFileRef = useRef(null);

    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        if (name === 'usedYn') {
            setStateObj({ ...stateObj, usedYn: value });
        } else if (name === 'schYn') {
            setStateObj({ ...stateObj, schYn: value });
        } else if (name === 'listYn') {
            setStateObj({ ...stateObj, listYn: value });
        } else if (name === 'pageCd') {
            setStateObj({ ...stateObj, pageCd: value });
        } else if (name === 'ordinal') {
            setStateObj({ ...stateObj, ordinal: value });
        } else if (name === 'schKwd') {
            setStateObj({ ...stateObj, schKwd: value });
        } else if (name === 'pageTitle') {
            setStateObj({ ...stateObj, pageTitle: value });
        } else if (name === 'pageSdate') {
            setStateObj({ ...stateObj, pageSdate: value });
        } else if (name === 'pageEdate') {
            setStateObj({ ...stateObj, pageEdate: value });
        } else if (name === 'pcUrl') {
            setStateObj({ ...stateObj, pcUrl: value });
        } else if (name === 'mobUrl') {
            setStateObj({ ...stateObj, mobUrl: value });
        } else if (name === 'joinsAdTag') {
            setStateObj({ ...stateObj, joinsAdTag: value });
        } else if (name === 'joinsAdTagMob') {
            setStateObj({ ...stateObj, joinsAdTagMob: value });
        } else if (name === 'googleTag') {
            setStateObj({ ...stateObj, googleTag: value });
        } else if (name === 'pageDesc') {
            setStateObj({ ...stateObj, pageDesc: value });
        } else if (name === 'repDeptName') {
            setStateObj({ ...stateObj, repDeptName: value });
        } else if (name === 'deptList') {
            setStateObj({ ...stateObj, deptList: value });
        } else if (name === 'devName') {
            setStateObj({ ...stateObj, devName: value });
        } else if (name === 'devEmail') {
            setStateObj({ ...stateObj, devEmail: value });
        } else if (name === 'devPhone') {
            setStateObj({ ...stateObj, devPhone: value });
        } else if (name === 'regId') {
            setStateObj({ ...stateObj, regId: value });
        } else if (name === 'regDt') {
            setStateObj({ ...stateObj, regDt: value });
        } else if (name === 'modId') {
            setStateObj({ ...stateObj, modId: value });
        } else if (name === 'modDt') {
            setStateObj({ ...stateObj, modDt: value });
        }
    };

    return (
        <>
            {show && (
                <MokaCard
                    width={738}
                    titleAs={
                        <div className="w-100 d-flex">
                            <p className="m-0">특별페이지 정보</p>
                            <p className="m-0 pl-2 ft-12" style={{ color: 'red' }}>
                                (등록 완료 후 스크립트 오류 체크 꼭 해주세요)
                            </p>
                        </div>
                    }
                    titleClassName="mb-0"
                    footerClassName="justify-content-center"
                    footerButtons={[{ text: '저장', variant: 'positive', onClick: onSave }]}
                    footer
                >
                    <Form>
                        <Form.Row className="mb-3">
                            <Col xs={4} className="p-0 pr-4">
                                <MokaInputLabel label="이미지 등록(290*180)" labelWidth={120} labelClassName="d-flex align-items-start ft-12" as="none" />
                                <MokaImageInput width={205} height={166} />
                                <Form.Row className="d-flex justify-content-between">
                                    <Button variant="outline-neutral" size="sm">
                                        파일 선택
                                    </Button>
                                    <Button variant="outline-neutral" size="sm">
                                        이미지 편집
                                    </Button>
                                </Form.Row>
                            </Col>
                            <Col xs={8} className="p-0 d-flex flex-column justify-content-between">
                                <Form.Row className="d-flex align-items-center justify-content-between">
                                    <Col xs={4} className="p-0">
                                        <MokaInputLabel
                                            label="사용여부"
                                            labelWidth={90}
                                            className="m-0"
                                            labelClassName="mr-3 ft-12"
                                            as="switch"
                                            name="usedYn"
                                            id="usedYn-switch"
                                            value={stateObj.usedYn}
                                            onChange={handleChangeValue}
                                        />
                                    </Col>
                                    <Col xs={4} className="p-0">
                                        <MokaInputLabel
                                            label="검색여부"
                                            labelWidth={90}
                                            className="m-0"
                                            labelClassName="mr-3 ft-12"
                                            as="switch"
                                            name="schYn"
                                            id="schYn-switch"
                                            value={stateObj.schYn}
                                            onChange={handleChangeValue}
                                        />
                                    </Col>
                                    <Col xs={4} className="p-0">
                                        <MokaInputLabel
                                            label="리스트 노출"
                                            labelWidth={90}
                                            className="m-0"
                                            labelClassName="mr-3 ft-12"
                                            as="switch"
                                            name="listYn"
                                            id="listYn-switch"
                                            value={stateObj.listYn}
                                            onChange={handleChangeValue}
                                        />
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col xs={8} className="p-0">
                                        <MokaInputLabel
                                            label="페이지 코드"
                                            labelWidth={90}
                                            className="m-0"
                                            labelClassName="mr-3 ft-12"
                                            as="select"
                                            name="pageCd"
                                            value={stateObj.pageCd}
                                            onChange={handleChangeValue}
                                        />
                                    </Col>
                                    <Col xs={4} className="p-0">
                                        <MokaInputLabel
                                            label="회차"
                                            labelWidth={50}
                                            className="m-0"
                                            labelClassName="mr-3 ft-12"
                                            name="ordinal"
                                            required
                                            value={stateObj.ordinal}
                                            onChange={handleChangeValue}
                                        />
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <MokaInputLabel label="검색 키워드" labelWidth={90} className="mb-3" labelClassName="mr-3 ft-12" as="none" />
                                    <div className="w-100 d-flex flex-column">
                                        <MokaInput name="schKwd" value={stateObj.schKwd} onChange={handleChangeValue} />
                                        <p className="m-0 ft-12" style={{ color: 'red' }}>
                                            *""포함, 특수문자 사용금지
                                        </p>
                                    </div>
                                </Form.Row>
                                <Form.Row>
                                    <MokaInputLabel label="제목" labelWidth={90} className="mb-3" labelClassName="mr-3 ft-12" required as="none" />
                                    <div className="w-100 d-flex flex-column">
                                        <MokaInput name="pageTitle" value={stateObj.pageTitle} onChange={handleChangeValue} />
                                        <p className="m-0 ft-12" style={{ color: 'red' }}>
                                            *""포함, 특수문자 사용금지
                                        </p>
                                    </div>
                                </Form.Row>
                                <Form.Row>
                                    <Col xs={6} className="p-0">
                                        <MokaInputLabel
                                            label="서비스 시작일"
                                            labelWidth={90}
                                            className="m-0"
                                            labelClassName="mr-3 ft-12"
                                            name="pageSdate"
                                            value={stateObj.pageSdate}
                                            onChange={handleChangeValue}
                                        />
                                    </Col>
                                    <Col xs={6} className="p-0">
                                        <MokaInputLabel
                                            label="서비스 종료일"
                                            labelWidth={90}
                                            className="m-0"
                                            labelClassName="mr-3 ft-12"
                                            name="pageEdate"
                                            value={stateObj.pageEdate}
                                            onChange={handleChangeValue}
                                        />
                                    </Col>
                                </Form.Row>
                            </Col>
                        </Form.Row>
                        <MokaInputLabel label="PC URL" labelWidth={135} labelClassName="mr-3 ft-12" name="pcUrl" value={stateObj.pcUrl} onChange={handleChangeValue} />
                        <MokaInputLabel label="Mobile URL" labelWidth={135} labelClassName="mr-3 ft-12" name="mobUrl" value={stateObj.mobUrl} onChange={handleChangeValue} />
                        <Form.Row className="mb-3">
                            <Col xs={11} className="p-0">
                                <MokaInputLabel
                                    label="중계페이지 URL"
                                    labelWidth={135}
                                    className="m-0"
                                    labelClassName="mr-3 ft-12"
                                    inputProps={{ plaintext: true, readOnly: true }}
                                />
                            </Col>
                            <Col xs={1} className="p-0 d-flex justify-content-end">
                                <MokaCopyTextButton />
                            </Col>
                        </Form.Row>
                        <MokaInputLabel
                            label="광고추척 PC URL"
                            labelWidth={135}
                            labelClassName="mr-3 ft-12"
                            placeholder={`입력이 없을 경우 공통 소스로 수정됩니다. ex) http://dgate.opap.co.kr/imp/?ssn=566&adsn=7478&cresn=5362`}
                            name="joinsAdTag"
                            value={stateObj.joinsAdTag}
                            onChange={handleChangeValue}
                        />
                        <MokaInputLabel
                            label="광고추적 Mobile URL"
                            labelWidth={135}
                            labelClassName="mr-3 ft-12"
                            placeholder={`입력이 없을 경우 공통 소스로 수정됩니다. ex) http://dgate.opap.co.kr/imp/?ssn=566&adsn=7478&cresn=5362`}
                            name="joinsAdTagMob"
                            value={stateObj.joinsAdTagMob}
                            onChange={handleChangeValue}
                        />
                        <MokaInputLabel
                            label="구글 웹로그 코드"
                            labelWidth={135}
                            labelClassName="mr-3 ft-12"
                            placeholder={`입력이 없을 경우 공통 소스로 수정됩니다. ex) UA-40895666-10`}
                            name="googleTag"
                            value={stateObj.googleTag}
                            onChange={handleChangeValue}
                        />
                        <MokaInputLabel
                            label={
                                <>
                                    페이지 설명 <br />
                                    <br />
                                    <p style={{ color: 'red' }} className="p-0 m-0">
                                        *&#39;&quot;포함 <br /> 특수문자 사용금지
                                    </p>
                                </>
                            }
                            as="textarea"
                            labelWidth={135}
                            inputProps={{ rows: 3 }}
                            labelClassName="mr-3 ft-12"
                            inputClassName="resize-none"
                            name="pageDesc"
                            value={stateObj.pageDesc}
                            onChange={handleChangeValue}
                        />
                        <Form.Row className="mb-3">
                            <Col xs={5} className="p-0">
                                <MokaInputLabel
                                    label="부서명"
                                    labelWidth={135}
                                    className="m-0"
                                    labelClassName="mr-3 ft-12"
                                    name="repDeptName"
                                    value={stateObj.repDeptName}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={2} className="p-0 pl-3">
                                <MokaInput as="select" name="deptList" onChange={handleChangeValue} />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-3">
                            <Col xs={4} className="p-0">
                                <MokaInputLabel
                                    label="개발 담당자 이름"
                                    className="m-0"
                                    labelWidth={135}
                                    labelClassName="mr-3 ft-12"
                                    name="devName"
                                    value={stateObj.devName}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={5} className="p-0">
                                <MokaInputLabel
                                    label="이메일"
                                    labelWidth={70}
                                    className="m-0"
                                    labelClassName="mr-3 ft-12"
                                    name="devEmail"
                                    value={stateObj.devEmail}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={3} className="p-0">
                                <MokaInputLabel
                                    label="전화번호"
                                    labelWidth={70}
                                    className="m-0"
                                    labelClassName="mr-3 ft-12"
                                    name="devPhone"
                                    value={stateObj.devPhone}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-3">
                            <Col xs={4} className="p-0">
                                <MokaInputLabel
                                    label="등록자"
                                    labelWidth={135}
                                    className="m-0"
                                    labelClassName="mr-3 ft-12"
                                    name="regId"
                                    value={stateObj.regId}
                                    inputProps={{ plaintext: true, readOnly: true }}
                                />
                            </Col>
                            <Col xs={4} className="p-0">
                                <MokaInputLabel
                                    label="등록일시"
                                    labelWidth={70}
                                    className="m-0"
                                    labelClassName="mr-3 ft-12"
                                    name="regDt"
                                    value={stateObj.regDt}
                                    inputProps={{ plaintext: true, readOnly: true }}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={4} className="p-0">
                                <MokaInputLabel
                                    label="수정자"
                                    labelWidth={135}
                                    className="m-0"
                                    labelClassName="mr-3 ft-12"
                                    name="modId"
                                    value={stateObj.modId}
                                    inputProps={{ plaintext: true, readOnly: true }}
                                />
                            </Col>
                            <Col xs={4} className="p-0">
                                <MokaInputLabel
                                    label="수정일시"
                                    labelWidth={70}
                                    className="m-0"
                                    labelClassName="mr-3 ft-12"
                                    name="modDt"
                                    value={stateObj.modDt}
                                    inputProps={{ plaintext: true, readOnly: true }}
                                />
                            </Col>
                        </Form.Row>
                    </Form>
                </MokaCard>
            )}
        </>
    );
};

export default SpecialEdit;
