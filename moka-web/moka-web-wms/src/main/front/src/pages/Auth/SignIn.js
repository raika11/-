import React, { useEffect, useState } from 'react';
import { loginJwt } from '@store/auth';
import { Button, Card, Col, Container, Form, FormCheck, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Main from '@/layout/components/Main';

const SignIn = () => {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState('ssc');
    const [password, setPassword] = useState('ssc#2020');

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
            <Main className="d-flex w-100 justify-content-center">
                <Container className="d-flex flex-column">
                    <Row className="h-100">
                        <Col sm="10" md="8" lg="6" className="mx-auto d-table h-100">
                            <div className="d-table-cell align-middle">
                                <div className="text-center mt-4">
                                    <h2>Welcome back, Chris</h2>
                                    <p className="lead">Sign in to your account to continue</p>
                                </div>
                                <Card>
                                    <Card.Body>
                                        <div className="m-sm-4">
                                            <Form>
                                                <Form.Group>
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control
                                                        type={'text'}
                                                        size="lg"
                                                        name="userid"
                                                        onChange={handleUserIdChange}
                                                        value={userId}
                                                        placeholder="Enter your email"
                                                    />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control
                                                        size="lg"
                                                        type="password"
                                                        name="password"
                                                        onChange={handlePasswrdChange}
                                                        value={password}
                                                        placeholder="Enter your password"
                                                    />
                                                </Form.Group>
                                                <div>
                                                    <FormCheck type="checkbox" id="rememberMe" label="Remember me next time" defaultChecked />
                                                </div>
                                                <div className="text-center mt-3">
                                                    <Button color="primary" size="lg" onClick={(e) => handleSubmit(e)}>
                                                        Sign in
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Main>
        </React.Fragment>
    );
};

export default SignIn;
