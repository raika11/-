import React, { useState, useEffect, useRef } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import toast from '@utils/toastUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { clearDomain, getDomain, saveDomain, changeDomain, duplicateCheck, changeInvalidList } from '@store/domain';
import { getApi, getLang } from '@store/codeMgt';
import { MokaInput, MokaInputLabel } from '@components';

/**
 * 도메인 상세/수정/등록
 * @param history rect-router-dom useHisotry
 */
const DomainEdit = ({ history, onDelete }) => {
    const { domainId: paramId } = useParams();
    const elLang = useRef();
    const elApiCodeId = useRef();

    // entity
    const [domainId, setDomainId] = useState('');
    const [domainName, setDomainName] = useState('');
    const [domainUrl, setDomainUrl] = useState('');
    const [usedYn, setUsedYn] = useState('Y');
    const [servicePlatform, setServicePlatform] = useState('P');
    const [lang, setLang] = useState('KR');
    const [apiCodeId, setApiCodeId] = useState('');
    const [description, setDescription] = useState('');

    // error
    const [domainIdError, setDomainIdError] = useState(false);
    const [domainNameError, setDomainNameError] = useState(false);
    const [domainUrlError, setDomainUrlError] = useState(false);

    // getter
    const { domain, langRows, apiRows, invalidList } = useSelector(
        (store) => ({
            domain: store.domain.domain,
            langRows: store.codeMgt.langRows,
            apiRows: store.codeMgt.apiRows,
            invalidList: store.domain.invalidList,
        }),
        shallowEqual,
    );
    const dispatch = useDispatch();

    /**
     * 각 항목별 값 변경
     * @param target javascript event.target
     */
    const handleChangeValue = ({ target }) => {
        const { name, value, checked } = target;
        if (name === 'domainId') {
            const regex = /^[0-9\b]+$/;
            if ((value === '' || regex.test(value)) && value.length <= 4) {
                setDomainId(value);
                setDomainIdError(false);
            }
        } else if (name === 'domainName') {
            setDomainName(value);
            setDomainNameError(false);
        } else if (name === 'domainUrl') {
            setDomainUrl(value);
            setDomainUrlError(false);
        } else if (name === 'servicePlatform') {
            setServicePlatform(value);
        } else if (name === 'lang') {
            setLang(value);
        } else if (name === 'description') {
            setDescription(value);
        } else if (name === 'apiCodeId') {
            setApiCodeId(value);
        } else if (name === 'useYN') {
            const usedValue = checked ? 'Y' : 'N';
            setUsedYn(usedValue);
        }
    };

    /**
     * 유효성 검사를 한다.
     * @param domain 도메인 정보를 가진 객체
     * @returns {boolean} 유효성 검사 결과
     */
    const validate = (domain) => {
        let isInvalid = false;
        let errList = [];

        // 도메인아이디체크
        if (!domain.domainId || domain.domainId === '') {
            errList.push({
                field: 'domainId',
                reason: '',
            });
            isInvalid = isInvalid | true;
        } else if (!/^\d{4}$/.test(domain.domainId)) {
            errList.push({
                field: 'domainId',
                reason: '',
            });
            isInvalid = isInvalid | true;
        }

        // 도메인명 체크
        if (!REQUIRED_REGEX.test(domain.domainName)) {
            errList.push({
                field: 'domainName',
                reason: '',
            });
            isInvalid = isInvalid | true;
        }

        // 도메인url 체크
        if (!REQUIRED_REGEX.test(domain.domainUrl)) {
            errList.push({
                field: 'domainUrl',
                reason: '',
            });
            isInvalid = isInvalid | true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    useEffect(() => {
        if (!langRows) dispatch(getLang());
        if (!apiRows) dispatch(getApi());
    }, [apiRows, dispatch, langRows]);

    useEffect(() => {
        if (paramId) {
            dispatch(getDomain(paramId));
        } else {
            dispatch(clearDomain());
        }
    }, [dispatch, paramId]);

    useEffect(() => {
        // 도메인 데이터 셋팅
        setDomainIdError(false);
        setDomainNameError(false);
        setDomainUrlError(false);
        setDomainId(domain.domainId || '');
        setDomainName(domain.domainName || '');
        setServicePlatform(domain.servicePlatform || 'P');
        setLang(domain.lang || (elLang.current[0] ? elLang.current[0].value : ''));
        setUsedYn(domain.usedYn || 'Y');
        setDomainUrl(domain.domainUrl || '');
        setApiCodeId(domain.apiCodeId || (elApiCodeId.current[0] ? elApiCodeId.current[0].value : ''));
        setDescription(domain.description || '');
    }, [domain]);

    /**
     * 도메인 수정
     * @param {object} tmp 도메인
     */
    const updateDomain = (tmp) => {
        dispatch(
            saveDomain({
                type: 'update',
                actions: [
                    changeDomain({
                        ...domain,
                        ...tmp,
                    }),
                ],
                callback: (response) => {
                    // 만약 response.header.message로 서버 메세지를 전달해준다면, 그 메세지를 보여준다.
                    if (response.header.success) {
                        toast.success('수정하였습니다.');
                    } else {
                        toast.fail('실패하였습니다.');
                    }
                },
            }),
        );
    };

    /**
     * 도메인 등록
     * @param {object} tmp 도메인
     */
    const insertDomain = (tmp) => {
        dispatch(
            duplicateCheck({
                domainId,
                callback: (response) => {
                    const { body } = response;

                    if (!body) {
                        dispatch(
                            saveDomain({
                                type: 'insert',
                                actions: [
                                    changeDomain({
                                        ...domain,
                                        ...tmp,
                                    }),
                                ],
                                callback: (response) => {
                                    if (response.header.success) {
                                        toast.success('등록하였습니다.');
                                        history.push(`/domain/${domainId}`);
                                    } else {
                                        toast.fail('실패하였습니다.');
                                    }
                                },
                            }),
                        );
                    } else {
                        toast.fail('중복된 도메인아이디가 존재합니다.');
                    }
                },
            }),
        );
    };

    /**
     * 저장 이벤트
     * @param event 이벤트 객체
     */
    const handleClickSave = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const tmp = {
            domainId,
            domainName,
            servicePlatform,
            lang,
            domainUrl,
            useYn: usedYn,
            apiCodeId,
            description,
        };

        if (validate(tmp)) {
            if (paramId) {
                updateDomain(tmp);
            } else {
                insertDomain(tmp);
            }
        }
    };

    const handleClickDelete = () => {
        onDelete(domain);
    };

    useEffect(() => {
        // invalidList 처리
        if (invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'domainId') {
                    setDomainIdError(true);
                }
                if (i.field === 'domainName') {
                    setDomainNameError(true);
                }
                if (i.field === 'domainUrl') {
                    setDomainUrlError(true);
                }
            });
        }
    }, [invalidList]);

    return (
        <div className="d-flex justify-content-center mb-20">
            <Form style={{ width: 605 }}>
                {/* 사용여부 */}
                <MokaInputLabel
                    label="사용여부"
                    className="mb-2"
                    as="switch"
                    inputProps={{ label: '', checked: usedYn === 'Y' && true }}
                    id="domain-useYN"
                    name="useYN"
                    onChange={handleChangeValue}
                    required
                />

                {/* 도메인ID */}
                <Form.Row className="mb-2">
                    <Col xs={4} className="p-0">
                        <MokaInputLabel
                            label="도메인ID"
                            className="mb-0"
                            placeholder="ID"
                            onChange={handleChangeValue}
                            value={domainId}
                            name="domainId"
                            disabled={domain.domainId && true}
                            isInvalid={domainIdError}
                            required
                        />
                    </Col>
                </Form.Row>

                {/* 도메인명 */}
                <MokaInputLabel
                    label="도메인명"
                    className="mb-2"
                    placeholder="도메인 명을 입력하세요"
                    onChange={handleChangeValue}
                    value={domainName}
                    name="domainName"
                    isInvalid={domainNameError}
                    required
                />

                {/* 도메인주소 */}
                <MokaInputLabel
                    label="도메인주소"
                    className="mb-2"
                    placeholder="도메인 주소에서 http(s)://를 빼고 입력하세요"
                    onChange={handleChangeValue}
                    value={domainUrl}
                    name="domainUrl"
                    isInvalid={domainUrlError}
                    required
                />

                {/* 플랫폼 */}
                <Form.Row className="mb-2">
                    <Col xs={3} className="p-0">
                        <MokaInputLabel
                            label="플랫폼"
                            as="radio"
                            inputProps={{
                                custom: true,
                                label: 'PC',
                                checked: servicePlatform === 'P' && true,
                            }}
                            id="domain-pc"
                            name="servicePlatform"
                            onChange={handleChangeValue}
                            value="P"
                            className="mb-0 h-100"
                            required
                        />
                    </Col>
                    <Col xs={1} className="p-0">
                        <MokaInput
                            inputProps={{ custom: true, label: 'Mobile', checked: servicePlatform === 'M' && true }}
                            id="domain-mobile"
                            as="radio"
                            value="M"
                            name="servicePlatform"
                            className="mb-0 h-100 align-items-center d-flex"
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>

                {/* 언어 */}
                <Form.Row className="mb-2">
                    <Col xs={4} className="p-0">
                        <MokaInputLabel as="select" label="언어" className="mb-0" onChange={handleChangeValue} value={lang} name="lang" inputProps={{ ref: elLang }}>
                            {langRows &&
                                langRows.map((row) => (
                                    <option key={row.id} value={row.dtlCd}>
                                        {row.name}
                                    </option>
                                ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>

                {/* API 경로 */}
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel
                            label="API 경로"
                            as="select"
                            className="mb-0"
                            onChange={handleChangeValue}
                            custom
                            value={apiCodeId}
                            name="apiCodeId"
                            inputProps={{ ref: elApiCodeId }}
                        >
                            {apiRows &&
                                apiRows.map((row) => (
                                    <option key={row.id} value={row.dtlCd}>
                                        {row.name}
                                    </option>
                                ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>

                {/* 메모 */}
                <MokaInputLabel
                    as="textarea"
                    label="메모"
                    className="mb-2"
                    inputClassName="resize-none"
                    inputProps={{ rows: 3 }}
                    onChange={handleChangeValue}
                    value={description}
                    name="description"
                />

                {/* 버튼 */}
                <Form.Group as={Row} className="d-flex pt-20 justify-content-center">
                    <Button variant="positive" className="float-left mr-10 pr-20 pl-20" onClick={handleClickSave}>
                        저장
                    </Button>
                    <Button className="float-left mr-0 pr-20 pl-20" variant="negative" onClick={handleClickDelete} disabled={!paramId}>
                        삭제
                    </Button>
                </Form.Group>
            </Form>
        </div>
    );
};

export default withRouter(DomainEdit);
