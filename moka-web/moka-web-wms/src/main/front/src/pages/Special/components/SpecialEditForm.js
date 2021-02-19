import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { DIGITAL_SPECIAL_URL } from '@/constants';
import { EditThumbModal } from '@pages/Desking/modals';
import { MokaInput, MokaInputLabel, MokaCopyTextButton, MokaInputGroup } from '@components';

const SpecialEditForm = ({ special, onChange, error, setError, ptRows, depts }) => {
    const [articleUrl, setArticleUrl] = useState('');
    const [arcShow, setArcShow] = useState(false);
    const imgFileRef = useRef(null);

    /**
     * input 변경
     * @param {object} e event
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'usedYn' || name === 'schYn' || name === 'listYn') {
            onChange({
                ...special,
                [name]: checked ? 'Y' : 'N',
            });
        } else if (name === 'repDeptNameSelect') {
            if (value !== 'self') {
                // 직접입력 예외처리
                onChange({
                    ...special,
                    repDeptName: value,
                    [name]: value,
                });
            } else {
                onChange({ ...special, [name]: value });
            }
        } else {
            onChange({ ...special, [name]: value });
        }

        // error 제거
        if (error[name] === true) setError({ ...error, [name]: false });
    };

    /**
     * 서비스 시작일 변경
     * @param {any} date date
     */
    const handleChangeSdate = (date) => {
        if (typeof date === 'object') {
            onChange({ ...special, pageSdate: date });
        } else if (date === '') {
            onChange({ ...special, pageSdate: null });
        }
    };

    /**
     * 서비스 종료일 변경
     * @param {any} date date
     */
    const handleChangeEdate = (date) => {
        setError({ ...error, pageEdate: false });
        if (typeof date === 'object') {
            onChange({ ...special, pageEdate: date });
        } else if (date === '') {
            onChange({ ...special, pageEdate: null });
        }
    };

    /**
     * 파일 변경
     * @param {any} data 파일데이터
     */
    const handleFileValue = (data) => {
        setError({ ...error, imgUrl: false });
        if (data) {
            onChange({ ...special, thumbnailFile: data });
        } else {
            onChange({ ...special, imgUrl: null, thumbnailFile: data });
        }
    };

    /**
     * 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        onChange({ ...special, imgUrl: imageSrc, thumbnailFile: file });
    };

    useEffect(() => {
        if (special.seqNo) {
            setArticleUrl(`${DIGITAL_SPECIAL_URL}${special.seqNo}`);
        } else {
            setArticleUrl('');
        }
    }, [special.seqNo]);

    return (
        <Form>
            <Form.Row>
                {/* 이미지등록 */}
                <Col xs={4} className="p-0 pr-4 d-flex flex-column">
                    <MokaInputLabel as="none" label="이미지 등록(290*180)" labelWidth={120} required className="mb-1" />
                    <MokaInput
                        as="imageFile"
                        inputProps={{
                            width: '100%',
                            height: 170,
                            img: special.imgUrl,
                            deleteButton: true,
                            setFileValue: handleFileValue,
                        }}
                        ref={imgFileRef}
                        isInvalid={error.imgUrl}
                        invalidMessage={error.imgUrlMessage}
                    />
                    <div className="d-flex justify-content-between mt-2">
                        <Button variant="gray-700" size="sm" onClick={() => setArcShow(true)}>
                            신규등록
                        </Button>

                        {/* 포토 아카이브 모달 */}
                        <EditThumbModal
                            show={arcShow}
                            cropHeight={290}
                            cropWidth={180}
                            onHide={() => setArcShow(false)}
                            thumbFileName={special.imgUrl}
                            apply={handleThumbFileApply}
                        />
                    </div>
                </Col>
                {/* 사용여부/검색여부/리스트노출 */}
                <Col xs={8} className="p-0 d-flex flex-column">
                    <Form.Row className="d-flex align-items-center justify-content-between mb-2">
                        <Col xs={4} className="p-0">
                            <MokaInputLabel
                                label="사용여부"
                                labelWidth={72}
                                as="switch"
                                name="usedYn"
                                id="usedYn-switch"
                                inputProps={{ checked: special.usedYn === 'Y' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                        <Col xs={4} className="p-0">
                            <MokaInputLabel
                                label="검색여부"
                                labelWidth={72}
                                as="switch"
                                name="schYn"
                                id="schYn-switch"
                                inputProps={{ checked: special.schYn === 'Y' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                        <Col xs={4} className="p-0">
                            <MokaInputLabel
                                label="리스트 노출"
                                labelWidth={72}
                                as="switch"
                                name="listYn"
                                id="listYn-switch"
                                inputProps={{ checked: special.listYn === 'Y' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                    </Form.Row>
                    {/* 페이지코드/회차 */}
                    <Form.Row className="mb-2">
                        <Col xs={7} className="p-0 pr-20">
                            <MokaInputLabel
                                label="페이지 코드"
                                labelWidth={72}
                                as="select"
                                name="pageCd"
                                value={special.pageCd}
                                onChange={handleChangeValue}
                                isInvalid={error.pageCd}
                                invalidMessage={error.pageCdMessage}
                                required
                            >
                                <option hidden>선택</option>
                                {ptRows &&
                                    ptRows.map((code) => (
                                        <option key={code.id} value={code.id}>
                                            {code.name}
                                        </option>
                                    ))}
                            </MokaInputLabel>
                        </Col>
                        <Col xs={5} className="p-0 pl-20">
                            <MokaInputLabel
                                label="회차"
                                labelWidth={23}
                                name="ordinal"
                                required
                                value={special.ordinal}
                                isInvalid={error.ordinal}
                                invalidMessage={error.ordinalMessage}
                                onChange={handleChangeValue}
                            />
                        </Col>
                    </Form.Row>
                    {/* 검색키워드 */}
                    <Form.Row className="mb-2">
                        <MokaInputLabel label="검색 키워드" labelWidth={72} className="mb-2" as="none" />
                        <div className="w-100 d-flex flex-column">
                            <MokaInput
                                name="schKwd"
                                className="mb-1"
                                value={special.schKwd}
                                onChange={handleChangeValue}
                                isInvalid={error.schKwd}
                                invalidMessage={error.schKwdMessage}
                            />
                            <p className="m-0 ft-12 text-neutral">*'" 포함 특수문자 사용금지</p>
                        </div>
                    </Form.Row>
                    {/* 제목 */}
                    <Form.Row className="mb-2">
                        <MokaInputLabel label="제목" labelWidth={72} className="mb-2" required as="none" />
                        <div className="w-100 d-flex flex-column">
                            <MokaInput
                                name="pageTitle"
                                className="mb-1"
                                value={special.pageTitle}
                                isInvalid={error.pageTitle}
                                invalidMessage={error.pageTitleMessage}
                                onChange={handleChangeValue}
                            />
                            <p className="m-0 ft-12 text-neutral">*'" 포함 특수문자 사용금지</p>
                        </div>
                    </Form.Row>
                    {/* 서비스시작일/서비스종료일 */}
                    <Form.Row className="mb-2">
                        <Col xs={6} className="p-0 pr-10">
                            <MokaInputLabel
                                label="서비스 시작일"
                                as="dateTimePicker"
                                labelWidth={72}
                                name="pageSdate"
                                inputProps={{ timeFormat: null }}
                                value={special.pageSdate}
                                onChange={handleChangeSdate}
                                isInvalid={error.pageSdate}
                                invalidMessage={error.pageSdateMessage}
                            />
                        </Col>
                        <Col xs={6} className="p-0 pl-10">
                            <MokaInputLabel
                                label="서비스 종료일"
                                as="dateTimePicker"
                                labelWidth={72}
                                name="pageEdate"
                                inputProps={{ timeFormat: null }}
                                value={special.pageEdate}
                                onChange={handleChangeEdate}
                                isInvalid={error.pageEdate}
                                invalidMessage={error.pageEdateMessage}
                            />
                        </Col>
                    </Form.Row>
                </Col>
            </Form.Row>
            {/* PC URL */}
            <MokaInputLabel
                label="PC URL"
                labelWidth={110}
                className="mb-2"
                name="pcUrl"
                value={special.pcUrl}
                onChange={handleChangeValue}
                isInvalid={error.pcUrl}
                invalidMessage={error.pcUrlMessage}
                required
            />
            {/* Mob URL */}
            <MokaInputLabel
                label="Mobile URL"
                labelWidth={110}
                className="mb-2"
                name="mobUrl"
                value={special.mobUrl}
                onChange={handleChangeValue}
                isInvalid={error.mobUrl}
                invalidMessage={error.mobUrlMessage}
                required
            />
            {/* 중계페이지 URL */}
            <MokaInputGroup
                label="중계페이지 URL"
                labelWidth={110}
                value={articleUrl}
                className="mb-2"
                append={<MokaCopyTextButton copyText={articleUrl} successText="태그가 복사 되었습니다" />}
                disabled
            />
            {/* 광고추적 PC URL */}
            <MokaInputLabel
                label="광고추척 PC URL"
                labelWidth={110}
                className="mb-2"
                placeholder={`입력이 없을 경우 공통 소스로 수정됩니다. ex) http://dgate.opap.co.kr/imp/?ssn=566&adsn=7478&cresn=5362`}
                name="joinsAdTag"
                value={special.joinsAdTag}
                onChange={handleChangeValue}
            />
            {/* 광고추적 Mobile URL */}
            <MokaInputLabel
                label="광고추적 Mobile URL"
                labelWidth={110}
                className="mb-2"
                placeholder={`입력이 없을 경우 공통 소스로 수정됩니다. ex) http://dgate.opap.co.kr/imp/?ssn=566&adsn=7478&cresn=5362`}
                name="joinsAdTagMob"
                value={special.joinsAdTagMob}
                onChange={handleChangeValue}
            />
            {/* 구글 웹로그 코드 */}
            <MokaInputLabel
                label="구글 웹로그 코드"
                labelWidth={110}
                className="mb-2"
                placeholder={`입력이 없을 경우 공통 소스로 수정됩니다. ex) UA-40895666-10`}
                name="googleTag"
                value={special.googleTag}
                onChange={handleChangeValue}
            />
            {/* 페이지 설명 */}
            <MokaInputLabel
                label={
                    <>
                        페이지 설명 <br />
                        <br />
                        <p className="p-0 m-0 text-positive">
                            *'" 포함 <br /> 특수문자 사용금지
                        </p>
                    </>
                }
                as="textarea"
                labelWidth={110}
                className="mb-2"
                inputProps={{ rows: 3 }}
                name="pageDesc"
                value={special.pageDesc}
                onChange={handleChangeValue}
                isInvalid={error.pageDesc}
                invalidMessage={error.pageDescMessage}
            />
            {/* 부서명 */}
            <Form.Row className="mb-2">
                <Col xs={5} className="p-0">
                    <MokaInputLabel
                        label="부서명"
                        labelWidth={110}
                        name="repDeptName"
                        value={special.repDeptName}
                        onChange={handleChangeValue}
                        disabled={special.repDeptNameSelect !== 'self'}
                    />
                </Col>
                <Col xs={2} className="p-0 pl-2">
                    <MokaInput as="select" name="repDeptNameSelect" value={special.repDeptNameSelect} onChange={handleChangeValue}>
                        <option value="self">직접입력</option>
                        {depts &&
                            depts.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                    </MokaInput>
                </Col>
            </Form.Row>
            {/* 개발담당자 정보 */}
            <Form.Row className="mb-2">
                <Col xs={4} className="p-0 pr-40">
                    <MokaInputLabel label="개발 담당자 이름" labelWidth={110} name="devName" value={special.devName} onChange={handleChangeValue} />
                </Col>
                <Col xs={5} className="p-0">
                    <MokaInputLabel label="이메일" labelWidth={35} className="m-0" name="devEmail" value={special.devEmail} onChange={handleChangeValue} />
                </Col>
                <Col xs={3} className="p-0 pl-40">
                    <MokaInputLabel label="전화번호" labelWidth={49} className="m-0" name="devPhone" value={special.devPhone} onChange={handleChangeValue} />
                </Col>
            </Form.Row>

            {special.seqNo && (
                <React.Fragment>
                    {/* 등록 정보 */}
                    <Form.Row className="mb-2">
                        <Col xs={4} className="p-0">
                            <MokaInputLabel label="등록자" labelWidth={110} name="regId" value={special.regId} inputProps={{ plaintext: true, readOnly: true }} />
                        </Col>
                        <Col xs={8} className="p-0">
                            <MokaInputLabel label="등록일시" labelWidth={70} name="regDt" value={special.regDt} inputProps={{ plaintext: true, readOnly: true }} />
                        </Col>
                    </Form.Row>
                    {/* 수정 정보 */}
                    <Form.Row>
                        <Col xs={4} className="p-0">
                            <MokaInputLabel label="수정자" labelWidth={110} name="modId" value={special.modId} inputProps={{ plaintext: true, readOnly: true }} />
                        </Col>
                        <Col xs={8} className="p-0">
                            <MokaInputLabel label="수정일시" labelWidth={70} name="modDt" value={special.modDt} inputProps={{ plaintext: true, readOnly: true }} />
                        </Col>
                    </Form.Row>
                </React.Fragment>
            )}
        </Form>
    );
};

export default SpecialEditForm;
