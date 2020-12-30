import React, { useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { MokaCard, MokaInputLabel } from '@components';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
    clearGroup,
    getGroup,
    saveGroup,
    changeGroup,
    duplicateGroupCheck,
    changeInvalidList,
    GET_GROUP,
    SAVE_GROUP,
    DELETE_GROUP,
    deleteGroup,
    hasRelationList,
    getGroupMenuAuth,
    clearGroupMenuAuth,
} from '@store/group';
import toast, { messageBox } from '@utils/toastUtil';
import { CARD_DEFAULT_HEIGHT } from '@/constants';

/**
 * 그룹 상세/수정/등록
 * @param history rect-router-dom useHisotry
 */
const GroupEdit = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { groupCd: paramCd } = useParams();

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
    const { group, invalidList, memberNm } = useSelector(
        (store) => {
            return {
                group: store.group.group,
                menus: store.group.menus,
                invalidList: store.group.invalidList,
                memberNm: store.group.group.regMember && store.group.group.regMember.memberNm,
                loading: store.loading[GET_GROUP] || store.loading[SAVE_GROUP] || store.loading[DELETE_GROUP],
            };
        },

        shallowEqual,
    );

    /**
     * 삭제 버튼
     */
    const handleClickDelete = () => {
        const { groupCd } = group;
        dispatch(
            hasRelationList({
                groupCd,
                callback: ({ header, body }) => {
                    if (header.success) {
                        // 관련 아이템 없음
                        if (!body) {
                            deleteCallback(group);
                        }
                        // 관련 아이템 있음
                        else {
                            toast.fail('사용 중인 그룹은 삭제할 수 없습니다');
                        }
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 도메인 삭제
     * @param {object} domain domain
     */
    const deleteCallback = (group) => {
        messageBox.confirm(`${group.groupCd}_${group.groupNm}을 정말 삭제하시겠습니까?`, () => {
            dispatch(
                deleteGroup({
                    groupCd: group.groupCd,
                    callback: ({ header }) => {
                        // 삭제 성공
                        if (header.success) {
                            toast.success(header.message);
                            history.push('/group');
                        }
                        // 삭제 실패
                        else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        });
    };

    const getByte = (str) => {
        return str
            .split('')
            .map((s) => s.charCodeAt(0))
            .reduce((prev, c) => prev + (c === 10 ? 2 : c >> 7 ? 2 : 1), 0); // 계산식에 관한 설명은 위 블로그에 있습니다.
    };
    /**
     * 각 항목별 값 변경
     * @param target javascript event.target
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;

        switch (name) {
            case 'groupCd':
                if (value.length <= 3) {
                    setGroupCdError(false);
                    setGroupCd(value);
                }
                break;
            case 'groupNm':
                if (getByte(value) <= 20) {
                    setGroupNm(value);
                    setGroupNmError(false);
                }
                break;
            case 'groupKorNm':
                if (getByte(value) <= 20) {
                    setGroupKorNm(value);
                    setGroupKorNmError(false);
                }
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

    const validate = (group) => {
        let isInvalid = false;
        let errList = [];

        // 그룹코드체크
        if (!group.groupCd || group.groupCd === '') {
            errList.push({
                field: 'groupCd',
                reason: '그룹코드를 입력해주세요.',
            });
            isInvalid = isInvalid | true;
        } else if (group.groupCd !== '') {
            const regExp = /^\d{2}$/;
            const grpCd = group.groupCd.substr(1);
            if (group.groupCd.substr(0, 1) !== 'G' || !regExp.test(grpCd)) {
                errList.push({
                    field: 'groupCd',
                    reason: '그룹코드는 대문자G 숫자2자리입니다.',
                });
                isInvalid = isInvalid | true;
            }
        }

        // 그룹 한글 체크
        if (!/[^\s\t\n]+/.test(group.groupNm)) {
            errList.push({
                field: 'groupNm',
                reason: '그룹명은 한글만 입력해주세요.',
            });
            isInvalid = isInvalid | true;
        }

        // 그룹 한글 명 체크
        if (!/[^\s\t\n]+/.test(group.groupKorNm)) {
            errList.push({
                field: 'groupKorNm',
                reason: '그룹 한글명을 입력해주세요.',
            });
            isInvalid = isInvalid | true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    useEffect(() => {
        if (paramCd) {
            dispatch(getGroup(paramCd));
            dispatch(getGroupMenuAuth(paramCd));
        } else {
            dispatch(clearGroup());
            dispatch(clearGroupMenuAuth());
        }
    }, [dispatch, paramCd]);

    /**
     * group 수정
     * @param {object} tmp 도메인
     */

    const updateGroup = (tmp) => {
        dispatch(
            saveGroup({
                type: 'update',
                actions: [
                    changeGroup({
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
     * group 등록
     * @param {object} tmp 도메인
     */
    const insertGroup = (tmp) => {
        dispatch(
            duplicateGroupCheck({
                groupCd,
                callback: (response) => {
                    const { body } = response;

                    if (!body) {
                        dispatch(
                            saveGroup({
                                type: 'insert',
                                actions: [
                                    changeGroup({
                                        ...tmp,
                                    }),
                                ],
                                callback: (response) => {
                                    if (response.header.success) {
                                        toast.success('등록하였습니다.');
                                        history.push(`/group/${groupCd}`);
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
     * group 저장 이벤트
     * @param event 이벤트 객체
     */

    const handleClickSave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        /*
        const tmp = {
            groupCd : group.groupCd,
            groupNm : group.groupNm,
            groupKorNm : group.groupKorNm,
        };
        */

        const tmp = {
            groupCd,
            groupNm,
            groupKorNm,
        };

        if (validate(tmp)) {
            if (paramCd) {
                updateGroup(tmp);
            } else {
                insertGroup(tmp);
            }
        }
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
        setRegId(memberNm || '');
        setRegDt(group.regDt || '');
    }, [group, memberNm]);

    return (
        <MokaCard
            title="그룹정보"
            className="w-100"
            height={CARD_DEFAULT_HEIGHT - 90}
            footerClassName="justify-content-center"
            footerButtons={
                groupCd
                    ? [
                          { text: '저장', variant: 'positive', onClick: handleClickSave, className: 'float-left mr-10 pr-20 pl-20' },
                          { text: '삭제', variant: 'negative', onClick: handleClickDelete, className: 'float-left mr-0 pr-20 pl-20' },
                      ]
                    : [{ text: '저장', variant: 'positive', onClick: handleClickSave, className: 'float-left mr-10 pr-20 pl-20' }]
            }
            footer
        >
            <Form noValidate>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            label="그룹코드"
                            required
                            labelWidth={80}
                            name="groupCd"
                            value={groupCd}
                            onChange={handleChangeValue}
                            placeholder="그룹코드를 입력해주세요. (G1, G2 형식)"
                            disabled={group.groupCd && true}
                            isInvalid={groupCdError}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="d-flex mb-2 text-align-center">
                    <MokaInputLabel label=" " labelWidth={80} as="none" />
                    <Form.Label className="text-danger">
                        <div>* 한번입력하면 변경하실 수 없습니다.</div>
                        <div style={{ textIndent: 8 }}>신중히 입력하시기 바랍니다.</div>
                    </Form.Label>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            label="그룹명"
                            required
                            labelWidth={80}
                            name="groupNm"
                            value={groupNm}
                            onChange={handleChangeValue}
                            placeholder="그룹명을 입력하세요."
                            isInvalid={groupNmError}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            label="그룹 한글명"
                            required
                            labelWidth={80}
                            name="groupKorNm"
                            value={groupKorNm}
                            onChange={handleChangeValue}
                            placeholder="그룹 한글명을 입력하세요."
                            isInvalid={groupNmKorError}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel label="등록자" labelWidth={80} disabled={true} name={regId} value={regId} />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={12} className="p-0">
                        <MokaInputLabel label="등록일시" labelWidth={80} disabled={true} name={regDt} value={group.regDt} />
                    </Col>
                </Form.Row>
                {/*<Form.Group as={Row} className="d-flex pt-20 justify-content-center">
                    <Button variant="positive" className="float-left mr-10 pr-20 pl-20" onClick={handleClickSave}>
                        저장
                    </Button>
                    {groupCd && (
                        <Button variant="gray150" className="float-left mr-0 pr-20 pl-20" onClick={handleClickDelete}>
                            삭제
                        </Button>
                    )}
                </Form.Group>*/}
            </Form>
        </MokaCard>
    );
};

export default GroupEdit;
