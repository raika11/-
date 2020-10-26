import React, { useState, useEffect, useRef } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { notification, toastr } from '@utils/toastUtil';
import { clearDomain, getDomain, saveDomain, changeDomain, duplicateCheck, deleteDomain, changeInvalidList, hasRelationList, GET_DOMAIN, SAVE_DOMAIN } from '@store/domain';
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
    const handleClickSave = (event) => {
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
    /*const deleteCallback = (response) => {
        if (response.header.success) {
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
        } else {
            notification('warning', response.header.message);
        }
    };*/

    /**
     * 삭제 버튼 클릭
     */
    /*const handleClickDelete = () => {
        toastr.confirm('정말 삭제하시겠습니까?', {
            onOk: () => {
                dispatch(
                    hasRelationList({
                        domainId: domain.domainId,
                        callback: deleteCallback,
                    }),
                );
            },
            onCancel: () => {},
        });
    };*/

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
            {loading && <div className="opacity-box"></div>}
            <Form style={{ width: 605 }}>
                {/* 사용여부 */}
                <Form.Row>
                    <Col xs={3} className="pl-0 pr-0">
                        <MokaInputLabel
                            label="사용여부"
                            as="switch"
                            inputProps={{ id: 'domain-useYN', label: '', checked: useYn === 'Y' && true }}
                            name="useYN"
                            onChange={handleChangeValue}
                            required
                        />
                    </Col>
                </Form.Row>

                {/* 도메인ID */}
                <Form.Row>
                    <Col xs={4} className="pl-0 pr-0">
                        <MokaInputLabel
                            label="도메인ID"
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
                <Form.Row>
                    <Col xs={9} className="pl-0 pr-0">
                        <MokaInputLabel
                            label="도메인명"
                            placeholder="도메인 명을 입력하세요"
                            onChange={handleChangeValue}
                            value={domainName}
                            name="domainName"
                            isInvalid={domainNameError}
                            required
                        />
                    </Col>
                </Form.Row>

                {/* 도메인주소 */}
                <Form.Row>
                    <Col xs={9} className="pl-0 pr-0">
                        <MokaInputLabel
                            label="도메인주소"
                            placeholder="도메인 주소에서 http(s)://를 빼고 입력하세요"
                            onChange={handleChangeValue}
                            value={domainUrl}
                            name="domainUrl"
                            isInvalid={domainUrlError}
                            required
                        />
                    </Col>
                </Form.Row>

                {/* 플랫폼 */}
                <Form.Row>
                    <Col xs={3} className="p-0">
                        <MokaInputLabel
                            label="플랫폼"
                            as="radio"
                            inputProps={{
                                custom: true,
                                id: 'domain-pc',
                                label: 'PC',
                                checked: servicePlatform === 'P' && true,
                            }}
                            name="servicePlatform"
                            onChange={handleChangeValue}
                            value="P"
                            className="mb-0 h-100"
                            required
                        />
                    </Col>
                    <Col xs={1} className="p-0 mr-10">
                        <MokaInput
                            inputProps={{ custom: true, label: 'Mobile', id: 'domain-mobile', checked: servicePlatform === 'M' && true }}
                            as="radio"
                            value="M"
                            name="servicePlatform"
                            className="mb-0 h-100 align-items-center d-flex"
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>

                {/* 언어 */}
                <Form.Row>
                    <Col xs={4} className="pl-0 ml-0 pr-0 pl-0">
                        <MokaInputLabel as="select" label="언어" className="pt-1 mr-0 pr-0 pl-0" onChange={handleChangeValue} value={lang} name="lang" inputProps={{ ref: elLang }}>
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
                <Form.Row>
                    <Col xs={9} className="pl-0 ml-0 pr-0 pl-0">
                        <MokaInputLabel label="API 경로" as="select" onChange={handleChangeValue} custom value={apiCodeId} name="apiCodeId" inputProps={{ ref: elApiCodeId }}>
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
                <Form.Row>
                    <Col xs={9} className="pl-0 pr-0">
                        <MokaInputLabel as="textarea" label="매모" inputProps={{ rows: 3 }} onChange={handleChangeValue} value={description} name="description" />
                    </Col>
                </Form.Row>
                {/* 버튼 */}
                <Form.Group as={Row} className="d-flex pt-20 justify-content-center">
                    <Button variant="primary" className="float-left mr-10 pr-20 pl-20" onClick={handleClickSave}>
                        저장
                    </Button>
                    <Button className="float-left mr-10 pr-20 pl-20" variant="gray150">
                        취소
                    </Button>
                    {paramId && (
                        <Button className="float-left mr-0 pr-20 pl-20" variant="gray150" onClick={handleClickDelete}>
                            삭제
                        </Button>
                    )}
                </Form.Group>
            </Form>
        </div>
    );
};

export default withRouter(DomainEdit);
