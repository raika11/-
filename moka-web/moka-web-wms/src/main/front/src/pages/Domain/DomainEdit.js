import React, { useState, useEffect, useRef } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { toastr } from 'react-redux-toastr';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { notification } from '@utils/toastUtil';
import { clearDomain, getDomain, saveDomain, changeDomain, duplicateCheck, deleteDomain, changeInvalidList, hasRelations, GET_DOMAIN, SAVE_DOMAIN } from '@store/domain';
import { getApi, getLang } from '@store/codeMgt';

/**
 * 도메인 상세/수정/등록
 * @param history rect-router-dom useHisotry
 */
const DomainEdit = ({ history }) => {
    const { domainId: paramId } = useParams();
    const elLang = useRef();
    const elApiCodeId = useRef();

    // entity
    const [domainId, setDomainId] = useState('');
    const [domainName, setDomainName] = useState('');
    const [domainUrl, setDomainUrl] = useState('');
    const [useYn, setUseYn] = useState('Y');
    const [servicePlatform, setServicePlatform] = useState('P');
    const [lang, setLang] = useState('KR');
    const [apiCodeId, setApiCodeId] = useState('');
    const [description, setDescription] = useState('');

    // error
    const [domainIdError, setDomainIdError] = useState(false);
    const [domainNameError, setDomainNameError] = useState(false);
    const [domainUrlError, setDomainUrlError] = useState(false);

    // getter
    const { domain, langRows, apiRows, loading, invalidList } = useSelector(
        (store) => ({
            domain: store.domain.domain,
            langRows: store.codeMgt.langRows,
            apiRows: store.codeMgt.apiRows,
            loading: store.loading[GET_DOMAIN] || store.loading[SAVE_DOMAIN],
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
            setUseYn(usedValue);
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
        if (!/[^\s\t\n]+/.test(domain.domainName)) {
            errList.push({
                field: 'domainName',
                reason: '',
            });
            isInvalid = isInvalid | true;
        }

        // 도메인url 체크
        if (!/[^\s\t\n]+/.test(domain.domainUrl)) {
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
        dispatch(getLang());
        dispatch(getApi());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        setUseYn(domain.useYn || 'Y');
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
                        notification('success', '수정하였습니다.');
                    } else {
                        notification('warning', '실패하였습니다.');
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
                                        notification('success', '등록하였습니다.');
                                        history.push(`/domain/${domainId}`);
                                    } else {
                                        notification('warning', '실패하였습니다.');
                                    }
                                },
                            }),
                        );
                    } else {
                        console.log('hh');
                        notification('warning', '중복된 도메인아이디가 존재합니다.');
                    }
                },
            }),
        );
    };

    /**
     * 저장 이벤트
     * @param event 이벤트 객체
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const tmp = {
            domainId,
            domainName,
            servicePlatform,
            lang,
            domainUrl,
            useYn,
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

    /**
     * 도메인 삭제
     * @param {object} response response
     */
    const deleteCallback = (response) => {
        if (response.body) {
            notification('warning', '관련 아이템이 존재하여 삭제할 수 없습니다.');
        } else {
            dispatch(
                deleteDomain({
                    domainId: domain.domainId,
                    callback: (response) => {
                        if (response.header.success) {
                            notification('success', '삭제하였습니다.');
                            history.push('/domain');
                        } else {
                            notification('warning', response.header.message);
                        }
                    },
                }),
            );
        }
    };

    /**
     * 삭제 버튼 클릭
     */
    const handleDelete = () => {
        toastr.confirm('정말 삭제하시겠습니까?', {
            onOk: () => {
                dispatch(
                    hasRelations({
                        domainId: domain.domainId,
                        callback: deleteCallback,
                    }),
                );
            },
            onCancel: () => {},
        });
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
            {loading && <div className="opacity-box"></div>}
            <Form noValidate onSubmit={handleSubmit} style={{ width: 605 }}>
                {/* 도메인ID */}
                <Form.Group as={Row}>
                    <Form.Label column xs={3} className="pt-1 pr-0 pl-0 mb-0">
                        <span className="required-text">*</span>도메인 ID
                    </Form.Label>
                    <Col xs={2} className="pl-0 pr-0">
                        <Form.Control
                            type="text"
                            placeholder="ID"
                            onChange={handleChangeValue}
                            value={domainId}
                            name="domainId"
                            disabled={domain.domainId && true}
                            isInvalid={domainIdError}
                            className="form-control"
                        />
                    </Col>
                    <Form.Label column xs={6} className="pt-1 pr-0 pl-10 mb-0">
                        숫자 4자리로 입력하세요
                    </Form.Label>
                </Form.Group>
                {/* 도메인명 */}
                <Form.Group as={Row}>
                    <Form.Label column xs={3} className="pt-2 pr-0 pl-0 mb-0">
                        <span className="required-text">*</span>도메인 명
                    </Form.Label>
                    <Col xs={9} className="pl-0 pr-0">
                        <Form.Control
                            type="text"
                            placeholder="도메인 명을 입력하세요"
                            onChange={handleChangeValue}
                            value={domainName}
                            name="domainName"
                            className="form-control"
                            isInvalid={domainNameError}
                        />
                    </Col>
                </Form.Group>
                {/* 도메인주소 */}
                <Form.Group as={Row}>
                    <Form.Label column xs={3} className="pt-2 pr-0 pl-0 mb-0">
                        <span className="required-text">*</span>도메인 주소
                    </Form.Label>
                    <Col xs={9} className="pl-0 pr-0">
                        <Form.Control
                            type="text"
                            placeholder="도메인 주소에서 http(s)://를 빼고 입력하세요"
                            onChange={handleChangeValue}
                            value={domainUrl}
                            name="domainUrl"
                            className="form-control"
                            isInvalid={domainUrlError}
                        />
                    </Col>
                </Form.Group>
                {/* 사용여부 */}
                <Form.Group as={Row}>
                    <Form.Label column xs={3} className="pt-2 pr-0 pl-0 mr-1 mb-0">
                        <span className="required-text">*</span>사용여부
                    </Form.Label>
                    <Col xs={9} className="px-0 my-auto">
                        <Form.Check type="switch" id="domain-useYN" label="" name="useYN" onChange={handleChangeValue} checked={useYn === 'Y' && true} className="pt-2 pl-4 ml-2" />
                    </Col>
                </Form.Group>
                {/* 플랫폼 */}
                <Form.Group as={Row}>
                    <Form.Label column xs={3} className="pt-1 pr-0 pl-0 mb-0">
                        <span className="required-text">*</span>플랫폼
                    </Form.Label>
                    <div className="form-check form-check-inline pr-20">
                        <Form.Check
                            custom
                            type="radio"
                            label="PC"
                            value="P"
                            id="domain-pc"
                            name="servicePlatform"
                            onChange={handleChangeValue}
                            checked={servicePlatform === 'P' && true}
                        />
                    </div>
                    <div className="form-check form-check-inline">
                        <Form.Check
                            custom
                            type="radio"
                            label="Mobile"
                            value="M"
                            id="domain-mobile"
                            name="servicePlatform"
                            onChange={handleChangeValue}
                            checked={servicePlatform === 'M' && true}
                        />
                    </div>
                </Form.Group>
                {/* 언어 */}
                <Form.Group as={Row}>
                    <Form.Label column xs={3} className="pt-1 mr-0 pr-0 pl-0">
                        언어
                    </Form.Label>
                    <Col xs={4} className="pl-0 ml-0 pr-0 pl-0">
                        <Form.Control as="select" custom onChange={handleChangeValue} value={lang} name="lang" className="form-control" ref={elLang}>
                            {langRows &&
                                langRows.map((row) => (
                                    <option key={row.id} value={row.dtlCd}>
                                        {row.name}
                                    </option>
                                ))}
                        </Form.Control>
                    </Col>
                </Form.Group>
                {/* API 경로 */}
                <Form.Group as={Row}>
                    <Form.Label column xs={3} className="pt-1 pr-0 pl-0 mb-0">
                        API 경로
                    </Form.Label>
                    <Col xs={9} className="pl-0 ml-0 pr-0 pl-0">
                        <Form.Control as="select" onChange={handleChangeValue} custom value={apiCodeId} name="apiCodeId" className="form-control" ref={elApiCodeId}>
                            {apiRows &&
                                apiRows.map((row) => (
                                    <option key={row.id} value={row.dtlCd}>
                                        {row.name}
                                    </option>
                                ))}
                        </Form.Control>
                    </Col>
                </Form.Group>
                {/* 메모 */}
                <Form.Group as={Row}>
                    <Form.Label column xs={3} className="pt-2 pr-0 pl-0 mb-0">
                        메모
                    </Form.Label>
                    <Col xs={9} className="pl-0 pr-0">
                        <Form.Control as="textarea" rows="3" onChange={handleChangeValue} value={description} name="description" />
                    </Col>
                </Form.Group>
                {/* 버튼 */}
                <Form.Group as={Row} className="d-flex pt-20 justify-content-center">
                    <Button type="submit" variant="primary" className="float-left mr-10 pr-20 pl-20">
                        저장
                    </Button>
                    <Button className="float-left mr-10 pr-20 pl-20" variant="gray150">
                        취소
                    </Button>
                    {paramId && (
                        <Button className="float-left mr-0 pr-20 pl-20" variant="gray150" onClick={handleDelete}>
                            삭제
                        </Button>
                    )}
                </Form.Group>
            </Form>
        </div>
    );
};

export default withRouter(DomainEdit);
