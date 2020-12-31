import React, { Suspense } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import clsx from 'clsx';
// import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard, useBreakpoint } from '@components';

import ArticleEdit from './ArticleEdit';
const ArticleList = React.lazy(() => import('./ArticleList'));

/**
 * 등록기사 전체
 */
const Article = ({ match }) => {
    // const dispatch = useDispatch();
    const matchPoints = useBreakpoint();

    // React.useEffect(() => {
    //     return () => {
    //         dispatch(clearStore());
    //     };
    // }, [dispatch]);

    return (
        <Container className="p-0 position-relative">
            <Helmet>
                <title>등록 기사 전체</title>
                <meta name="description" content="등록 기사 전체 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Row className="m-0">
                <Col sm={12} md={7} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                    {/* 리스트 */}
                    <MokaCard className="w-100" bodyClassName="d-flex flex-column" header={false}>
                        <Suspense>
                            <ArticleList />
                        </Suspense>
                    </MokaCard>
                </Col>

                {(matchPoints.md || matchPoints.lg) && (
                    <Col md={5} className="p-0">
                        <Route path={[`${match.url}/:totalId`]} exact render={() => <ArticleEdit />} />
                    </Col>
                )}

                {(matchPoints.xs || matchPoints.sm) && (
                    <Route
                        path={[`${match.url}/:totalId`]}
                        exact
                        render={() => (
                            <div className="absolute-top-right h-100 bg-dark" style={{ width: 590, zIndex: 2 }}>
                                <ArticleEdit />
                            </div>
                        )}
                    />
                )}
            </Row>
        </Container>
    );
};

export default Article;
