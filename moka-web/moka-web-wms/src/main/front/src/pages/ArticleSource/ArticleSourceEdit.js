import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@/components';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { getArticleSource, clearArticleSource, changeInvalidList } from '@store/articleSource';

const testReg = /[^a-zA-Z]{1,10}/;

const ArticleSourceEdit = (props) => {
    const { handleClickSave } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const { sourceCode } = useParams();

    const source = useSelector((store) => store.articleSource.source);
    const invalidList = useSelector((store) => store.articleSource.invalidList);

    const [temp, setTemp] = useState({});
    const [error, setError] = useState({});

    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (
            name === 'artEditYn' ||
            name === 'rcvUsedYn' ||
            name === 'joongangUse' ||
            name === 'jstoreUse' ||
            name === 'consalesUse' ||
            name === 'ilganUse' ||
            name === 'socialUse'
        ) {
            setTemp({ ...temp, [name]: checked ? 'Y' : 'N' });
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
                    reason: '',
                });
                isInvalid = isInvalid || true;
            }
            // 매체타입 체크
            if (!temp.sourceType || !REQUIRED_REGEX.test(temp.sourceType)) {
                errList.push({
                    field: 'sourceType',
                    reason: '',
                });
                isInvalid = isInvalid || true;
            }
            // 매체코드 체크
            if (!temp.sourceCode || !REQUIRED_REGEX.test(temp.sourceCode)) {
                errList.push({
                    field: 'sourceCode',
                    reason: '',
                });
                isInvalid = isInvalid || true;
            }
            // 서버구분 체크
            if (testReg.test(temp.serverGubun)) {
                errList.push({
                    field: 'serverGubun',
                    reason: '',
                });
                isInvalid = isInvalid || true;
            }

            dispatch(changeInvalidList(errList));
            return !isInvalid;
        },
        [dispatch],
    );

    useEffect(() => {
        if (sourceCode) {
            dispatch(getArticleSource({ sourceCode }));
        } else {
            dispatch(clearArticleSource());
        }
    }, [dispatch, sourceCode]);

    useEffect(() => {
        setTemp(source);
    }, [source]);

    // useEffect(() => {
    //     if (validate(temp)) handleClickSave(temp);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

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
                                label="소스코드"
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
                            <Button variant="outline-table-btn">중복 확인</Button>
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
                                label="매체 타입"
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
                    <Form.Row className="mb-3" style={{ height: 31 }}>
                        <MokaInputLabel
                            label="편집 필요여부"
                            labelWidth={160}
                            labelClassName="mr-3 ft-12"
                            className="mb-0"
                            as="switch"
                            name="artEditYn"
                            id="switch1"
                            inputProps={{ custom: true, checked: temp.artEditYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Form.Row>
                    <Form.Row className="mb-3" style={{ height: 31 }}>
                        <MokaInputLabel
                            label="사용여부"
                            labelWidth={160}
                            labelClassName="mr-3 ft-12"
                            className="mb-0"
                            as="switch"
                            name="rcvUsedYn"
                            id="switch2"
                            inputProps={{ custom: true, checked: temp.rcvUsedYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Form.Row>
                    <Form.Row className="mb-3" style={{ height: 31 }}>
                        <MokaInputLabel
                            label="중앙 사용여부"
                            labelWidth={160}
                            labelClassName="mr-3 ft-12"
                            className="mb-0"
                            as="switch"
                            name="joongangUse"
                            id="switch3"
                            inputProps={{ custom: true, checked: temp.joongangUse === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Form.Row>
                    <Form.Row className="mb-3" style={{ height: 31 }}>
                        <MokaInputLabel
                            label="JSTORE 사용여부"
                            labelWidth={160}
                            labelClassName="mr-3 ft-12"
                            className="mb-0"
                            as="switch"
                            name="jstoreUse"
                            id="switch4"
                            inputProps={{ custom: true, checked: temp.jstoreUse === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Form.Row>
                    <Form.Row className="mb-3" style={{ height: 31 }}>
                        <MokaInputLabel
                            label="CONSALES 사용여부"
                            labelWidth={160}
                            labelClassName="mr-3 ft-12"
                            className="mb-0"
                            as="switch"
                            name="consalesUse"
                            id="switch5"
                            inputProps={{ custom: true, checked: temp.consalesUse === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Form.Row>
                    <Form.Row className="mb-3" style={{ height: 31 }}>
                        <MokaInputLabel
                            label="일간 사용여부"
                            labelWidth={160}
                            labelClassName="mr-3 ft-12"
                            className="mb-0"
                            as="switch"
                            name="ilganUse"
                            id="switch6"
                            inputProps={{ custom: true, checked: temp.ilganUse === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Form.Row>
                    <Form.Row className="mb-3" style={{ height: 31 }}>
                        <MokaInputLabel
                            label="소셜 전송여부"
                            labelWidth={160}
                            labelClassName="mr-3 ft-12"
                            className="mb-0"
                            as="switch"
                            name="socialUse"
                            id="switch7"
                            inputProps={{ custom: true, checked: temp.socialUse === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Form.Row>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default ArticleSourceEdit;
