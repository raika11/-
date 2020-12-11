import React, { useState } from 'react';
import { loginJwt } from '@store/auth';
import { Button, Card, Col, Form, FormCheck, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Main from '@/layout/components/Main';
import { getLocalItem } from '@/utils/storageUtil';
import { SIGNIN_MEMBER_ID } from '@/constants';
import logo from '@assets/images/img_logo@2x.png';
import loginBg from '@assets/images/login_bg.png';
import { MokaIcon } from '@components';

const SignIn = () => {
    const dispatch = useDispatch();

    const [userId, setUserId] = useState(getLocalItem(SIGNIN_MEMBER_ID) || 'ssc01');
    const [password, setPassword] = useState('sscMoka#2020');

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
            }),
        );
    };

    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
    };

    const handlePasswrdChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <React.Fragment>
            <Main className="h-100 w-100 signin-main" style={{ background: '#080808 url(' + loginBg + ') no-repeat center / cover' }}>
                <div className="d-flex h-100 w-100 justify-content-center" style={{ background: 'rgb(33, 35, 56, 0.3)' }}>
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
                                                        <Form.Control type={'text'} size="lg" name="userid" onChange={handleUserIdChange} value={userId} placeholder="ID" />
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
                                                        />
                                                    </Form.Group>
                                                    <div className="">
                                                        <FormCheck type="checkbox" id="rememberMe" label="Save ID" defaultChecked />
                                                    </div>
                                                    <div className="text-center signin-btn">
                                                        <Button className="w-100" color="primary" onClick={(e) => handleSubmit(e)}>
                                                            Sign in
                                                        </Button>
                                                    </div>
                                                    <div className="etc-btn">
                                                        <label>
                                                            BackOffice <span>사용신청</span>
                                                        </label>
                                                    </div>
                                                    <div className="etc-btn">
                                                        <label>
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
