import React, { Suspense } from 'react';
import Helmet from 'react-helmet';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard, useBreakpoint } from '@components';
import { GET_REPORTER, CHANGE_REPORTER } from '@store/reporter';

import ReporterEdit from './ReporterEdit';
const ReporterList = React.lazy(() => import('./ReporterList'));

const Reporter = ({ match }) => {
    const loading = useSelector(({ loading }) => loading[GET_REPORTER] || loading[CHANGE_REPORTER]);
    const matchPoints = useBreakpoint();

    return (
        <Container className="p-0 position-relative" fluid>
            <Helmet>
                <title>기자관리</title>
                <meta name="description" content="기자관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Row className="m-0">
                <Col sm={12} md={7} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                    {/* 기자 목록 */}
                    <MokaCard title="기자 목록" width={830} className="w-100" bodyClassName="d-flex flex-column">
                        <Suspense>
                            <ReporterList match={match} />
                        </Suspense>
                    </MokaCard>
                </Col>

                {/* 기자 정보 */}
                {(matchPoints.md || matchPoints.lg) && (
                    <Col md={5} className="p-0">
                        <Route
                            path={[`${match.path}/:repSeq`]}
                            exact
                            render={() => (
                                <MokaCard title="기자 정보" className="w-100" loading={loading}>
                                    <ReporterEdit match={match} />
                                </MokaCard>
                            )}
                        />
                    </Col>
                )}

                {(matchPoints.xs || matchPoints.sm) && (
                    <Route
                        path={[`${match.path}/:repSeq`]}
                        exact
                        render={() => (
                            <div className="absolute-top-right h-100 overlay-shadow" style={{ width: 640, zIndex: 2 }}>
                                <MokaCard title="기자 정보" className="w-100" loading={loading}>
                                    <ReporterEdit match={match} />
                                </MokaCard>
                            </div>
                        )}
                    />
                )}
            </Row>
        </Container>
    );
};

export default Reporter;
