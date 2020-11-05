import React, { useEffect, useState, useCallback } from 'react';
import { Col, Form, Button, Row } from 'react-bootstrap';
import { MokaCard, MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { useParams, useHistory, withRouter } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { clearGroup, getGroup, saveGroup, changeGroup, duplicateGroupCheck, changeInvalidList } from '@store/group';
import { notification } from '@utils/toastUtil';


/**
 * 그룹 상세/수정/등록
 * @param history rect-router-dom useHisotry
 */
const GroupEdit = (history, onDelete) => {
    const { groupId: paramCd } = useParams();

    // entity
    const [groupCd, setGroupCd] = useState('');
    const [groupNm, setGroupNm] = useState('');
    const [groupKorNm, setGroupKorNm] = useState('');

    const [regId, setRegId] = useState('');
    const [regDt, setRegDt] = useState('');

    // error
    const [groupCdError, setGroupCdError] = useState(false);
    const [groupNmError, setGroupNmError] = useState(false);
    const [groupNmKorError, setGroupKorNmError] = useState(false);

    // getter
    const { group, invalidList } = useSelector(
        (store) => ({
            group: store.group.group,
            invalidList: store.group.invalidList,
        }),
        shallowEqual,
    );

    const dispatch = useDispatch();

    /**
     * 각 항목별 값 변경
     * @param target javascript event.target
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;
        switch (name) {
            case 'groupCd':
                const regex = /^[0-9\b]+$/;
                //const regex = /^[gG]\w{1}u(\d{2}$/;
                //if ((value === '' || regex.test(value)) &&
                    if (value.length <= 3) {
                    setGroupCdError(false);
                    setGroupCd(value);
                }
                break;
            case 'groupNm':
                setGroupNm(value);
                setGroupNmError(false);
                break;
            case 'groupNmKor':
                setGroupKorNm(value);
                setGroupKorNmError(false);
                break;
            default:
                break;
        }
    };

    /**
     * 유효성 검사를 한다.
     * @param domain 도메인 정보를 가진 객체
     * @returns {boolean} 유효성 검사 결과
     */
    /*
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
    */


     useEffect(() => {
        if (paramCd) {
            console.log("getGroup::::::::::::");
            dispatch(getGroup(paramCd));
        } else {
            console.log("clearGroup::::::::::::");
            dispatch(clearGroup());
        }
    }, [dispatch, paramCd]);

    /**
     * group 수정
     * @param {object} tmp 도메인
     */
    /*
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
    */
    /**
     * group 등록
     * @param {object} tmp 도메인
     */
    /*
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
                        notification('warning', '중복된 도메인아이디가 존재합니다.');
                    }
                },
            }),
        );
    };
    */
    /**
     * group 저장 이벤트
     * @param event 이벤트 객체
     */

    const handleClickSave = (event) => {
        event.preventDefault();
        event.stopPropagation();

        /*
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
        */
    };

    /**
     * group 삭제 이벤트
     * @param
     */
    const handleClickDelete = () => {
        onDelete(group);
    };

    useEffect(() => {
        // invalidList 처리
        if (invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'groupCd') {
                    setGroupCdError(true);
                }
                if (i.field === 'groupNm') {
                    setGroupNmError(true);
                }
                if (i.field === 'groupKorNm') {
                    setGroupKorNmError(true);
                }
            });
        }
    }, [invalidList]);

    // setter 도메인 데이터 셋팅
    useEffect(() => {
        setGroupCdError(false);
        setGroupNmError(false);
        setGroupKorNmError(false);
        setGroupCd(group.groupCd || '');
        setGroupNm(group.groupNm || '');
        setGroupKorNm(group.groupKorNm || '');
        setRegId(group.regId || '');
        setRegDt(group.regDt || '');

    }, [group]);
    return (
        <MokaCard title="그룹정보" width={1000}>
            <Form noValidate>
                <Form.Row>
                    <Col xs={6}>
                        <MokaInputLabel
                            label="그룹코드(G01, G02형식)"
                            required labelWidth={160}
                            name="groupCd"
                            value={groupCd}
                            onChange={handleChangeValue}
                            placeholder="GROUP CODE"
                            disabled={group.groupCd && true}
                            //isInvalid={groupCdError}
                        />
                    </Col>
                    <Col xs={6}>* 한번입력하면 변경하실 수 없습니다. 신중히 입력하시기 바랍니다.</Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={6}>
                        <MokaInputLabel
                            label="그룹명"
                            required labelWidth={160}
                            name="groupNm"
                            value={groupNm}
                            onChange={handleChangeValue}
                            placeholder="그룹명을 입력하세요."
                            disabled={group.groupNm && true}
                            //isInvalid={groupNmError}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={6}>
                        <MokaInputLabel
                            label="그룹 한글명"
                            required labelWidth={160}
                            name="groupKorNm"
                            value={groupKorNm}
                            onChange={handleChangeValue}
                            placeholder="그룹 한글명을 입력하세요."
                            disabled={group.groupKorNm && true}
                            //isInvalid={groupNmError}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={6}>
                        <MokaInputLabel
                            label="등록자"
                            labelWidth={160}
                            disabled={true}
                            name={regId}
                            value={group.regId}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={6}>
                        <MokaInputLabel
                            label="등록일시"
                            labelWidth={160}
                            disabled={true}
                            name={regDt}
                            value={group.regDt}
                        />
                    </Col>
                </Form.Row>
                <Form.Group as={Row} className="d-flex pt-20 justify-content-center">
                    <Button variant="primary" className="float-left mr-10 pr-20 pl-20" onClick={handleClickSave}>
                        저장
                    </Button>
                    <Button className="float-left mr-0 pr-20 pl-20" variant="gray150" onClick={handleClickDelete}>
                        삭제
                    </Button>
                </Form.Group>
            </Form>
        </MokaCard>
    );
};

export default GroupEdit;
