import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBackOfficeUser, smsRequest, unlockRequest, approvalRequest, GET_GROUP_WARE_USER, SMS_REQUEST, UNLOCK_REQUEST, UNLOCK_SMS, confirmSmsAuthentication } from '@store/auth';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
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

    /**
     * default User object
     */

    defaultUserObj: PropTypes.object,
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
    const [userObj, setUserObj] = useState({ userId: '', userName: '', groupName: '', mobilePhone: '', phone: '', email: '' });
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
                memberId: userObj.memberId,
                /*password,
                confirmPassword,
                requestReason,*/
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
    }, [confirmPassword, dispatch, minutes, password, requestReason, requestSms, userObj.memberId]);

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
        setBackOfficeId('');
        setPassword('');
        setConfirmPassword('');
        setRequestReason('');
        setSmsUnlock(false);
        setRequestSms(false);
        setUserObj({ userId: '', userName: '', groupName: '', mobilePhone: '', phone: '', email: '' });
        setBtnOkDisplay('none');
        setSmsAuth('');
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
                width={600}
                height={800}
                size="md"
                draggable
                show={show}
                onHide={handleHide}
                headerClassName="p-0 d-block"
                bodyClassName="d-flex justify-content-center"
                titleAs={
                    <div style={{ marginBottom: '24px' }}>
                        <div className="text-left" style={{ marginTop: '20px', marginLeft: '32px', marginBottom: '14px' }}>
                            <img src={defaultImage} width={147} height={49} />
                        </div>
                        <h1 className="text-center" style={{ fontSize: '26px' }}>
                            잠금 해제
                        </h1>
                    </div>
                }
                buttons={[
                    {
                        text: '잠금 해제',
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
                    <Form.Row className="mb-3 align-items-center">
                        <Col xs={10} className="p-0 mr-2">
                            <MokaInputLabel
                                label="그룹웨어ID"
                                value={backOfficeId}
                                onChange={handleChangeValue}
                                name="backOfficeId"
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
                            <MokaInputLabel label="ID" name="memberId" value={userObj.memberId} onChange={handleChangeValue} inputProps={{ readOnly: true }} className="mb-2" />
                            <MokaInputLabel label="이름" name="memberNm" value={userObj.memberNm} onChange={handleChangeValue} inputProps={{ readOnly: true }} className="mb-2" />
                            <MokaInputLabel label="Email" name="email" value={userObj.email} onChange={handleChangeValue} inputProps={{ readOnly: true }} className="mb-2" />
                            <MokaInputLabel
                                label="휴대전화"
                                name="mobilePhone"
                                value={userObj.mobilePhone.replace(/(^01.{1})-([0-9]+)-([0-9]{4})/, '$1-$2-$3')}
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
                                    confirmSmsAuthenticationNumber(userObj.memberId, smsAuth);
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
                                    label="새 비밀번호"
                                    name="password"
                                    value={password}
                                    isInvalid={error.password}
                                    onChange={handleChangeValue}
                                    inputProps={{ autoComplete: 'off' }}
                                    placeholder="대/소문자, 특문, 숫자조합 10자리 이상."
                                    disabled={requestSms}
                                    required
                                    className="mb-2"
                                />
                                <MokaInputLabel
                                    type="password"
                                    label="새 비밀번호 확인"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    isInvalid={error.confirmPassword}
                                    onChange={handleChangeValue}
                                    inputProps={{ autoComplete: 'off' }}
                                    placeholder="대/소문자, 특문, 숫자조합 10자리 이상."
                                    disabled={requestSms}
                                    required
                                    className="mb-2"
                                />
                                <MokaInputLabel
                                    label="사유"
                                    name="requestReason"
                                    value={requestReason}
                                    isInvalid={error.requestReason}
                                    onChange={handleChangeValue}
                                    inputProps={{ autoComplete: 'off' }}
                                    placeholder="사유를 입력하세요."
                                    disabled={requestSms}
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

UnlockModal.propTypes = propTypes;

export default UnlockModal;
