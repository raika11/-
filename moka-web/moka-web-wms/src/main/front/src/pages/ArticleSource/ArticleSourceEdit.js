import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import toast from '@utils/toastUtil';
import { MokaInputLabel } from '@/components';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { invalidListToError } from '@utils/convertUtil';
import { messageBox } from '@utils/toastUtil';
import CodeMappingModal from './modals/CodeMappingModal';
import { getArticleSource, clearArticleSource, saveArticleSource, changeInvalidList, getSourceDuplicateCheck } from '@store/articleSource';

/**
 * 수신 매체 편집
 */
const ArticleSourceEdit = forwardRef((props, ref) => {
    const { match } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const { sourceCode } = useParams();

    const source = useSelector((store) => store.articleSource.source);
    const invalidList = useSelector((store) => store.articleSource.invalidList);

    const [temp, setTemp] = useState({});
    const [disabledBtn, setDisabledBtn] = useState(false);
    const [error, setError] = useState({});
    const [show, setShow] = useState(false);

    /**
     * validate
     * @param {object} save obj
     */
    const validate = useCallback(
        (obj) => {
            let isInvalid = false,
                errList = [];

            // 매체명 체크
            if (!obj.sourceName || !REQUIRED_REGEX.test(obj.sourceName)) {
                errList.push({
                    field: 'sourceName',
                    reason: '매체명은 필수 입력값입니다.',
                });
                isInvalid = isInvalid || true;
            }
            // 매체 타입 체크
            if (!obj.sourceType || !/^[a-zA-Z0-9\s]{1,5}$/.test(obj.sourceType)) {
                errList.push({
                    field: 'sourceType',
                    reason: '매체 타입은 필수 입력값입니다. (영문 5자리 이하 입력)',
                });
                isInvalid = isInvalid || true;
            }
            // 매체 코드 체크
            if (!obj.sourceCode || !/^[a-zA-Z0-9]{1,2}$/.test(obj.sourceCode)) {
                errList.push({
                    field: 'sourceCode',
                    reason: '매체 코드는 필수 입력값입니다. (영문, 숫자 2자리 이하 입력)',
                });
                isInvalid = isInvalid || true;
            }
            // 서버 구분 체크
            if (obj.serverGubun) {
                if (!/^[a-zA-Z0-9]{1,10}/.test(obj.serverGubun)) {
                    errList.push({
                        field: 'serverGubun',
                        reason: '서버 구분을 10자리 이하로 입력하세요.',
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
     * 매체 코드 유효성 체크 후 저장
     */
    const checkSaveSource = useCallback(() => {
        const saveObj = { ...temp, add: sourceCode ? false : true };

        if (!sourceCode) {
            if (validate(saveObj)) {
                if (saveObj.add === true && disabledBtn === false) {
                    toast.warning('매체 코드 중복 검사를 해주세요');
                } else {
                    dispatch(
                        saveArticleSource({
                            source: saveObj,
                            callback: ({ header, body }) => {
                                if (header.success) {
                                    toast.success(header.message);
                                    history.push(`${match.path}/${body.sourceCode}`);
                                } else {
                                    toast.fail(header.message);
                                }
                            },
                        }),
                    );
                }
            }
        }
    }, [disabledBtn, dispatch, history, match.path, sourceCode, temp, validate]);

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
     * 매체 코드의 중복 체크
     */
    const checkDuplicatedSource = () => {
        if (!temp.sourceCode) {
            messageBox.alert('중복검사할 매체 코드가 존재하지 않습니다.');
        } else {
            dispatch(
                getSourceDuplicateCheck({
                    sourceCode: temp.sourceCode,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            // 중복 없음
                            if (!body) {
                                toast.success('사용할 수 있는 매체 코드입니다.');
                                setDisabledBtn(true);
                            }
                            // 중복 있음
                            else {
                                toast.fail('중복된 매체 코드입니다.');
                            }
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        }
    };

    useImperativeHandle(
        ref,
        () => ({
            onSave: checkSaveSource,
            onMapping: () => {
                setShow(true);
            },
        }),
        [checkSaveSource],
    );

    useEffect(() => {
        if (sourceCode) {
            dispatch(getArticleSource({ sourceCode }));
        } else {
            dispatch(clearArticleSource());
        }
    }, [dispatch, sourceCode]);

    useEffect(() => {
        if (source) {
            let obj = { ...source };
            Object.keys(obj).forEach((k) => {
                if (obj[k] === ' ') {
                    obj[k] = 'N';
                } else if (!obj['jstoreUse']) {
                    obj['jstoreUse'] = 'N';
                } else if (!obj['consalesUse']) {
                    obj['consalesUse'] = 'N';
                } else if (!obj['joongangUse']) {
                    obj['joongangUse'] = 'N';
                } else if (!obj['socialUse']) {
                    obj['socialUse'] = 'N';
                } else if (!obj['ilganUse']) {
                    obj['ilganUse'] = 'N';
                }
                setTemp(obj);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
        if (invalidList !== null && invalidList.length > 0) {
            messageBox.alert(invalidList[0].reason, () => {});
        }
    }, [invalidList]);

    useEffect(() => {
        return () => {
            dispatch(changeInvalidList([]));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Form className="mb-2">
                <Form.Row>
                    <Col xs={6} className="p-0">
                        <Form.Row className="mb-2">
                            <Col xs={9} className="p-0">
                                <MokaInputLabel
                                    label="매체(CP)명"
                                    labelWidth={110}
                                    value={temp.sourceName}
                                    name="sourceName"
                                    onChange={handleChangeValue}
                                    isInvalid={error.sourceName}
                                    required
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2 align-items-center">
                            <Col xs={6} className="p-0">
                                <MokaInputLabel
                                    label="매체 코드"
                                    labelWidth={110}
                                    className="mr-2"
                                    value={temp.sourceCode}
                                    name="sourceCode"
                                    onChange={handleChangeValue}
                                    isInvalid={error.sourceCode}
                                    inputProps={{ plaintext: sourceCode ? true : false, readOnly: sourceCode ? true : false }}
                                    required
                                />
                            </Col>
                            <Col xs={3} className="p-0">
                                {!sourceCode && (
                                    <Button variant="outline-table-btn" onClick={checkDuplicatedSource} disabled={disabledBtn}>
                                        중복 확인
                                    </Button>
                                )}
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={9} className="p-0">
                                <MokaInputLabel label="CP 관리자" labelWidth={110} value={temp.cpAdmin} name="cpAdmin" onChange={handleChangeValue} />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={9} className="p-0">
                                <MokaInputLabel label="CP 연락처" labelWidth={110} value={temp.cpPhone} name="cpPhone" onChange={handleChangeValue} />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={9} className="p-0">
                                <MokaInputLabel label="CP 메일" labelWidth={110} value={temp.cpEmail} name="cpEmail" onChange={handleChangeValue} />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={9} className="p-0">
                                <MokaInputLabel label="XML포맷 출처" labelWidth={110} as="select" value={temp.joinsXmlFormat} name="joinsXmlFormat" onChange={handleChangeValue}>
                                    <option value="Y">조인스</option>
                                    <option value="N">CP 업체</option>
                                </MokaInputLabel>
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={9} className="p-0">
                                <MokaInputLabel label="본문 이미지" labelWidth={110} as="select" value={temp.receiveImgYn} name="receiveImgYn" onChange={handleChangeValue}>
                                    <option value="Y">이미지 FTP 수신</option>
                                    <option value="N">외부 이미지</option>
                                </MokaInputLabel>
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={11} className="p-0">
                                <MokaInputLabel label="업체 IP 정보(구분)" labelWidth={110} value={temp.cpRegIp} name="cpRegIp" onChange={handleChangeValue} />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={11} className="p-0">
                                <MokaInputLabel label="FTP 경로" labelWidth={110} value={temp.cpXmlPath} name="cpXmlPath" onChange={handleChangeValue} />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={11} className="p-0">
                                <MokaInputLabel label="기본 URL" labelWidth={110} value={temp.sourceBaseurl} name="sourceBaseurl" onChange={handleChangeValue} />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={11} className="p-0">
                                <MokaInputLabel label="이미지 URL" labelWidth={110} value={temp.sourceImageUrl} name="sourceImageUrl" onChange={handleChangeValue} />
                            </Col>
                        </Form.Row>
                    </Col>
                    <Col xs={6} className="p-0">
                        <Form.Row className="mb-2">
                            <Col xs={9} className="p-0">
                                <MokaInputLabel
                                    label="매체 타입"
                                    labelWidth={110}
                                    value={temp.sourceType}
                                    name="sourceType"
                                    onChange={handleChangeValue}
                                    isInvalid={error.sourceType}
                                    required
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={9} className="p-0">
                                <MokaInputLabel
                                    label="서버 구분"
                                    labelWidth={110}
                                    value={temp.serverGubun}
                                    name="serverGubun"
                                    onChange={handleChangeValue}
                                    isInvalid={error.serverGubun}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={9} className="p-0">
                                <MokaInputLabel label="매체 기타" labelWidth={110} value={temp.sourceEtc} name="sourceEtc" onChange={handleChangeValue} />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={9} className="p-0">
                                <MokaInputLabel label="내부관리자" labelWidth={110} value={temp.localAdmin} name="localAdmin" onChange={handleChangeValue} />
                            </Col>
                        </Form.Row>
                        <div className="d-flex flex-column justify-content-between" style={{ height: 265 }}>
                            <MokaInputLabel
                                label="편집 필요 여부"
                                labelWidth={110}
                                as="switch"
                                name="artEditYn"
                                id="switch-artEditYn"
                                inputProps={{ custom: true, checked: temp.artEditYn === 'Y' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInputLabel
                                label="CP수신 여부"
                                labelWidth={110}
                                as="switch"
                                name="rcvUsedYn"
                                id="switch-rcvUsedYn"
                                inputProps={{ custom: true, checked: temp.rcvUsedYn === 'Y' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInputLabel
                                label="벌크 여부"
                                labelWidth={110}
                                as="switch"
                                name="bulkFlag"
                                id="switch-bulkFlag"
                                inputProps={{ custom: true, checked: temp.bulkFlag === 'Y' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInputLabel
                                label="중앙 사용 여부"
                                labelWidth={110}
                                as="switch"
                                name="joongangUse"
                                id="switch-joongangUse"
                                inputProps={{ custom: true, checked: temp.joongangUse === 'Y' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInputLabel
                                label="JSTORE 사용 여부"
                                labelWidth={110}
                                as="switch"
                                name="jstoreUse"
                                id="switch-jstoreUse"
                                inputProps={{ custom: true, checked: temp.jstoreUse === 'Y' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInputLabel
                                label="CONSALES 사용 여부"
                                labelWidth={110}
                                as="switch"
                                name="consalesUse"
                                id="switch-consalesUse"
                                inputProps={{ custom: true, checked: temp.consalesUse === 'Y' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInputLabel
                                label="일간 사용 여부"
                                labelWidth={110}
                                as="switch"
                                name="ilganUse"
                                id="switch-ilganUse"
                                inputProps={{ custom: true, checked: temp.ilganUse === 'Y' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInputLabel
                                label="소셜 전송 여부"
                                labelWidth={110}
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
            <div className="p-3 input-border">
                <p className="mb-2 h4 color-positive">** 신규 매체 추가시 작업 순서</p>
                <p className="mb-0">1. 데이터 수신을 위한 계정 설정 및 FTP 가상디렉토리 추가</p>
                <p className="mb-0">2. 업체 아이디명의 가상디렉토리 설정 FTP 접근포트는 가능하면 8021로 설정</p>
                <p className="mb-2">3. 업체에서 접근할 IP를 확인하고 시스템팀에 방화벽 오픈 요청</p>
                <p className="mb-0">...</p>
            </div>
            <CodeMappingModal show={show} onHide={() => setShow(false)} data={temp} />
        </>
    );
});

export default ArticleSourceEdit;
