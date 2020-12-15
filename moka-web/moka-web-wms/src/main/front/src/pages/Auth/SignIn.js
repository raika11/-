import React, { useState } from 'react';
import { loginJwt } from '@store/auth';
import { call, delay } from 'redux-saga/effects';
import { Button, Card, Col, Form, FormCheck, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Main from '@/layout/components/Main';
import { getLocalItem } from '@/utils/storageUtil';
import { SIGNIN_MEMBER_ID } from '@/constants';
import logo from '@assets/images/img_logo@2x.png';
import loginBg from '@assets/images/login_bg.png';
import { MokaIcon } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import UnlockModal from './modals/UnlockModal';

const SignIn = () => {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(getLocalItem(SIGNIN_MEMBER_ID) || 'ssc01');
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [password, setPassword] = useState('sscMoka#2020');
    const [passwordErrorCount, setPasswordErrorCount] = useState(0);
    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        login();
    };

    const login = () => {
        dispatch(
            loginJwt({
                userId: userId,
                userPassword: password,
                callback: ({ headers, data }) => {
                    if (headers.authorization) {
                        if (data.header.resultType === 0) {
                            toast.success(data.header.message);
                            delay(1000);
                            call(window.location.reload());
                        } else {
                            // 패스워드 변경 안내 팝업으로 변경 예정
                            messageBox.confirm(data.header.message, (ok) => {
                                if (ok) {
                                    toast.info('비밀번호 변경 페이지로 이동. 기능 구현중...');
                                } else {
                                    window.location.reload();
                                }
                            });
                        }
                    } else {
                        const resultType = data.header.resultType;
                        if (resultType < 150 || resultType >= 900) {
                            if (resultType === 100) {
                                setPasswordErrorCount(data.body.extra);
                            }
                            messageBox.alert(data.header.message);
                        } else if (resultType < 200) {
                            //confirm 창 출력 메시지
                        } else {
                            toast.error(data.header.message);
                        }
                    }
                },
            }),
        );
    };

    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
    };

    const handlePasswrdChange = (e) => {
        setPassword(e.target.value);
    };

    const handleClickApproval = (event) => {
        console.log(event);
    };
    const handleClickUnlock = (event) => {
        setShowUnlockModal(true);
    };

    return (
        <React.Fragment>
            <Main className="h-100 w-100 signin-main" style={{ background: '#080808 url(' + loginBg + ') no-repeat center / cover' }}>
                <div className="d-flex h-100 w-100 justify-content-center" style={{ background: 'rgb(60, 65, 93, 0.69)' }}>
                    <div className="d-flex flex-column">
                        <Row className="h-100">
                            <Col className="mx-auto d-table h-100">
                                <div className="h-100 d-flex flex-column flex-row mx-auto justify-content-center align-items-center">
                                    <Card className="w-100">
                                        <Card.Body>
                                            <div className="m-sm-4">
                                                <div className="w-100 text-left mb-7">
                                                    <span>
                                                        <img src={logo} alt="joongang" />
                                                    </span>
                                                    <h1 className="mt-10">BackOffice</h1>
                                                </div>
                                                <Form>
                                                    <Form.Group>
                                                        <Form.Label>
                                                            <MokaIcon iconName="fal-user" />
                                                        </Form.Label>
                                                        <Form.Control
                                                            type={'text'}
                                                            size="lg"
                                                            name="userid"
                                                            onChange={handleUserIdChange}
                                                            value={userId}
                                                            placeholder="ID"
                                                            autoComplete="off"
                                                        />
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Form.Label>
                                                            <MokaIcon iconName="fal-lock-alt" />
                                                        </Form.Label>
                                                        <Form.Control
                                                            size="lg"
                                                            type="password"
                                                            name="password"
                                                            onChange={handlePasswrdChange}
                                                            value={password}
                                                            placeholder="Password"
                                                            autoComplete="off"
                                                        />
                                                    </Form.Group>
                                                    <div className="user-info">
                                                        <FormCheck type="checkbox" id="rememberMe" label="Save ID" defaultChecked />
                                                        {passwordErrorCount ? (
                                                            <label class="password-error">
                                                                비밀번호 오류 <span>{passwordErrorCount}</span> 회
                                                            </label>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </div>
                                                    <div className="text-center signin-btn">
                                                        <Button className="w-100" color="primary" onClick={(e) => handleSubmit(e)}>
                                                            Sign in
                                                        </Button>
                                                    </div>
                                                    <div className="etc-btn">
                                                        <label onClick={handleClickApproval}>
                                                            BackOffice <span>사용신청</span>
                                                        </label>
                                                        <UnlockModal show={showUnlockModal} onHide={() => setShowUnlockModal(false)} /* onSave={onSave} onDelete={onDelete}*/ />
                                                    </div>
                                                    <div className="etc-btn">
                                                        <label onClick={handleClickUnlock}>
                                                            BackOffice <span>잠금해제</span>
                                                        </label>
                                                    </div>
                                                </Form>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Main>
        </React.Fragment>
    );
};

export default SignIn;
