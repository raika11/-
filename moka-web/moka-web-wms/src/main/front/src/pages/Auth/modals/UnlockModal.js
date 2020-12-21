import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBackOfficeUser, smsRequest, unlockRequest, approvalRequest, GET_GROUP_WARE_USER, SMS_REQUEST, UNLOCK_REQUEST, UNLOCK_SMS } from '@store/auth';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaModal, MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
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
 * 잠금해제 모달
 */
const UnlockModal = (props) => {
    const dispatch = useDispatch();
    const { show, onHide } = props;
    // modal 항목 userObj
    const defaultMinutes = 3;
    const defaultSeconds = 0;
    const [userObj, setUserObj] = useState({});
    const [backOfficeId, setBackOfficeId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [requestReason, setRequestReason] = useState('');
    const [smsAuth, setSmsAuth] = useState('');
    const [smsUnlock, setSmsUnlock] = useState(false);
    const [requestSms, setRequestSms] = useState(false);
    const [minutes, setMinutes] = useState(defaultMinutes);
    const [seconds, setSeconds] = useState(defaultSeconds);
    const [unlockRequestCode, setUnlockRequestCode] = useState('');
    const [unlockSmsCode, setUnlockSmsCode] = useState('');

    const [invalidList, setInvalidList] = useState([]);
    const [btnOkDisplay, setBtnOkDisplay] = useState('none');
    const [error, setError] = useState({
        password: false,
        confirmPassword: false,
        requestReason: false,
    });

    const { loading } = useSelector((store) => ({
        loading: store.loading[GET_GROUP_WARE_USER] || store.loading[SMS_REQUEST] || store.loading[UNLOCK_REQUEST] || store.loading[UNLOCK_SMS],
    }));

    /**
     * modal의 항목 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;
        if (name === 'backOfficeId') {
            setBackOfficeId(value);
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
        if (!/\s/.test(backOfficeId) && backOfficeId.length > 0) {
            dispatch(
                getBackOfficeUser({
                    memberId: backOfficeId,
                    callback: ({ header, body }) => {
                        console.log(header, body);
                        if (header.success) {
                            setUnlockRequestCode(body.UNLOCK_REQUEST);
                            setUnlockSmsCode(body.UNLOCK_SMS);
                            setUserObj(body.member);
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        } else {
            messageBox.alert('아이디가 올바르지 않습니다.');
        }
    }, [dispatch, backOfficeId]);

    /**
     * 입력된 validate체크
     * @param {} obj
     */
    const validate = (member) => {
        let isInvalid = false;
        let errList = [];

        if (!/^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W)/.test(member.password)) {
            errList.push({
                field: 'password',
                reason: '비밀번호 형식이 올바르지 않습니다.',
            });
            isInvalid = isInvalid | true;
        }
        if (!/^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W)/.test(member.confirmPassword)) {
            errList.push({
                field: 'confirmPassword',
                reason: '비밀번호 확인 형식이 올바르지 않습니다.',
            });
            isInvalid = isInvalid | true;
        }

        if (member.password !== member.confirmPassword) {
            errList.push({
                field: 'confirmPassword',
                reason: '입력한 비밀번호와 확인 비밀번호가 일치하지 않습니다..',
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
     * 본인인증 해제
     */
    const handleClickSmsUnlock = useCallback(() => {
        const member = {
            memberId: userObj.memberId,
            password,
            confirmPassword,
            requestReason,
        };

        if (validate(member)) {
            setSmsUnlock(true);
            setBtnOkDisplay('block');
        }
    }, [confirmPassword, password, requestReason, userObj.memberId]);

    /**
     * 인증번호 요청
     */
    const handleClickSmsRequest = useCallback(() => {
        if (!requestSms || parseInt(minutes) <= defaultMinutes - 2) {
            const member = {
                memberId: userObj.memberId,
                password,
                confirmPassword,
                requestReason,
            };
            if (validate(member)) {
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
            }
        } else {
            messageBox.alert('재전송 간격이 빠릅니다.\n잠시 후 다시 시도하시기 바랍니다.');
        }
    }, [confirmPassword, dispatch, minutes, password, requestReason, requestSms, userObj.memberId]);

    useEffect(() => {
        // invalidList 처리
        if (invalidList.length > 0) {
            setError(
                invalidList.reduce(
                    (all, c) => ({
                        ...all,
                        [c.field]: true,
                    }),
                    {},
                ),
            );
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
        setBackOfficeId('');
        setPassword('');
        setConfirmPassword('');
        setRequestReason('');
        setSmsUnlock(false);
        setRequestSms(false);
        setUserObj({});
        setBtnOkDisplay('none');
        setError({
            password: false,
            confirmPassword: false,
            requestReason: false,
        });
    };
    /**
     * 본인인증 해제 전송
     */
    const handleClickApprovalRequest = useCallback(() => {
        const member = {
            memberId: userObj.memberId,
            smsAuth,
            password,
            confirmPassword,
            requestReason,
            requestType: unlockSmsCode,
        };

        if (validate(member)) {
            dispatch(
                approvalRequest({
                    member: member,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            messageBox.alert(header.message, () => {
                                reset();
                                onHide();
                            });
                        } else {
                            setError({ ...error, smsAuth: true });
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        }
    }, [confirmPassword, dispatch, error, onHide, password, requestReason, smsAuth, unlockSmsCode, userObj.memberId]);

    /**
     * 관리자 해제 요청
     */
    const handleClickUnlockRequest = useCallback(() => {
        const member = {
            memberId: userObj.memberId,
            password,
            confirmPassword,
            requestReason,
            requestType: unlockRequestCode,
        };

        if (validate(member)) {
            dispatch(
                unlockRequest({
                    member: member,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            messageBox.alert(header.message, () => {
                                reset();
                                onHide();
                            });
                        } else {
                            setError({ ...error, smsAuth: true });
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        }
    }, [confirmPassword, dispatch, error, onHide, password, requestReason, unlockRequestCode, userObj.memberId]);

    /**
     * 닫기
     */
    const handleHide = useCallback(() => {
        reset();
        onHide();
    }, [onHide]);

    return (
        <>
            <MokaModal
                loading={loading}
                width={420}
                size="md"
                draggable
                show={show}
                onHide={handleHide}
                title="BackOffice 잠금해제"
                buttons={[
                    {
                        text: '확인',
                        variant: 'positive',
                        onClick: handleClickApprovalRequest,
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
                    <Form.Group as={Row} className="mb-3 align-items-center">
                        <Col xs={3} className="p-0">
                            <Form.Label className="px-0 mb-0 position-relative flex-shrink-0 form-label" style={{ marginLeft: '8px' }}>
                                BackOffice ID
                            </Form.Label>
                        </Col>
                        <Col xs={9} className="p-0">
                            <MokaSearchInput
                                label="ID"
                                labelWidth={80}
                                value={backOfficeId}
                                onChange={handleChangeValue}
                                onSearch={handleSearch}
                                name="backOfficeId"
                                disabled={requestSms}
                                placeholder="BackOffice ID를 입력하세요."
                                inputProps={{ autoComplete: 'off' }}
                            />
                        </Col>
                    </Form.Group>
                    {userObj.memberId ? (
                        <>
                            <Form.Group as={Row} className="mb-3">
                                <Col xs={12} className="p-0 mb-0">
                                    <MokaInputLabel
                                        label="ID"
                                        labelWidth={80}
                                        name="memberId"
                                        value={userObj.memberId}
                                        onChange={handleChangeValue}
                                        inputProps={{ plaintext: true, readOnly: true }}
                                    />
                                    <MokaInputLabel
                                        label="이름"
                                        labelWidth={80}
                                        name="memberNm"
                                        value={userObj.memberNm}
                                        onChange={handleChangeValue}
                                        inputProps={{ plaintext: true, readOnly: true }}
                                    />
                                    <MokaInputLabel
                                        label="Email"
                                        labelWidth={80}
                                        name="email"
                                        value={userObj.email}
                                        onChange={handleChangeValue}
                                        inputProps={{ plaintext: true, readOnly: true }}
                                    />
                                    <MokaInputLabel
                                        label="휴대전화"
                                        labelWidth={80}
                                        name="mobilePhone"
                                        value={userObj.mobilePhone.replace(/(^01.{1})-([0-9]+)-([0-9]{4})/, '$1-$2-XXXX')}
                                        onChange={handleChangeValue}
                                        inputProps={{ plaintext: true, readOnly: true }}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Col xs={12} className="p-0">
                                    <MokaInputLabel
                                        type="password"
                                        label="비밀번호"
                                        labelWidth={80}
                                        name="password"
                                        value={password}
                                        isInvalid={error.password}
                                        onChange={handleChangeValue}
                                        inputProps={{ autoComplete: 'off' }}
                                        disabled={requestSms}
                                        required
                                    />
                                    <MokaInputLabel
                                        type="password"
                                        label="비밀번호 확인"
                                        labelWidth={80}
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        isInvalid={error.confirmPassword}
                                        onChange={handleChangeValue}
                                        inputProps={{ autoComplete: 'off' }}
                                        disabled={requestSms}
                                        required
                                    />
                                    <MokaInputLabel
                                        label="사유"
                                        labelWidth={80}
                                        name="requestReason"
                                        value={requestReason}
                                        isInvalid={error.requestReason}
                                        onChange={handleChangeValue}
                                        inputProps={{ autoComplete: 'off' }}
                                        disabled={requestSms}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 justify-content-md-center align-items-center">
                                <Button variant="outline-neutral" className="mr-10" onClick={handleClickUnlockRequest}>
                                    관리자 해제 요청
                                </Button>
                                {!smsUnlock ? (
                                    <Button variant="outline-neutral" onClick={handleClickSmsUnlock}>
                                        본인인증 해제
                                    </Button>
                                ) : (
                                    ''
                                )}
                            </Form.Group>
                            {smsUnlock ? (
                                <>
                                    <Form.Group as={Row} className="mb-3 justify-content-md-center align-items-center">
                                        <Form.Label className="form-label p-0 mb-0">
                                            BackOffice에 등록된 휴대번호로 본인인증 문자가 발송됩니다.
                                            <br />
                                            수신한 인증번호 입력 후 '확인' 버튼을 누르면 잠금이 해제됩니다.
                                        </Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3 justify-content-md-center align-items-center">
                                        {requestSms ? (
                                            <>
                                                <Col xs lg="2" className="p-0">
                                                    <Form.Label className="form-label p-0 mb-0" style={{ width: 60, minWidth: 60 }}>
                                                        인증번호
                                                    </Form.Label>
                                                </Col>
                                                <Col xs lg="3" className="p-0 mr-10">
                                                    <MokaInput name="smsAuth" value={smsAuth} onChange={handleChangeValue} inputProps={{ autoComplete: 'off' }} />
                                                </Col>
                                            </>
                                        ) : (
                                            ''
                                        )}
                                        <Col xs lg="4" className="p-0">
                                            <Button variant="outline-neutral" className="mr-2" onClick={handleClickSmsRequest}>
                                                인증번호 {requestSms ? '재전송' : '전송'}
                                            </Button>
                                        </Col>
                                        {requestSms ? (
                                            <Col xs lg="3" className="p-0">
                                                <Form.Label className="form-label p-0 mb-0  text-right" style={{ width: 90, minWidth: 90 }}>
                                                    남은시간 : {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                                                </Form.Label>
                                            </Col>
                                        ) : (
                                            ''
                                        )}
                                    </Form.Group>
                                </>
                            ) : (
                                ''
                            )}
                        </>
                    ) : (
                        ''
                    )}
                </Form>
            </MokaModal>
        </>
    );
};

UnlockModal.propTypes = propTypes;

export default UnlockModal;
