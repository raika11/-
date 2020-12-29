import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import toast from '@utils/toastUtil';
import { MokaInputLabel } from '@/components';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { getArticleSource, clearArticleSource, saveArticleSource, changeInvalidList, getSourceDuplicateCheck } from '@store/articleSource';
import CodeMappingModal from './modals/CodeMappingModal';

/**
 * 수신 매체 편집
 */
const ArticleSourceEdit = (props) => {
    const { location, clickMapping, setClickMapping, clickSave, setClickSave } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const { sourceCode } = useParams();

    const source = useSelector((store) => store.articleSource.source);
    const invalidList = useSelector((store) => store.articleSource.invalidList);

    const [addParam, setAddParam] = useState(false);
    const [temp, setTemp] = useState({});
    const [disabledBtn, setDisabledBtn] = useState(false);
    const [error, setError] = useState({});
    const [show, setShow] = useState(false);

    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (
            name === 'artEditYn' ||
            name === 'rcvUsedYn' ||
            name === 'joongangUse' ||
            name === 'jstoreUse' ||
            name === 'consalesUse' ||
            name === 'ilganUse' ||
            name === 'socialUse' ||
            name === 'bulkFlag'
        ) {
            setTemp({ ...temp, [name]: checked ? 'Y' : 'N' });
        } else if (name === 'sourceCode') {
            setTemp({ ...temp, sourceCode: value });

            if (temp.sourceCode !== value) {
                setDisabledBtn(false);
            }
        } else {
            setTemp({ ...temp, [name]: value });
        }

        // error 제거
        if (error[name] === true) setError({ ...error, [name]: false });
    };

    /**
     * validate
     * @param {object} temp validate target
     */
    const validate = useCallback(
        (temp) => {
            let isInvalid = false,
                errList = [];

            // 매체명 체크
            if (!temp.sourceName || !REQUIRED_REGEX.test(temp.sourceName)) {
                errList.push({
                    field: 'sourceName',
                    reason: '매체명을 입력하세요.',
                });
                isInvalid = isInvalid || true;
            }
            // 매체타입 체크
            if (!temp.sourceType || !/^[a-zA-Z0-9]{1,5}$/.test(temp.sourceType)) {
                errList.push({
                    field: 'sourceType',
                    reason: '매체타입을 5자리 이하로 입력하세요.',
                });
                isInvalid = isInvalid || true;
            }
            // 매체코드 체크
            if (!temp.sourceCode || !/^[a-zA-Z0-9]{1,2}$/.test(temp.sourceCode)) {
                errList.push({
                    field: 'sourceCode',
                    reason: '매체코드를 2자리 이하로 입력하세요.',
                });
                isInvalid = isInvalid || true;
            }
            // 서버구분 체크
            if (temp.serverGubun) {
                if (!/^[a-zA-Z]{1,10}/.test(temp.serverGubun)) {
                    errList.push({
                        field: 'serverGubun',
                        reason: '서버구분을 10자리 이하로 입력하세요.',
                    });
                    isInvalid = isInvalid || true;
                }
            }

            dispatch(changeInvalidList(errList));
            return !isInvalid;
        },
        [dispatch],
    );

    /**
     * 매체코드의 중복체크
     */
    const checkDuplicatedSource = () => {
        dispatch(
            getSourceDuplicateCheck({
                sourceCode: temp.sourceCode,
                callback: ({ header, body }) => {
                    if (header.success) {
                        // 중복 없음
                        if (!body) {
                            toast.success('사용할 수 있는 매체코드입니다.');
                            setDisabledBtn(true);
                        }
                        // 중복 있음
                        else {
                            toast.fail('중복된 매체코드입니다.');
                        }
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    useEffect(() => {
        if (sourceCode) {
            dispatch(getArticleSource({ sourceCode }));
        } else {
            dispatch(clearArticleSource());
        }
    }, [dispatch, sourceCode]);

    useEffect(() => {
        if (location.pathname.lastIndexOf('add') > -1) {
            setAddParam(true);
        }
    }, [location.pathname]);

    useEffect(() => {
        setTemp(source);
    }, [source]);

    useEffect(() => {
        if (clickMapping) {
            setShow(true);
        }
        setClickMapping(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clickMapping]);

    useEffect(() => {
        if (clickSave) {
            let obj = {
                ...temp,
                add: addParam,
            };
            if (validate(obj)) {
                dispatch(
                    saveArticleSource({
                        source: obj,
                        callback: ({ header, body }) => {
                            if (header.success) {
                                toast.success(header.message);
                                history.push(`/article-sources/${body.sourceCode}`);
                            } else {
                                toast.fail(header.message);
                            }
                        },
                    }),
                );
            }
        }
        setClickSave(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clickSave]);

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
        <>
            <Form>
                <Form.Row>
                    <Col xs={6} className="p-0">
                        <Form.Row>
                            <Col xs={9} className="p-0">
                                <MokaInputLabel
                                    label="매체(CP)명"
                                    labelWidth={100}
                                    labelClassName="ft-12"
                                    inputClassName="ft-12"
                                    value={temp.sourceName}
                                    name="sourceName"
                                    onChange={handleChangeValue}
                                    isInvalid={error.sourceName}
                                    required
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={6} className="p-0">
                                <MokaInputLabel
                                    label="매체코드"
                                    labelWidth={100}
                                    labelClassName="ft-12"
                                    inputClassName="ft-12"
                                    className="mr-2"
                                    value={temp.sourceCode}
                                    name="sourceCode"
                                    onChange={handleChangeValue}
                                    isInvalid={error.sourceCode}
                                    required
                                />
                            </Col>
                            <Col xs={3} className="p-0">
                                <Button variant="outline-table-btn" onClick={checkDuplicatedSource} disabled={disabledBtn}>
                                    중복 확인
                                </Button>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={9} className="p-0">
                                <MokaInputLabel
                                    label="CP 관리자"
                                    labelWidth={100}
                                    labelClassName="ft-12"
                                    inputClassName="ft-12"
                                    value={temp.cpAdmin}
                                    name="cpAdmin"
                                    onChange={handleChangeValue}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={9} className="p-0">
                                <MokaInputLabel
                                    label="CP 연락처"
                                    labelWidth={100}
                                    labelClassName="ft-12"
                                    inputClassName="ft-12"
                                    value={temp.cpPhone}
                                    name="cpPhone"
                                    onChange={handleChangeValue}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={9} className="p-0">
                                <MokaInputLabel
                                    label="CP 메일"
                                    labelWidth={100}
                                    labelClassName="ft-12"
                                    inputClassName="ft-12"
                                    value={temp.cpEmail}
                                    name="cpEmail"
                                    onChange={handleChangeValue}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={8} className="p-0">
                                <MokaInputLabel
                                    label="XML포맷 출처"
                                    labelWidth={100}
                                    labelClassName="ft-12"
                                    inputClassName="ft-12"
                                    as="select"
                                    value={temp.joinsXmlFormat}
                                    name="joinsXmlFormat"
                                    onChange={handleChangeValue}
                                >
                                    <option value="Y">조인스</option>
                                    <option value="N">CP 업체</option>
                                </MokaInputLabel>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={8} className="p-0">
                                <MokaInputLabel
                                    label="본문 이미지"
                                    labelWidth={100}
                                    labelClassName="ft-12"
                                    inputClassName="ft-12"
                                    as="select"
                                    value={temp.receiveImgYn}
                                    name="receiveImgYn"
                                    onChange={handleChangeValue}
                                >
                                    <option value="Y">외부 이미지</option>
                                    <option value="N">이미지 FTP 수신</option>
                                </MokaInputLabel>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={11} className="p-0">
                                <MokaInputLabel
                                    label="업체 IP 정보(구분)"
                                    labelWidth={100}
                                    labelClassName="ft-12"
                                    inputClassName="ft-12"
                                    value={temp.cpRegIp}
                                    name="cpRegIp"
                                    onChange={handleChangeValue}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={11} className="p-0">
                                <MokaInputLabel
                                    label="FTP 경로"
                                    labelWidth={100}
                                    labelClassName="ft-12"
                                    inputClassName="ft-12"
                                    value={temp.cpXmlPath}
                                    name="cpXmlPath"
                                    onChange={handleChangeValue}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={11} className="p-0">
                                <MokaInputLabel
                                    label="기본 URL"
                                    labelWidth={100}
                                    labelClassName="ft-12"
                                    inputClassName="ft-12"
                                    value={temp.sourceBaseurl}
                                    name="sourceBaseurl"
                                    onChange={handleChangeValue}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={11} className="p-0">
                                <MokaInputLabel
                                    label="이미지 URL"
                                    labelWidth={100}
                                    labelClassName="ft-12"
                                    inputClassName="ft-12"
                                    value={temp.sourceImageUrl}
                                    name="sourceImageUrl"
                                    onChange={handleChangeValue}
                                />
                            </Col>
                        </Form.Row>
                    </Col>
                    <Col xs={6} className="p-0">
                        <Form.Row>
                            <Col xs={9} className="p-0">
                                <MokaInputLabel
                                    label="매체타입"
                                    labelWidth={100}
                                    labelClassName="ft-12"
                                    inputClassName="ft-12"
                                    value={temp.sourceType}
                                    name="sourceType"
                                    onChange={handleChangeValue}
                                    required
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={9} className="p-0">
                                <MokaInputLabel
                                    label="서버 구분"
                                    labelWidth={100}
                                    labelClassName="ft-12"
                                    inputClassName="ft-12"
                                    value={temp.serverGubun}
                                    name="serverGubun"
                                    onChange={handleChangeValue}
                                    isInvalid={error.serverGubun}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={9} className="p-0">
                                <MokaInputLabel
                                    label="매체 기타"
                                    labelWidth={100}
                                    labelClassName="ft-12"
                                    inputClassName="ft-12"
                                    value={temp.sourceEtc}
                                    name="sourceEtc"
                                    onChange={handleChangeValue}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={9} className="p-0">
                                <MokaInputLabel
                                    label="내부관리자"
                                    labelWidth={100}
                                    labelClassName="ft-12"
                                    inputClassName="ft-12"
                                    value={temp.localAdmin}
                                    name="localAdmin"
                                    onChange={handleChangeValue}
                                />
                            </Col>
                        </Form.Row>
                        <div className="d-flex flex-column justify-content-between" style={{ height: 310 }}>
                            <MokaInputLabel
                                label="편집 필요여부"
                                labelWidth={160}
                                labelClassName="mr-3 ft-12"
                                className="mb-0"
                                as="switch"
                                name="artEditYn"
                                id="switch-artEditYn"
                                inputProps={{ custom: true, checked: temp.artEditYn === 'Y' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInputLabel
                                label="CP수신여부"
                                labelWidth={160}
                                labelClassName="mr-3 ft-12"
                                className="mb-0"
                                as="switch"
                                name="rcvUsedYn"
                                id="switch-rcvUsedYn"
                                inputProps={{ custom: true, checked: temp.rcvUsedYn === 'Y' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInputLabel
                                label="벌크 여부"
                                labelWidth={160}
                                labelClassName="mr-3 ft-12"
                                className="mb-0"
                                as="switch"
                                name="bulkFlag"
                                id="switch-bulkFlag"
                                inputProps={{ custom: true, checked: temp.bulkFlag === 'Y' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInputLabel
                                label="중앙 사용여부"
                                labelWidth={160}
                                labelClassName="mr-3 ft-12"
                                className="mb-0"
                                as="switch"
                                name="joongangUse"
                                id="switch-joongangUse"
                                inputProps={{ custom: true, checked: temp.joongangUse === 'Y' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInputLabel
                                label="JSTORE 사용여부"
                                labelWidth={160}
                                labelClassName="mr-3 ft-12"
                                className="mb-0"
                                as="switch"
                                name="jstoreUse"
                                id="switch-jstoreUse"
                                inputProps={{ custom: true, checked: temp.jstoreUse === 'Y' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInputLabel
                                label="CONSALES 사용여부"
                                labelWidth={160}
                                labelClassName="mr-3 ft-12"
                                className="mb-0"
                                as="switch"
                                name="consalesUse"
                                id="switch-consalesUse"
                                inputProps={{ custom: true, checked: temp.consalesUse === 'Y' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInputLabel
                                label="일간 사용여부"
                                labelWidth={160}
                                labelClassName="mr-3 ft-12"
                                className="mb-0"
                                as="switch"
                                name="ilganUse"
                                id="switch-ilganUse"
                                inputProps={{ custom: true, checked: temp.ilganUse === 'Y' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInputLabel
                                label="소셜 전송여부"
                                labelWidth={160}
                                labelClassName="mr-3 ft-12"
                                className="mb-0"
                                as="switch"
                                name="socialUse"
                                id="switch-socialUse"
                                inputProps={{ custom: true, checked: temp.socialUse === 'Y' }}
                                onChange={handleChangeValue}
                            />
                        </div>
                    </Col>
                </Form.Row>
            </Form>
            <div className="p-2" style={{ border: '1px solid #e1e3eB' }}>
                <p className="ft-12 mb-2" style={{ color: 'red' }}>
                    ** 신규 매체 추가시 작업 순서
                </p>
                <p className="ft-12 mb-0">1. 데이터 수신을 위한 계정 설정 및 FTP 가상디렉토리 추가</p>
                <p className="ft-12 mb-0">2. 업체 아이디명의 가상디렉토리 설정 FTP 접근포트는 가능하면 8021로 설정</p>
                <p className="ft-12 mb-2">3. 업체에서 접근할 IP를 확인하고 시스템팀에 방화벽 오픈 요청</p>
                <p className="ft-12 mb-0">...</p>
            </div>
            <CodeMappingModal show={show} onHide={() => setShow(false)} data={temp} />
        </>
    );
};

export default ArticleSourceEdit;
