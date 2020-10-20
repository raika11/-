import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useParams, withRouter } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { clearDomain, getDomain, saveDomain, duplicateCheck, deleteDomain } from '@store/domain';
import { notification } from '@utils/toastUtil';
import { toastr } from 'react-redux-toastr';
import { MokaInput } from '@components';

/**
 * 도메인 상세/수정/등록
 * @param history rect-router-dom useHisotry
 */
const DomainEdit = ({ history }) => {
    const { domainId: paramId } = useParams();

    const [domainId, setDomainId] = useState('');
    const [domainName, setDomainName] = useState('');
    const [domainUrl, setDomainUrl] = useState('');
    const [useYn, setUseYn] = useState('Y');
    const [servicePlatform, setServicePlatform] = useState('P');
    const [lang, setLang] = useState('KR');
    const [apiCodeId, setApiCodeId] = useState('');
    const [description, setDescription] = useState('');

    const [domainIdError, setDomainIdError] = useState(false);
    const [domainNameError, setDomainNameError] = useState(false);
    const [domainUrlError, setDomainUrlError] = useState(false);

    const [isErrors, setIsErrors] = useState({
        domain: false,
        domainName: false,
        domainUrl: false,
    });

    const { detail, langRows, apiRows, latestMediaId, loading } = useSelector(
        (store) => ({
            detail: store.domain.detail,
            /*langRows: store.etccodeTypeStore.langRows,
        apiRows: store.etccodeTypeStore.apiRows,*/
            latestMediaId: store.auth.latestMediaId,
            loading: false,
        }),
        shallowEqual,
    );
    const dispatch = useDispatch();

    /**
     *
     * @param {*} target javascript event.target
     */
    const onChangeValue = ({ target }) => {
        const { name, value, checked, selectedOptions } = target;
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

    const validate = (domain) => {
        let isInvalid = false;

        // 도메인아이디체크
        if (!domain.domainId || domain.domainId === '') {
            setDomainIdError(true);
            isInvalid = isInvalid | true;
        } else if (!/^\d{4}$/.test(domain.domainId)) {
            setDomainIdError(false);
            isInvalid = isInvalid | true;
        }

        // 도메인명 체크
        if (!/[^\s\t\n]+/.test(domain.domainName)) {
            setDomainNameError(true);
            isInvalid = isInvalid | true;
        }

        // 도메인url 체크
        if (!/[^\s\t\n]+/.test(domain.domainUrl)) {
            setDomainUrlError(true);
            isInvalid = isInvalid | true;
        }

        return !isInvalid;
    };

    useEffect(() => {
        // TODO: 언어 정보 가져오기
        // TODO: API 정보 가져오기
    });

    useEffect(() => {
        /**
         * 파라미터 domainId가 있는데 데이터가 없을 경우 로드,
         * 파라미터가 없는데 데이터가 있을 경우 데이터 clear
         */
        if (paramId && paramId !== detail.domainId && !loading) {
            dispatch(getDomain(paramId));
        } else if (!paramId && detail.domainId && !loading) {
            dispatch(clearDomain({ detail: true }));
        }
    }, [detail.domainId, dispatch, loading, paramId]);

    useEffect(() => {
        // 도메인 데이터 셋팅
        setDomainIdError(false);
        setDomainNameError(false);
        setDomainUrlError(false);
        setDomainId(detail.domainId || '');
        setDomainName(detail.domainName || '');
        setServicePlatform(detail.servicePlatform || 'P');
        setLang(detail.lang || 'KR');
        setUseYn(detail.useYn || 'Y');
        setDomainUrl(detail.domainUrl || '');
        setApiCodeId(detail.apiCodeId || '');
        setDescription(detail.description || '');
    }, [detail]);

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
            if (detail.domainId) {
                // 업데이트
                dispatch(saveDomain({ type: 'update', domain: tmp }));
            } else {
                // 추가
                dispatch(
                    duplicateCheck({
                        domainId,
                        unique: () =>
                            dispatch(
                                saveDomain({
                                    type: 'insert',
                                    domain: tmp,
                                    success: () => history.push(`/domain/${domainId}`),
                                }),
                            ),
                        duplicate: () => {
                            console.log('hh');
                            notification('warning', '중복된 도메인아이디가 존재합니다.');
                            /*/!*setMessage('중복된 도메인아이디가 존재합니다');
                            setShowOpen(true);*!/*/
                        },
                    }),
                );
            }
        }
    };

    const handleDelete = (e) => {
        toastr.confirm('정말 삭제하시겠습니까?', {
            onOk: () => {
                if (detail.domainId) {
                    dispatch(deleteDomain({ domainId: detail.domainId }));
                } else {
                    console.log('삭제 실패');
                }
            },
            onCancel: () => {},
        });
    };

    return (
        <div className="d-flex justify-content-center mb-20">
            <Form noValidate onSubmit={handleSubmit} style={{ width: 605 }}>
                <Form.Group as={Row}>
                    <Form.Label column xs={3} className="pt-1 pr-0 pl-0 mb-0">
                        <span className="required-text">*</span>도메인 ID
                    </Form.Label>
                    <Col xs={2} className="pl-0 pr-0">
                        <Form.Control
                            type="text"
                            placeholder="ID"
                            onChange={onChangeValue}
                            value={domainId}
                            name="domainId"
                            disabled={detail.domainId && true}
                            isInvalid={domainIdError}
                            className="form-control"
                        />
                    </Col>
                    <Form.Label column xs={6} className="pt-1 pr-0 pl-10 mb-0">
                        숫자 4자리로 입력하세요
                    </Form.Label>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column xs={3} className="pt-2 pr-0 pl-0 mb-0">
                        <span className="required-text">*</span>도메인 명
                    </Form.Label>
                    <Col xs={9} className="pl-0 pr-0">
                        <Form.Control
                            type="text"
                            placeholder="도메인 명을 입력하세요"
                            onChange={onChangeValue}
                            value={domainName}
                            name="domainName"
                            className="form-control"
                            isInvalid={domainNameError}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column xs={3} className="pt-2 pr-0 pl-0 mb-0">
                        <span className="required-text">*</span>도메인 주소
                    </Form.Label>
                    <Col xs={9} className="pl-0 pr-0">
                        <Form.Control
                            type="text"
                            placeholder="도메인 주소에서 http(s)://를 빼고 입력하세요"
                            onChange={onChangeValue}
                            value={domainUrl}
                            name="domainUrl"
                            className="form-control"
                            isInvalid={domainUrlError}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column xs={3} className="pt-2 pr-0 pl-0 mr-1 mb-0">
                        <span className="required-text">*</span>사용여부
                    </Form.Label>
                    <Col xs={9} className="px-0 my-auto">
                        <Form.Check type="switch" id="domain-useYN" label="" name="useYN" onChange={onChangeValue} checked={useYn === 'Y' && true} className="pt-2 pl-4 ml-2" />
                    </Col>
                </Form.Group>
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
                            onChange={onChangeValue}
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
                            onChange={onChangeValue}
                            checked={servicePlatform === 'M' && true}
                        />
                    </div>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column xs={3} className="pt-1 mr-0 pr-0 pl-0">
                        언어
                    </Form.Label>
                    <Col xs={4} className="pl-0 ml-0 pr-0 pl-0">
                        <Form.Control as="select" custom onChange={onChangeValue} value={lang} name="lang" className="form-control">
                            <option value="KR">국문</option>
                            <option value="EN">영문</option>
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column xs={3} className="pt-1 pr-0 pl-0 mb-0">
                        API 경로
                    </Form.Label>
                    <Col xs={9} className="pl-0 ml-0 pr-0 pl-0">
                        <Form.Control as="select" onChange={onChangeValue} custom value={apiCodeId} name="apiCodeId" className="form-control">
                            <option value="MOKA_API">중앙일보API</option>
                            <option value="MOKA_API2">중앙일보API2</option>
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column xs={3} className="pt-2 pr-0 pl-0 mb-0">
                        메모
                    </Form.Label>
                    <Col xs={9} className="pl-0 pr-0">
                        <Form.Control as="textarea" rows="3" onChange={onChangeValue} value={description} name="description" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="d-flex pt-20 justify-content-center">
                    <Button type="submit" variant="primary" className="float-left mr-10 pr-20 pl-20">
                        저장
                    </Button>
                    <Button className="float-left mr-10 pr-20 pl-20" variant="gray150">
                        취소
                    </Button>
                    {detail.domainId && (
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
