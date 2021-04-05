import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import { Col } from 'react-bootstrap';
import MyPageEdit from '@pages/MyPage/MyPageEdit';
import MyPageHelp from '@pages/MyPage/MyPageHelp';
import { useDispatch } from 'react-redux';
import { clearStore } from '@store/member';

const MyPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <Container className="p-0 position-relative" fluid>
            <Row className="m-0">
                <Helmet>
                    <title>마이페이지</title>
                    <meta name="description" content="마이페이지입니다." />
                    <meta name="robots" content="noindex" />
                </Helmet>
                <Col xs={5}>
                    <MyPageEdit />
                </Col>
                <Col xs={7}>
                    <MyPageHelp />
                </Col>
            </Row>
        </Container>
    );
};

export default MyPage;
