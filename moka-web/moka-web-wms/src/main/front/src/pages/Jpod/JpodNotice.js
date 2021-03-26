import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { clearStore, getJpodBoard } from '@store/jpod';
import useBreakpoint from '@hooks/useBreakpoint';
import NoticeList from '@pages/Jpod/JpodNotice/NoticeList';
import NoticeEdit from '@pages/Jpod/JpodNotice/NoticeEdit';

/**
 * J팟 관리 - 공지 게시판
 */
const JpodChannel = ({ match, displayName }) => {
    const dispatch = useDispatch();
    const matchPoints = useBreakpoint();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    useEffect(() => {
        // 최초 로딩시 JPOD 게시판 조회
        dispatch(getJpodBoard());
    }, [dispatch]);

    return (
        <Container className="p-0 position-relative" fluid>
            <Helmet>
                <title>{displayName}</title>
                <meta name="description" content={`${displayName} 페이지 입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Row className="m-0">
                {/* 리스트 */}
                <Col sm={12} md={7} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                    <NoticeList match={match} />
                </Col>
                {/* 등록 / 수정 */}
                {(matchPoints.md || matchPoints.lg) && (
                    <Col md={5} className="p-0">
                        <Switch>
                            <Route
                                path={[`${match.path}/add`, `${match.path}/:boardSeq`, `${match.path}/:boardSeq/:reply`, `${match.path}/:parentBoardSeq/:reply/:boardSeq`]}
                                exact
                                render={() => <NoticeEdit match={match} />}
                            />
                        </Switch>
                    </Col>
                )}
                {(matchPoints.xs || matchPoints.sm) && (
                    <Switch>
                        <Route
                            path={[`${match.path}/add`, `${match.path}/:boardSeq`, `${match.path}/:boardSeq/:reply`, `${match.path}/:parentBoardSeq/:reply/:boardSeq`]}
                            exact
                            render={() => (
                                <Col xs={7} className="absolute-top-right h-100 overlay-shadow p-0" style={{ zIndex: 2 }}>
                                    <NoticeEdit match={match} />
                                </Col>
                            )}
                        />
                    </Switch>
                )}
            </Row>
        </Container>
    );
};

export default JpodChannel;
