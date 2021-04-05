import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupWareUser, smsRequest, registerRequest, approvalRequest, GET_GROUP_WARE_USER, SMS_REQUEST, confirmSmsAuthentication } from '@store/auth';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaModal, MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { messageBox } from '@utils/toastUtil';
import { invalidListToError } from '@utils/convertUtil';
import defaultImage from '@assets/images/img_logo@2x@orange.png';
import commonUtil from '@utils/commonUtil';

const propTypes = {
    /**
     * show
     */
    show: PropTypes.bool.isRequired,
    /**
     * hide 함수
     */
    onHide: PropTypes.func.isRequired,
};

/**
 * 사용신청 모달
 */
const RegisterModal = (props) => {
    const dispatch = useDispatch();
    const { show, onHide } = props;
    // modal 항목 userObj
    const defaultMinutes = 3;
    const defaultSeconds = 0;
    const [userObj, setUserObj] = useState({ userId: '', userName: '', groupName: '', mobile: '', phone: '', email: '' });
    const [groupWareUserId, setGroupWareUserId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [requestReason, setRequestReason] = useState('');
    const [smsAuth, setSmsAuth] = useState('');
    const [requestSms, setRequestSms] = useState(false);
    const [minutes, setMinutes] = useState(defaultMinutes);
    const [seconds, setSeconds] = useState(defaultSeconds);
    const [newRequestCode, setNewRequestCode] = useState('');
    const [newSmsCode, setNewSmsCode] = useState('');
    const [smsUnlock, setSmsUnlock] = useState(false);
    const [invalidList, setInvalidList] = useState([]);
    const [btnOkDisplay, setBtnOkDisplay] = useState('none');
    const [registerRequestMessage, setRegisterRequestMessage] = useState('');
    const [error, setError] = useState({
        password: false,
        confirmPassword: false,
        requestReason: false,
    });

    const { loading } = useSelector((store) => ({
        loading: store.loading[GET_GROUP_WARE_USER] || store.loading[SMS_REQUEST],
    }));

    /**
     * modal의 항목 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;
        if (name === 'groupWareUserId') {
            setGroupWareUserId(value);
        } else if (name === 'password') {
            setPassword(value);
            setError({ ...error, password: false });
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
            setError({ ...error, confirmPassword: false });
        } else if (name === 'requestReason') {
            setRequestReason(value);
            setError({ ...error, confirmPassword: false });
        } else if (name === 'smsAuth') {
            setSmsAuth(value);
            setError({ ...error, smsAuth: false });
        }
    };

    const handleSearch = useCallback(() => {
        if (groupWareUserId.replace(/ /g, '').length > 0 && !/\s/.test(groupWareUserId)) {
            dispatch(
                getGroupWareUser({
                    groupWareUserId: groupWareUserId,
                    callback: ({ header, body }) => {
                        console.log(header, body);
                        if (header.success) {
                            /*if (body.groupWareUser.existMokaUserId) {
                                messageBox.alert('이미 등록된 ID 입니다.');
                            } else {
                                setNewRequestCode(body.NEW_REQUEST);
                                setNewSmsCode(body.NEW_SMS);
                                setUserObj(body.groupWareUser);
                            }*/
                            setNewRequestCode(body.NEW_REQUEST);
                            setNewSmsCode(body.NEW_SMS);
                            setUserObj(body.groupWareUser);
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        } else {
            messageBox.alert('아이디가 올바르지 않습니다.');
        }
    }, [dispatch, groupWareUserId]);

    /**
     * 입력된 validate체크
     * @param {} obj
     */
    const validate = (member) => {
        let isInvalid = false;
        let errList = [];
        if (
            !/^((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[0-9])(?=.*\W).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*)|((?=.{8,15}$)(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*)/.test(
                member.password,
            )
        ) {
            errList.push({
                field: 'password',
                reason: '비밀번호 형식이 올바르지 않습니다.',
            });
            isInvalid = isInvalid | true;
        }
        if (
            !/^((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[0-9])(?=.*\W).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*)|((?=.{8,15}$)(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*)/.test(
                member.confirmPassword,
            )
        ) {
            errList.push({
                field: 'confirmPassword',
                reason: '비밀번호 확인 형식이 올바르지 않습니다.',
            });
            isInvalid = isInvalid | true;
        }

        if (member.password !== member.confirmPassword) {
            errList.push({
                field: 'confirmPassword',
                reason: '입력하신 비밀번호와 비밀번호 확인이 일치하지 않습니다. 다시 입력해주세요.',
            });
            isInvalid = isInvalid | true;
        }
        if (member.requestReason === '') {
            errList.push({
                field: 'requestReason',
                reason: '사유는 필수 입력 항목 입니다.',
            });
            isInvalid = isInvalid | true;
        }

        if (typeof member.smsAuth !== 'undefined' && !/^[0-9]{4,6}$/.test(member.smsAuth)) {
            errList.push({
                field: 'smsAuth',
                reason: 'SMS인증번호는 4자리 이상 6자리 이하의 숫자로 입력하세요.',
            });
            isInvalid = isInvalid | true;
        }
        setInvalidList(errList);
        return !isInvalid;
    };

    /**
     * 인증번호 요청
     */
    const handleClickSmsRequest = useCallback(() => {
        if (!requestSms || parseInt(minutes) <= defaultMinutes - 2) {
            const member = {
                memberId: userObj.userId,
                /*password,
                confirmPassword,
                requestReason,*/
                requestType: newSmsCode,
            };

            /*if (validate(member)) {*/
            dispatch(
                smsRequest({
                    member: member,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            messageBox.alert(header.message);
                            setRequestSms(true);
                            setMinutes(defaultMinutes);
                            setSeconds(defaultSeconds);
                        } else {
                            if (body.totalCnt) {
                                setInvalidList(body.list);
                            } else {
                                messageBox.alert(header.message);
                            }
                        }
                    },
                }),
            );
            /*}*/
        } else {
            messageBox.alert('재전송 간격이 빠릅니다.\n잠시 후 다시 시도하시기 바랍니다.');
        }
    }, [confirmPassword, dispatch, minutes, newSmsCode, password, requestReason, requestSms, userObj.userId]);

    useEffect(() => {
        if (invalidList.length > 0) {
            setError(invalidListToError(invalidList));
            messageBox.alert(invalidList.map((element) => element.reason).join('\n'), () => {});
        }
    }, [invalidList]);

    /**
     * 인증번호 유효시간
     */
    useEffect(() => {
        let countDown;
        if (requestSms) {
            countDown = setInterval(() => {
                if (parseInt(seconds) > 0) {
                    setSeconds(parseInt(seconds) - 1);
                }
                if (parseInt(seconds) === 0) {
                    if (parseInt(minutes) === 0) {
                        messageBox.alert('인증 시간이 만료되었습니다.');
                        clearInterval(countDown);
                    } else {
                        setMinutes(parseInt(minutes) - 1);
                        setSeconds(59);
                    }
                }
            }, 1000);
            return () => clearInterval(countDown);
        } else {
            clearInterval(countDown);
        }
    }, [minutes, requestSms, seconds]);

    /**
     * 초기화
     */
    const reset = () => {
        setSmsAuth('');
        setGroupWareUserId('');
        setPassword('');
        setConfirmPassword('');
        setRequestReason('');
        setSmsUnlock(false);
        setRequestSms(false);
        setUserObj({ userId: '', userName: '', groupName: '', mobile: '', phone: '', email: '' });
        setBtnOkDisplay('none');
        setError({
            password: false,
            confirmPassword: false,
            requestReason: false,
        });
    };
    /**
     * 사용자 신규등록 요청
     */
    const handleClickRegisterRequest = useCallback(() => {
        const member = {
            memberId: userObj.userId,
            memberNm: userObj.userName,
            dept: userObj.groupName,
            mobilePhone: userObj.mobile,
            companyPhone: userObj.phone,
            email: userObj.email,
            password,
            confirmPassword,
            requestReason,
            requestType: newRequestCode,
        };
        if (validate(member)) {
            dispatch(
                registerRequest({
                    member: member,
                    callback: ({ header }) => {
                        messageBox.alert(header.message);
                        if (header.success) {
                            //setRegisterRequestMessage(header.message.replace(/\n/g, '<br />'));
                            //toast.success(header.message);
                            reset();
                            onHide();
                        } else {
                            setError({ ...error, smsAuth: true });
                        }
                    },
                }),
            );
        }
    }, [
        confirmPassword,
        dispatch,
        error,
        newRequestCode,
        password,
        requestReason,
        userObj.email,
        userObj.groupName,
        userObj.mobile,
        userObj.phone,
        userObj.userId,
        userObj.userName,
    ]);

    /**
     * 닫기
     */
    const handleHide = useCallback(() => {
        reset();
        onHide();
    }, [onHide]);

    const confirmSmsAuthenticationNumber = (memberId, smsAuth) => {
        if (!commonUtil.isEmpty(memberId) && !commonUtil.isEmpty(smsAuth) && memberId !== '' && smsAuth !== '') {
            dispatch(
                confirmSmsAuthentication({
                    memberId,
                    smsAuth,
                    callback: (response) => {
                        if (response.header.success) {
                            setBtnOkDisplay('block');
                            setRequestSms(false);
                            setSmsUnlock(true);
                        } else {
                            messageBox.alert(response.header.message);
                        }
                    },
                }),
            );
        } else {
            messageBox.alert('인증번호를 입력해주세요.');
        }
    };

    return (
        <>
            <MokaModal
                loading={loading}
                width={600}
                height={800}
                size="md"
                draggable
                show={show}
                onHide={handleHide}
                titleAs={
                    <div style={{ marginBottom: '24px' }}>
                        <div className="text-left" style={{ marginTop: '20px', marginLeft: '32px', marginBottom: '14px' }}>
                            <img src={defaultImage} width={147} height={49} />
                        </div>
                        <h1 className="text-center" style={{ fontSize: '26px' }}>
                            사용 신청
                        </h1>
                    </div>
                }
                headerClassName="p-0 d-block"
                bodyClassName="d-flex justify-content-center"
                buttons={[
                    {
                        text: '신청 완료',
                        variant: 'positive',
                        onClick: handleClickRegisterRequest,
                        style: { display: btnOkDisplay },
                    },
                    {
                        text: '취소',
                        variant: 'negative',
                        onClick: handleHide,
                    },
                ]}
                footerClassName="justify-content-center"
                centered
            >
                <Form className="mb-10">
                    <Form.Row className="mb-3 align-items-center">
                        <Col xs={10} className="p-0">
                            <MokaInputLabel
                                label="그룹웨어 ID"
                                value={groupWareUserId}
                                onChange={handleChangeValue}
                                name="groupWareUserId"
                                placeholder="BackOffice ID를 입력하세요."
                                disabled={requestSms}
                            />
                        </Col>
                        <Button variant="searching" onClick={handleSearch}>
                            조회
                        </Button>
                    </Form.Row>
                    <hr />
                    <Form.Row>
                        <Col xs={12} className="p-0 mb-0">
                            <MokaInputLabel label="아이디" name="userId" value={userObj.userId} onChange={handleChangeValue} inputProps={{ readOnly: true }} className="mb-2" />
                            <MokaInputLabel label="이름" name="userName" value={userObj.userName} onChange={handleChangeValue} inputProps={{ readOnly: true }} className="mb-2" />
                            <MokaInputLabel label="Email" name="email" value={userObj.email} onChange={handleChangeValue} inputProps={{ readOnly: true }} className="mb-2" />
                            <MokaInputLabel
                                label="소속사"
                                name="compnayName"
                                value={userObj.compnayName}
                                onChange={handleChangeValue}
                                inputProps={{ readOnly: true }}
                                className="mb-2"
                            />
                            <MokaInputLabel
                                label="소속팀"
                                name="groupName"
                                value={userObj.groupName}
                                onChange={handleChangeValue}
                                inputProps={{ readOnly: true }}
                                className="mb-2"
                            />
                            <MokaInputLabel
                                label="휴대전화"
                                name="mobile"
                                value={userObj.mobile.replace(/(^01.{1})-([0-9]+)-([0-9]{4})/, '$1-$2-$3')}
                                onChange={handleChangeValue}
                                inputProps={{ readOnly: true }}
                                className="mb-2"
                            />
                            <div className="d-flex align-items-center" style={{ height: '16px' }}>
                                <MokaInputLabel as="none" label=" " />
                                <p className="color-positive p-0 m-0 ft-10">※ 위 정보가 다른 경우, 그룹웨어에 문의해 주십시오.</p>
                            </div>
                            <div className="d-flex align-items-center" style={{ height: '16px' }}>
                                <MokaInputLabel as="none" label=" " />
                                <p className="p-0 m-0 ft-10">[그룹웨어 문의] 02-2031-1633</p>
                            </div>
                        </Col>
                    </Form.Row>
                    <hr />
                    <Form.Row>
                        <Col xs={12} className="p-0 d-flex">
                            <MokaInputLabel label="본인인증" name="smsAuth" onChange={handleChangeValue} value={smsAuth} className="mr-2" disabled={!requestSms} />
                            <Button
                                variant="positive"
                                className="mr-2 overflow-unset"
                                onClick={() => {
                                    confirmSmsAuthenticationNumber(userObj.userId, smsAuth);
                                }}
                                disabled={!requestSms}
                            >
                                확인
                            </Button>
                            <Button variant="searching" className="overflow-unset" onClick={handleClickSmsRequest}>
                                본인인증
                            </Button>
                        </Col>
                    </Form.Row>
                    <hr />
                    {smsUnlock && (
                        <Form.Row>
                            <Col xs={12} className="p-0">
                                <div className="d-flex align-items-center mb-2" style={{ height: '16px' }}>
                                    <p className="color-positive p-0 m-0 ft-10">※ 비밀번호는 8-15자의 영문, 대문자, 소문자, 숫자, 특수문자 중 3가지 이상 포함되어야 합니다.</p>
                                </div>
                                <MokaInputLabel
                                    type="password"
                                    label="비밀번호"
                                    name="password"
                                    value={password}
                                    isInvalid={error.password}
                                    onChange={handleChangeValue}
                                    inputProps={{ autoComplete: 'off' }}
                                    placeholder="대/소문자, 특문, 숫자조합 10자리 이상."
                                    className="mb-2"
                                    required
                                />
                                <MokaInputLabel
                                    type="password"
                                    label="비밀번호 확인"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    isInvalid={error.confirmPassword}
                                    onChange={handleChangeValue}
                                    inputProps={{ autoComplete: 'off' }}
                                    placeholder="대/소문자, 특문, 숫자조합 10자리 이상."
                                    className="mb-2"
                                    required
                                />
                                <MokaInputLabel
                                    label="사유"
                                    name="requestReason"
                                    value={requestReason}
                                    isInvalid={error.requestReason}
                                    onChange={handleChangeValue}
                                    inputProps={{ autoComplete: 'off' }}
                                    placeholder="사유를 입력하세요"
                                    required
                                />
                            </Col>
                        </Form.Row>
                    )}
                </Form>
            </MokaModal>
        </>
    );
};

RegisterModal.propTypes = propTypes;

export default RegisterModal;
