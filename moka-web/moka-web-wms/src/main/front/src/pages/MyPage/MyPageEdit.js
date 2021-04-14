import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaCard, MokaInputLabel } from '@components';
import produce from 'immer';
import toast, { messageBox } from '@utils/toastUtil';
import clsx from 'clsx';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { changePassword, getMember } from '@store/member';
import commonUtil from '@utils/commonUtil';

const MyPageEdit = () => {
    const dispatch = useDispatch();
    const { AUTH, member } = useSelector(
        (store) => ({
            AUTH: store.app.AUTH,
            member: store.member.member,
        }),
        shallowEqual,
    );

    const [user, setUser] = useState({
        phone: '',
        dept: '',
        email: '',
        groupName: '',
        id: '',
        name: '',
        regDt: '',
    });

    const [passwords, setPasswords] = useState({
        current: '',
        change: '',
        confirm: '',
    });

    const [messages, setMessages] = useState({
        change: {
            hide: true,
            variant: 'positive',
            message: '',
        },
        confirm: {
            hide: true,
            variant: 'positive',
            message: '비밀번호가 일치하지 않습니다.',
        },
    });

    const handleChangeValue = (name, value) => {
        if (name === 'change') {
            setMessages({ ...messages, change: getPasswordValidateHtml(getPasswordValidateType(value)) });
            /*setHideMessages(
                produce(hideMessages, (draft) => {
                    draft[
                        name
                    ] = /^((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[0-9])(?=.*\W).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*)|((?=.{8,15}$)(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*)/.test(
                        value,
                    );
                }),
            );*/
        }

        if (name === 'confirm') {
            setMessages(
                produce(messages, (draft) => {
                    if (value === '' || passwords.change === value) {
                        draft[name].hide = true;
                        draft[name].variant = 'success';
                    } else {
                        draft[name].hide = false;
                        draft[name].variant = 'positive';
                    }
                }),
            );
        }

        setPasswords(
            produce(passwords, (draft) => {
                draft[name] = value;
            }),
        );
    };

    const handleClickSave = () => {
        if (validate(passwords)) {
            dispatch(
                changePassword({
                    memberId: AUTH.userId,
                    passwords,
                    callback: (response) => {
                        const { data } = response;
                        const { header, body } = data;
                        if (header.success) {
                            setPasswords({
                                current: '',
                                change: '',
                                confirm: '',
                            });
                            toast.result(data);
                        } else {
                            if (!commonUtil.isEmpty(body.list) && body.list.length > 0) {
                                messageBox.alert(body.list.map((element) => element.reason).join('\n'), () => {});
                            } else {
                                messageBox.alert(header.message);
                            }
                        }
                    },
                }),
            );
        }
    };

    const validate = ({ current, change, confirm }) => {
        if (current === '') {
            messageBox.alert('현재 비밀번호를 입력해주세요.');
            return false;
        }

        if (change === '') {
            messageBox.alert('변경할 비밀번호를 입력해주세요.');
            return false;
        }

        if (confirm === '') {
            messageBox.alert('입력하신 비밀번호와 비밀번호 확인이 일치하지 않습니다.\n다시 입력해주세요.');
            return false;
        }

        if (change !== confirm) {
            messageBox.alert('입력하신 비밀번호와 비밀번호 확인이 일치하지 않습니다.\n다시 입력해주세요.');
            return false;
        }

        return true;
    };

    function checkSequence(str, len) {
        let seqCnt = 1;

        for (let i = 0; i < str.length; i++) {
            const next_p = str.charAt(i);
            const next_char = parseInt(next_p.charCodeAt(0)) + 1;

            const temp_p = str.charAt(i + 1);
            const temp_char = parseInt(temp_p.charCodeAt(0));
            if (next_char === temp_char) seqCnt = seqCnt + 1;
            else seqCnt = 1;

            if (seqCnt > len - 1) {
                return false;
            }
        }

        return true;
    }

    //-----------------------------------------------------------------------------------------------
    // 반복 문자 체크(예-aaaa, 1111)
    //-----------------------------------------------------------------------------------------------
    function checkRepetition(str, len) {
        let repeatCnt = 1;

        for (let i = 0; i < str.length; i++) {
            const temp_char = str.charAt(i);
            const next_char = str.charAt(i + 1);

            if (temp_char === next_char) repeatCnt = repeatCnt + 1;
            else repeatCnt = 1;

            if (repeatCnt > len - 1) {
                return false;
            }
        }

        return true;
    }

    function getPasswordValidateType(password) {
        let pwdLength = password.length;

        if (pwdLength === 0) return '';

        //전체여부

        const filterNum = /[0-9]/; // 숫자만 있을경우
        const filterEng = /[a-zA-Z]/; // 영문만 있을경우
        const filterSpc = /[!@#$%^&*()\"_\/+=\-\[\]{}';:?<>.,~`|\\]/; // 특수문자만 있을경우

        const isIncNum = filterNum.test(password);
        const isIncEng = filterEng.test(password);
        const isIncSpc = filterSpc.test(password);

        const isOnlyNum = isIncNum && !isIncEng && !isIncSpc;
        const isOnlyEng = !isIncNum && isIncEng && !isIncSpc;
        const isOnlySpc = !isIncNum && !isIncEng && isIncSpc;

        //반복문자체크
        if (pwdLength > 3) {
            //4자리 부터 연속문자,반복문자 검사
            let tmpValue = password;
            if (checkSequence(tmpValue, 4) == false)
                //연속된 숫자,문자가 4번 반복되었을때
                return '04';
            else if (checkRepetition(tmpValue, 4) == false)
                //동일한 숫자,문자가 4번 반복됐을때
                return '05';
        }

        //한가지종류만 입력체크
        if (pwdLength < 8) {
            if (isOnlyNum)
                //숫자만 입력되었을때
                return '01';
            else if (isOnlyEng)
                //영문만 입력되었을때
                return '02';
            else if (isOnlySpc)
                //특수문자만 입력되었을때
                return '03';
            else return '00'; //6자 이하일때
        } else {
            if (isOnlyNum)
                //숫자만 입력되었을때 //취약
                return '11';
            else if (isOnlyEng)
                //영문만 입력되었을때 //취약
                return '12';
            else if (isOnlySpc)
                //특수문자만 입력되었을때 //취약
                return '13';
        }

        //**3단계
        if (pwdLength > 11)
            //12자 이상으로 영문, 숫자, 특수문자중 두가지 이상 포함된 경우
            return '31';
        //8자 이상으로 영문, 숫자, 특수문자중 두가지 이상 포함된 경우
        else return '21';
    }

    //-----------------------------------------------------------------------------------------------
    // 비밀번호TypeCode에 따른 풍선도움말 HTML 반환
    //-----------------------------------------------------------------------------------------------
    function getPasswordValidateHtml(type) {
        let helpMessage = {
            hide: true,
            variant: '',
            message: '',
        };

        if (type === '') {
        } else if (type === '00') {
            helpMessage = { hide: false, variant: 'positive', message: '사용불가' };
        } else if (type === '01') {
            helpMessage = { hide: false, variant: 'positive', message: '사용불가' };
        } else if (type === '02') {
            helpMessage = { hide: false, variant: 'positive', message: '사용불가' };
        } else if (type === '03') {
            helpMessage = { hide: false, variant: 'positive', message: '사용불가' };
        } else if (type === '04') {
            helpMessage = { hide: false, variant: 'positive', message: '사용불가' };
        } else if (type === '05') {
            helpMessage = { hide: false, variant: 'positive', message: '사용불가', alert: '동일한 문자, 숫자를 반복해서 사용하실 수 없습니다.' };
        } else if (type === '11') {
            helpMessage = { hide: false, variant: 'positive', message: '취약' };
        } else if (type === '12') {
            helpMessage = { hide: false, variant: 'positive', message: '취약' };
        } else if (type === '13') {
            helpMessage = { hide: false, variant: 'positive', message: '취약' };
        } else if (type === '21') {
            helpMessage = { hide: false, variant: 'success', message: '적정' };
        } else if (type === '31') {
            helpMessage = { hide: false, variant: 'success', message: '안전' };
        }

        return helpMessage;
    }

    useEffect(() => {
        dispatch(getMember(AUTH.userId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, AUTH]);

    useEffect(() => {
        if (member.memberId) {
            const groupName = member.groupMembers.map((group) => group.group.groupKorNm).join(', ');
            setUser({ ...user, id: member.memberId, name: member.memberNm, dept: member.dept, regDt: member.regDt, phone: member.mobilePhone, groupName });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [member]);

    return (
        <MokaCard
            title="내 정보 수정"
            className="w-100"
            footer
            footerButtons={[
                { text: '수정', variant: 'positive', className: 'mr-1', onClick: handleClickSave },
                { text: '취소', variant: 'negative', className: 'mr-1' },
            ]}
        >
            <Form>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel labelWidth={80} label="아이디" disabled={true} inputProps={{ plaintext: true }} value={user.id} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel labelWidth={80} label="이름" disabled={true} inputProps={{ plaintext: true }} value={user.name} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={8}>
                        <MokaInputLabel
                            labelWidth={80}
                            label="현재 비밀번호"
                            name="current"
                            type="password"
                            onChange={(e) => {
                                const { name, value } = e.target;
                                handleChangeValue(name, value);
                            }}
                            value={passwords.current}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={8}>
                        <MokaInputLabel
                            labelWidth={80}
                            label="변경할 비밀번호"
                            name="change"
                            value={passwords.change}
                            type="password"
                            onChange={(e) => {
                                const { name, value } = e.target;
                                handleChangeValue(name, value);
                            }}
                            onBlur={(e) => {
                                const { name } = e.target;
                                if (messages.change.variant === 'positive') {
                                    handleChangeValue(name, '');
                                }
                            }}
                        />
                    </Col>
                    <Col xs={4} className={clsx({ 'd-none': messages.change.hide })}>
                        <div className="h-100 align-items-center d-flex">
                            <span className={`color-${messages.change.variant}`}>{messages.change.message}</span>
                        </div>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={8}>
                        <MokaInputLabel
                            labelWidth={80}
                            label="변경할 비밀번호 확인"
                            name="confirm"
                            value={passwords.confirm}
                            type="password"
                            onChange={(e) => {
                                const { name, value } = e.target;
                                handleChangeValue(name, value);
                            }}
                            onBlur={(e) => {
                                const { name } = e.target;
                                if (messages.confirm.variant === 'positive') {
                                    handleChangeValue(name, '');
                                }
                            }}
                        />
                    </Col>
                    <Col xs={4} className={clsx({ 'd-none': messages.confirm.hide })}>
                        <div className="h-100 align-items-center d-flex">
                            <span className={`color-${messages.confirm.variant}`}>{messages.confirm.message}</span>
                        </div>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel labelWidth={80} label="소속그룹" disabled={true} inputProps={{ plaintext: true }} value={user.groupName} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel labelWidth={80} label="소속부서" disabled={true} inputProps={{ plaintext: true }} value={user.dept} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel labelWidth={80} label="핸드폰번호" disabled={true} inputProps={{ plaintext: true }} value={user.phone} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel labelWidth={80} label="등록일" disabled={true} inputProps={{ plaintext: true }} value={user.regDt} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel
                            labelWidth={80}
                            label="마지막 비번 변경일"
                            disabled={true}
                            inputProps={{ plaintext: true }}
                            value={moment(AUTH.passwordModDt).format(DB_DATEFORMAT)}
                        />
                    </Col>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default MyPageEdit;
