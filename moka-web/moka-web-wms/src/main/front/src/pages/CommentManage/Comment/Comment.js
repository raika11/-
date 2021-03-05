import React, { Suspense, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { MokaLoader } from '@components';
import { Helmet } from 'react-helmet';
import { clearStore, getInitData } from '@store/commentManage';
import clsx from 'clsx';
import { Col, Row } from 'react-bootstrap';
import useBreakpoint from '@hooks/useBreakpoint';
import Container from 'react-bootstrap/Container';

const CommentList = React.lazy(() => import('./CommentLIst'));

/**
 * 댓글 관리
 */
const Comment = ({ match }) => {
    const matchPoints = useBreakpoint();
    const dispatch = useDispatch();
    const matchPath = useRef(null);

    // 스토어 초기화.
    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    useEffect(() => {
        if (matchPath.current !== match.path) {
            matchPath.current = match.path;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match]);

    useEffect(() => {
        dispatch(getInitData());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container className="p-0 position-relative" fluid>
            <Row className="m-0">
                <Helmet>
                    <title>댓글 관리</title>
                    <meta name="description" content="댓글 관리 페이지 입니다." />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* 리스트 */}
                <Switch>
                    <Route
                        path={[`${match.path}`, `${match.path}/:commentSeq`]}
                        exact
                        render={() => (
                            <Col sm={12} md={12} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                                <Suspense fallback={<MokaLoader />}>
                                    <CommentList matchPath={matchPath.current} />
                                </Suspense>
                            </Col>
                        )}
                    />
                </Switch>
            </Row>
        </Container>
    );
};

export default Comment;
