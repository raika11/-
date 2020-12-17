import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import toast, { messageBox } from '@utils/toastUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { DIGITAL_SPECIAL_URL } from '@/constants';
import { MokaCard, MokaInput, MokaInputLabel, MokaImageInput, MokaCopyTextButton, MokaInputGroup } from '@components';
import { GET_SPECIAL, getSpecial, clearSpecial, getSpecialDeptList, saveSpecial, changeInvalidList, deleteSpecial, DELETE_SPECIAL, SAVE_SPECIAL } from '@store/special';

moment.locale('ko');
let currentDate = moment().format('YYYYMMDDHHmmss');

const SpecialEdit = () => {
    const dispatch = useDispatch();
    const { seqNo } = useParams();
    const history = useHistory();
    const special = useSelector((store) => store.special.special);
    const ptRows = useSelector((store) => store.codeMgt.ptRows);
    const depts = useSelector((store) => store.special.depts);
    const loading = useSelector((store) => store.loading[GET_SPECIAL] || store.loading[SAVE_SPECIAL] || store.loading[DELETE_SPECIAL]);
    const invalidList = useSelector((store) => store.special.invalidList);
    const [temp, setTemp] = useState({});
    const [articleUrl, setArticleUrl] = useState('');
    const [error, setError] = useState({});
    const [fileValue, setFileValue] = useState(null);
    const [footerBtns, setFooterBtns] = useState([]);
    const imgFileRef = useRef(null);

    /**
     * input 변경
     * @param {object} e event
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'usedYn' || name === 'schYn' || name === 'listYn') {
            setTemp({ ...temp, [name]: checked ? 'Y' : 'N' });
        } else if (name === 'repDeptNameSelect') {
            if (value !== 'self') {
                // 직접입력 예외처리
                setTemp({ ...temp, repDeptName: value, [name]: value });
            } else {
                setTemp({ ...temp, [name]: value });
            }
        } else {
            setTemp({ ...temp, [name]: value });
        }

        // error 제거
        if (error[name] === true) setError({ ...error, [name]: false });
    };

    /**
     * 서비스 시작일 변경
     * @param {any} date date
     */
    const handleChangeSdate = (date) => {
        setError({ ...error, pageSdate: false });
        if (typeof date === 'object') {
            setTemp({ ...temp, pageSdate: date });
        } else if (date === '') {
            setTemp({ ...temp, pageSdate: null });
        }
    };

    /**
     * 서비스 종료일 변경
     * @param {any} date date
     */
    const handleChangeEdate = (date) => {
        setError({ ...error, pageEdate: false });
        if (typeof date === 'object') {
            setTemp({ ...temp, pageEdate: date });
        } else if (date === '') {
            setTemp({ ...temp, pageEdate: null });
        }
    };

    /**
     * 취소
     */
    const handleClickCancle = useCallback(() => {
        history.push('/special');
        dispatch(clearSpecial());
    }, [dispatch, history]);

    /**
     * 삭제
     */
    const handleClickDelete = useCallback(() => {
        messageBox.confirm(
            '삭제하시겠습니까?',
            () => {
                dispatch(
                    deleteSpecial({
                        seqNo: special.seqNo,
                        callback: ({ header }) => {
                            if (header.success) {
                                toast.success(header.message);
                                history.push('/special');
                            } else {
                                toast.fail(header.message);
                            }
                        },
                    }),
                );
            },
            () => {},
        );
    }, [dispatch, history, special.seqNo]);

    /**
     * validate
     * @param {object} saveObj validate target
     */
    const validate = useCallback(
        (saveObj) => {
            let isInvalid = false,
                errList = [];

            // 페이지코드 체크
            if (!saveObj.pageCd || !REQUIRED_REGEX.test(saveObj.pageCd)) {
                errList.push({
                    field: 'pageCd',
                    reason: '',
                });
                isInvalid = isInvalid || true;
            }
            // 회차 체크
            if (!REQUIRED_REGEX.test(saveObj.ordinal)) {
                errList.push({
                    field: 'ordinal',
                    reason: '',
                });
                isInvalid = isInvalid || true;
            }
            // 제목 체크
            if (!REQUIRED_REGEX.test(saveObj.pageTitle)) {
                errList.push({
                    field: 'pageTitle',
                    reason: '',
                });
                isInvalid = isInvalid || true;
            }
            // pcUrl 체크
            if (!REQUIRED_REGEX.test(saveObj.pcUrl)) {
                errList.push({
                    field: 'pcUrl',
                    reason: '',
                });
                isInvalid = isInvalid || true;
            }
            // mobUrl 체크
            if (!REQUIRED_REGEX.test(saveObj.mobUrl)) {
                errList.push({
                    field: 'mobUrl',
                    reason: '',
                });
                isInvalid = isInvalid || true;
            }
            // 이미지 체크 (기존 이미지, fileValue 둘 다 없으면 에러)
            if (!saveObj.imgUrl && !saveObj.thumbnailFile) {
                errList.push({
                    field: 'imgUrl',
                    reason: '',
                });
                isInvalid = isInvalid || true;
            }
            // 시작일, 종료일 체크 (필수로 존재, 종료일이 시작일보다 뒷날이어야함)
            if (!saveObj.pageSdate) {
                errList.push({
                    field: 'pageSdate',
                    reason: '',
                });
                isInvalid = isInvalid || true;
            }
            if (!saveObj.pageEdate || Number(saveObj.pageSdate) > Number(saveObj.pageEdate)) {
                errList.push({
                    field: 'pageEdate',
                    reason: '',
                });
                isInvalid = isInvalid || true;
            }

            dispatch(changeInvalidList(errList));
            return !isInvalid;
        },
        [dispatch],
    );

    /**
     * 저장
     */
    const handleClickSave = useCallback(() => {
        let saveObj = {
            ...temp,
            pageSdate: temp.pageSdate.isValid() ? moment(temp.pageSdate).format('YYYYMMDD') : null,
            pageEdate: temp.pageEdate.isValid() ? moment(temp.pageEdate).format('YYYYMMDD') : null,
            thumbnailFile: fileValue,
        };
        if (validate(saveObj)) {
            dispatch(
                saveSpecial({
                    special: saveObj,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            currentDate = moment().format('YYYYMMDDHHmmss');
                            toast.success(header.message);
                            history.push(`/special/${body.seqNo}`);
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        }
    }, [dispatch, fileValue, history, temp, validate]);

    /**
     * 이미지삭제
     */
    const deleteImage = () => {
        imgFileRef.current.deleteFile();
        setTemp({ ...temp, imgUrl: null });
    };

    useEffect(() => {
        if (seqNo) {
            dispatch(
                getSpecial({
                    seqNo,
                }),
            );
        } else {
            dispatch(clearSpecial());
        }
    }, [dispatch, seqNo]);

    useEffect(() => {
        if (!depts) {
            dispatch(getSpecialDeptList());
        }
    }, [depts, dispatch]);

    useEffect(() => {
        if (special.seqNo) {
            setArticleUrl(`${DIGITAL_SPECIAL_URL}${special.seqNo}`);
        }
    }, [special.seqNo]);

    useEffect(() => {
        let btns = [
            { text: '저장', variant: 'positive', onClick: handleClickSave, className: 'mr-2' },
            { text: '취소', variant: 'negative', onClick: handleClickCancle },
        ];
        if (special.seqNo) {
            btns.push({ text: '삭제', variant: 'negative', onClick: handleClickDelete, className: 'ml-2' });
        }
        setFooterBtns(btns);
    }, [handleClickCancle, handleClickDelete, handleClickSave, special.seqNo]);

    useEffect(() => {
        setTemp({
            ...special,
            pageSdate: moment(special.pageSdate, 'YYYYMMDD'),
            pageEdate: moment(special.pageEdate, 'YYYYMMDD'),
        });
    }, [special]);

    useEffect(() => {
        setError(
            invalidList.reduce(
                (all, c) => ({
                    ...all,
                    [c.field]: true,
                }),
                {},
            ),
        );
    }, [invalidList]);

    useEffect(() => {
        return () => {
            dispatch(changeInvalidList([]));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaCard
            width={738}
            loading={loading}
            titleAs={
                <div className="w-100 d-flex">
                    <p className="m-0 h5 font-weight-bold">디지털 스페셜 페이지 {special.seqNo ? '수정' : '등록'}</p>
                    <p className="m-0 pl-2 ft-12 text-positive">(등록 완료 후 스크립트 오류 체크 꼭 해주세요)</p>
                </div>
            }
            headerClassName="border-bottom"
            titleClassName="mb-0"
            footerClassName="justify-content-center border-top"
            footerButtons={footerBtns}
            footer
        >
            <Form>
                <Form.Row>
                    {/* 이미지등록 */}
                    <Col xs={4} className="p-0 pr-4 d-flex flex-column">
                        <p className="mb-1 ft-12 ml-1">
                            <span className="required-text">*</span>이미지 등록(290*180)
                        </p>
                        <MokaImageInput
                            width={205}
                            height={166}
                            ref={imgFileRef}
                            img={temp.imgUrl ? `${temp.imgUrl}?${currentDate}` : null}
                            setFileValue={setFileValue}
                            isInvalid={error.imgUrl}
                            onChange={() => setError({ ...error, imgUrl: false })}
                        />
                        <Form.Row className="d-flex justify-content-between mt-2">
                            <Button variant="negative" size="sm" onClick={deleteImage}>
                                삭제
                            </Button>
                            <Button variant="outline-neutral" size="sm">
                                편집
                            </Button>
                        </Form.Row>
                    </Col>
                    {/* 사용여부/검색여부/리스트노출 */}
                    <Col xs={8} className="p-0 d-flex flex-column">
                        <Form.Row className="d-flex align-items-center justify-content-between mb-3">
                            <Col xs={4} className="p-0">
                                <MokaInputLabel
                                    label="사용여부"
                                    labelWidth={72}
                                    className="mb-0"
                                    labelClassName="mr-3 ft-12"
                                    as="switch"
                                    name="usedYn"
                                    id="usedYn-switch"
                                    inputProps={{ checked: temp.usedYn === 'Y' }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={4} className="p-0">
                                <MokaInputLabel
                                    label="검색여부"
                                    labelWidth={72}
                                    className="mb-0"
                                    labelClassName="mr-3 ft-12"
                                    as="switch"
                                    name="schYn"
                                    id="schYn-switch"
                                    inputProps={{ checked: temp.schYn === 'Y' }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                            <Col xs={4} className="p-0">
                                <MokaInputLabel
                                    label="리스트 노출"
                                    labelWidth={72}
                                    className="mb-0"
                                    labelClassName="mr-3 ft-12"
                                    as="switch"
                                    name="listYn"
                                    id="listYn-switch"
                                    inputProps={{ checked: temp.listYn === 'Y' }}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                        </Form.Row>
                        {/* 페이지코드/회차 */}
                        <Form.Row className="mb-3">
                            <Col xs={7} className="p-0 pr-3">
                                <MokaInputLabel
                                    label="페이지 코드"
                                    labelWidth={72}
                                    className="m-0"
                                    labelClassName="mr-3 ft-12"
                                    as="select"
                                    name="pageCd"
                                    value={temp.pageCd}
                                    onChange={handleChangeValue}
                                    isInvalid={error.pageCd}
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
                            <Col xs={5} className="p-0">
                                <MokaInputLabel
                                    label="회차"
                                    labelWidth={50}
                                    className="m-0"
                                    labelClassName="mr-3 ft-12"
                                    name="ordinal"
                                    required
                                    value={temp.ordinal}
                                    isInvalid={error.ordinal}
                                    onChange={handleChangeValue}
                                />
                            </Col>
                        </Form.Row>
                        {/* 검색키워드 */}
                        <Form.Row className="mb-3">
                            <MokaInputLabel label="검색 키워드" labelWidth={72} className="mb-3" labelClassName="mr-3 ft-12" as="none" />
                            <div className="w-100 d-flex flex-column">
                                <MokaInput name="schKwd" className="mb-1" value={temp.schKwd} onChange={handleChangeValue} />
                                <p className="m-0 ft-12 text-danger">*&nbsp;""포함, 특수문자 사용금지</p>
                            </div>
                        </Form.Row>
                        {/* 제목 */}
                        <Form.Row className="mb-3">
                            <MokaInputLabel label="제목" labelWidth={72} className="mb-3" labelClassName="mr-3 ft-12" required as="none" />
                            <div className="w-100 d-flex flex-column">
                                <MokaInput name="pageTitle" className="mb-1" value={temp.pageTitle} isInvalid={error.pageTitle} onChange={handleChangeValue} />
                                <p className="m-0 ft-12 text-danger">*&nbsp;""포함, 특수문자 사용금지</p>
                            </div>
                        </Form.Row>
                        {/* 서비스시작일/서비스종료일 */}
                        <Form.Row className="mb-3">
                            <Col xs={6} className="p-0 pr-2">
                                <MokaInputLabel
                                    label="서비스 시작일"
                                    as="dateTimePicker"
                                    labelWidth={72}
                                    className="mb-0"
                                    labelClassName="mr-3 ft-12"
                                    name="pageSdate"
                                    inputProps={{ timeFormat: null, inputClassName: 'ft-12' }}
                                    value={temp.pageSdate}
                                    onChange={handleChangeSdate}
                                    isInvalid={error.pageSdate}
                                    required
                                />
                            </Col>
                            <Col xs={6} className="p-0">
                                <MokaInputLabel
                                    label="서비스 종료일"
                                    as="dateTimePicker"
                                    labelWidth={72}
                                    className="m-0"
                                    labelClassName="mr-3 ft-12"
                                    name="pageEdate"
                                    inputProps={{ timeFormat: null, inputClassName: 'ft-12' }}
                                    value={temp.pageEdate}
                                    onChange={handleChangeEdate}
                                    isInvalid={error.pageEdate}
                                    required
                                />
                            </Col>
                        </Form.Row>
                    </Col>
                </Form.Row>
                {/* PC URL */}
                <MokaInputLabel
                    label="PC URL"
                    labelWidth={110}
                    labelClassName="mr-3 ft-12"
                    className="mb-3"
                    name="pcUrl"
                    value={temp.pcUrl}
                    onChange={handleChangeValue}
                    isInvalid={error.pcUrl}
                    required
                />
                {/* Mob URL */}
                <MokaInputLabel
                    label="Mobile URL"
                    labelWidth={110}
                    labelClassName="mr-3 ft-12"
                    className="mb-3"
                    name="mobUrl"
                    value={temp.mobUrl}
                    onChange={handleChangeValue}
                    isInvalid={error.mobUrl}
                    required
                />
                {/* 중계페이지 URL */}
                <MokaInputGroup
                    label="중계페이지 URL"
                    labelWidth={110}
                    labelClassName="mr-3 ft-12"
                    value={articleUrl}
                    className="mb-3"
                    append={<MokaCopyTextButton copyText={articleUrl} />}
                    disabled
                />
                {/* 광고추적 PC URL */}
                <MokaInputLabel
                    label="광고추척 PC URL"
                    labelWidth={110}
                    labelClassName="mr-3 ft-12"
                    className="mb-3"
                    placeholder={`입력이 없을 경우 공통 소스로 수정됩니다. ex) http://dgate.opap.co.kr/imp/?ssn=566&adsn=7478&cresn=5362`}
                    name="joinsAdTag"
                    value={temp.joinsAdTag}
                    onChange={handleChangeValue}
                />
                {/* 광고추적 Mobile URL */}
                <MokaInputLabel
                    label="광고추적 Mobile URL"
                    labelWidth={110}
                    labelClassName="mr-3 ft-12"
                    className="mb-3"
                    placeholder={`입력이 없을 경우 공통 소스로 수정됩니다. ex) http://dgate.opap.co.kr/imp/?ssn=566&adsn=7478&cresn=5362`}
                    name="joinsAdTagMob"
                    value={temp.joinsAdTagMob}
                    onChange={handleChangeValue}
                />
                {/* 구글 웹로그 코드 */}
                <MokaInputLabel
                    label="구글 웹로그 코드"
                    labelWidth={110}
                    labelClassName="mr-3 ft-12"
                    className="mb-3"
                    placeholder={`입력이 없을 경우 공통 소스로 수정됩니다. ex) UA-40895666-10`}
                    name="googleTag"
                    value={temp.googleTag}
                    onChange={handleChangeValue}
                />
                {/* 페이지 설명 */}
                <MokaInputLabel
                    label={
                        <>
                            페이지 설명 <br />
                            <br />
                            <p className="p-0 m-0 text-danger">
                                *&nbsp;&#39;&quot;포함 <br /> 특수문자 사용금지
                            </p>
                        </>
                    }
                    as="textarea"
                    labelWidth={110}
                    className="mb-3"
                    inputProps={{ rows: 3 }}
                    labelClassName="mr-3 ft-12"
                    name="pageDesc"
                    value={temp.pageDesc}
                    onChange={handleChangeValue}
                />
                {/* 부서명 */}
                <Form.Row className="mb-3">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            label="부서명"
                            labelWidth={110}
                            className="m-0"
                            labelClassName="mr-3 ft-12"
                            name="repDeptName"
                            value={temp.repDeptName}
                            onChange={handleChangeValue}
                            disabled={temp.repDeptNameSelect !== 'self'}
                        />
                    </Col>
                    <Col xs={2} className="p-0 pl-2">
                        <MokaInput as="select" name="repDeptNameSelect" value={temp.repDeptNameSelect} onChange={handleChangeValue}>
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
                <Form.Row className="mb-3">
                    <Col xs={4} className="p-0 pr-2">
                        <MokaInputLabel
                            label="개발 담당자 이름"
                            className="m-0"
                            labelWidth={110}
                            labelClassName="mr-3 ft-12"
                            name="devName"
                            value={temp.devName}
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
                            value={temp.devEmail}
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={3} className="p-0 pl-2">
                        <MokaInputLabel
                            label="전화번호"
                            labelWidth={70}
                            className="m-0"
                            labelClassName="mr-3 ft-12"
                            name="devPhone"
                            value={temp.devPhone}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>
                {special.seqNo && (
                    <React.Fragment>
                        {/* 등록 정보 */}
                        <Form.Row className="mb-3">
                            <Col xs={4} className="p-0">
                                <MokaInputLabel
                                    label="등록자"
                                    labelWidth={110}
                                    className="m-0"
                                    labelClassName="mr-3 ft-12"
                                    name="regId"
                                    value={temp.regId}
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
                                    value={temp.regDt}
                                    inputProps={{ plaintext: true, readOnly: true }}
                                />
                            </Col>
                        </Form.Row>
                        {/* 수정 정보 */}
                        <Form.Row className="mb-3">
                            <Col xs={4} className="p-0">
                                <MokaInputLabel
                                    label="수정자"
                                    labelWidth={110}
                                    className="m-0"
                                    labelClassName="mr-3 ft-12"
                                    name="modId"
                                    value={temp.modId}
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
                                    value={temp.modDt}
                                    inputProps={{ plaintext: true, readOnly: true }}
                                />
                            </Col>
                        </Form.Row>
                    </React.Fragment>
                )}
            </Form>
        </MokaCard>
    );
};

export default SpecialEdit;
