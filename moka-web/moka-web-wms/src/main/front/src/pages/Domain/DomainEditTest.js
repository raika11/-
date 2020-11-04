import React, { useState, useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useForm } from 'react-hook-form';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { notification } from '@utils/toastUtil';
import { clearDomain, getDomain, saveDomain, changeDomain, duplicateCheck, changeInvalidList } from '@store/domain';
import { getApi, getLang } from '@store/codeMgt';
import { MokaUncontrolledInput, MokaInputLabel } from '@components';

/**
 * 도메인 상세/수정/등록
 * @param history rect-router-dom useHistroy
 */
const DomainEditTest = ({ history, onDelete }) => {
    const dispatch = useDispatch();
    const { domainId: paramId } = useParams();
    const { register, handleSubmit, setValue, errors } = useForm();

    // error
    const [domainError, setDomainError] = useState({
        domainId: false,
        domainName: false,
        domainUrl: false,
    });

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
        // 데이터 변경 시 useForm의 value 변경(setValue)
        Object.keys(domain).forEach((key) => {
            if (key === 'usedYn') {
                setValue('usedYn', domain[key] === 'Y' ? true : false);
            } else if (key === 'lang') {
                if (!domain[key]) {
                    if (langRows.length > 0) {
                        setValue('lang', langRows[0].dtlCd);
                    }
                }
            } else if (key === 'apiCodeId') {
                if (!domain[key]) {
                    if (apiRows.length > 0) {
                        setValue('apiCodeId', apiRows[0].dtlCd);
                    }
                }
            } else {
                setValue(`${key}`, domain[key]);
            }
        });
    }, [apiRows, langRows, setValue, domain]);

    /**
     * input 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        if (name === 'domainId') {
            if (/^\d{4}$/.test(value)) {
                setDomainError({ ...domainError, domainId: false });
            }
        } else if (name === 'domainName') {
            setDomainError({ ...domainError, domainName: false });
        } else if (name === 'domainUrl') {
            setDomainError({ ...domainError, domainUrl: false });
        }
    };

    /**
     * 에러 처리 테스트
     * set ~~ Error ===> 스토어의 invalidList로만 관리
     * setError로 에러 추가해도 errors 가 변하지 않음 => submit될 때만 errors 변경됨
     */
    useEffect(() => {
        const iv = Object.keys(errors).reduce((ac, current) => {
            ac.push({
                field: current,
                reason: errors[current].message,
            });
            return ac;
        }, []);
        dispatch(changeInvalidList(iv));
    }, [dispatch, errors]);

    useEffect(() => {
        // invalidList 처리
        if (invalidList.length > 0) {
            setDomainError(
                invalidList.reduce(
                    (all, c) => ({
                        ...all,
                        [c.field]: true,
                    }),
                    {},
                ),
            );
        }
    }, [invalidList]);

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
                    if (response.header.success) {
                        notification('success', response.header.message);
                    } else {
                        notification('warning', response.header.message);
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
        const domainId = tmp.domainId;

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
                                        notification('success', response.header.message);
                                        history.push(`/domain/${domainId}`);
                                    } else {
                                        notification('warning', response.header.message);
                                    }
                                },
                            }),
                        );
                    } else {
                        notification('warning', '중복된 도메인아이디가 존재합니다.');
                    }
                },
            }),
        );
    };

    const handleClickDelete = () => {
        onDelete(domain);
    };

    /**
     * 저장 이벤트
     * @param object 폼데이터
     */
    const handleClickSave = (data) => {
        const saveData = {
            ...data,
            usedYn: data.usedYn ? 'Y' : 'N',
        };
        if (paramId) {
            updateDomain(saveData);
        } else {
            insertDomain(saveData);
        }
    };

    return (
        <div className="d-flex justify-content-center mb-20">
            <Form style={{ width: 605 }} onSubmit={handleSubmit(handleClickSave)}>
                {/* 사용여부 */}
                <MokaInputLabel label="사용여부" className="mb-2" as="switch" id="domain-usedYn" name="usedYn" ref={register} required uncontrolled />

                {/* 도메인ID */}
                <Form.Row className="mb-2">
                    <Col xs={4} className="p-0">
                        <MokaInputLabel
                            label="도메인ID"
                            className="mb-0"
                            placeholder="ID"
                            name="domainId"
                            ref={register({
                                required: true,
                                pattern: {
                                    value: /^\d{4}$/,
                                },
                            })}
                            inputProps={{
                                readOnly: domain.domainId && true,
                            }}
                            onChange={handleChangeValue}
                            isInvalid={domainError.domainId}
                            required
                            uncontrolled
                        />
                    </Col>
                </Form.Row>

                {/* 도메인명 */}
                <MokaInputLabel
                    label="도메인명"
                    className="mb-2"
                    placeholder="도메인 명을 입력하세요"
                    name="domainName"
                    ref={register({
                        required: 'required',
                    })}
                    isInvalid={domainError.domainName}
                    onChange={handleChangeValue}
                    required
                    uncontrolled
                />

                {/* 도메인주소 */}
                <MokaInputLabel
                    label="도메인주소"
                    className="mb-2"
                    placeholder="도메인 주소에서 http(s)://를 빼고 입력하세요"
                    name="domainUrl"
                    isInvalid={domainError.domainUrl}
                    ref={register({
                        required: true,
                    })}
                    onChange={handleChangeValue}
                    required
                    uncontrolled
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
                            }}
                            id="domain-pc"
                            name="servicePlatform"
                            defaultValue="P"
                            className="mb-0 h-100"
                            ref={register}
                            required
                            uncontrolled
                        />
                    </Col>
                    <Col xs={1} className="p-0">
                        <MokaUncontrolledInput
                            as="radio"
                            inputProps={{
                                custom: true,
                                label: 'Mobile',
                            }}
                            id="domain-mobile"
                            name="servicePlatform"
                            defaultValue="M"
                            className="mb-0 h-100 align-items-center d-flex"
                            ref={register}
                        />
                    </Col>
                </Form.Row>

                {/* 언어 */}
                <Form.Row className="mb-2">
                    <Col xs={4} className="p-0">
                        <MokaInputLabel as="select" label="언어" className="mb-0" name="lang" ref={register} uncontrolled>
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
                        <MokaInputLabel label="API 경로" as="select" className="mb-0" name="apiCodeId" ref={register} uncontrolled>
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
                <MokaInputLabel as="textarea" label="메모" className="mb-2" inputClassName="resize-none" inputProps={{ rows: 3 }} ref={register} name="description" uncontrolled />

                {/* 버튼 */}
                <Form.Group as={Row} className="d-flex pt-20 justify-content-center">
                    <Button type="submit" variant="primary" className="float-left mr-10 pr-20 pl-20">
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

export default withRouter(DomainEditTest);
