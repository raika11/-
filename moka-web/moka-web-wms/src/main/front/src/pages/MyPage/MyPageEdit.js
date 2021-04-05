import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaCard, MokaInputLabel } from '@components';
import produce from 'immer';
import { messageBox } from '@utils/toastUtil';
import clsx from 'clsx';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { changePassword } from '@store/member';

const MyPageEdit = () => {
    const dispatch = useDispatch();
    const { AUTH } = useSelector(
        (store) => ({
            AUTH: store.app.AUTH,
        }),
        shallowEqual,
    );

    const [passwords, setPasswords] = useState({
        current: '',
        change: '',
        confirm: '',
    });

    const [hideMessages, setHideMessages] = useState({
        change: true,
        confirm: true,
    });

    const handleChangeValue = (name, value) => {
        if (name === 'change') {
            console.log(getPasswordValidateType(value));
            setHideMessages(
                produce(hideMessages, (draft) => {
                    draft[
                        name
                    ] = /^((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[0-9])(?=.*\W).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*)|((?=.{8,15}$)(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*)/.test(
                        value,
                    );
                }),
            );
        }

        if (name === 'confirm') {
            setHideMessages(
                produce(hideMessages, (draft) => {
                    draft[name] = passwords.change === value;
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
                        console.log(response);
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
            messageBox.alert('변경할 비밀번호 확인을 입력해주세요.');
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
            if (next_char == temp_char) seqCnt = seqCnt + 1;
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

            if (temp_char == next_char) repeatCnt = repeatCnt + 1;
            else repeatCnt = 1;

            if (repeatCnt > len - 1) {
                return false;
            }
        }

        return true;
    }

    function getPasswordValidateType(password) {
        let pwdLength = password.length;

        if (pwdLength == 0) return '';

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

    useEffect(() => {
        console.log(AUTH);
    }, [AUTH]);

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
                        <MokaInputLabel labelWidth={80} label="아이디" disabled={true} value={AUTH.userId} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel labelWidth={80} label="이름" disabled={true} value={AUTH.userName} />
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
                        />
                    </Col>
                    <Col xs={4} className={clsx({ 'd-none': hideMessages.change })}>
                        <div className="h-100 align-items-center d-flex">
                            <span className="color-positive">사용불가</span>
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
                        />
                    </Col>
                    <Col xs={4} className={clsx({ 'd-none': hideMessages.confirm })}>
                        <div className="h-100 align-items-center d-flex">
                            <span className="color-positive">비밀번호가 일치하지 않습니다.</span>
                        </div>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel labelWidth={80} label="소속그룹" disabled={true} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel labelWidth={80} label="소속부서" disabled={true} value={AUTH.dept} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel labelWidth={80} label="핸드폰번호" disabled={true} value={AUTH.cellPhoneNo} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel labelWidth={80} label="등록일" disabled={true} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12}>
                        <MokaInputLabel labelWidth={80} label="마지막 비번 변경일" disabled={true} value={moment(AUTH.passwordModDt).format(DB_DATEFORMAT)} />
                    </Col>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default MyPageEdit;
