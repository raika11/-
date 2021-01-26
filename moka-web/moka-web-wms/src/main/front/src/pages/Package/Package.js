import React, { Suspense } from 'react';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@components';
import useBreakpoint from '@hooks/useBreakpoint';
import PackageEdit from './PackageEdit';

const PackageList = React.lazy(() => import('./PackageList'));

/**
 * 패키지 관리
 */
const Package = ({ match }) => {
    const matchPoints = useBreakpoint();

    return (
        <Container className="p-0 position-relative" fluid>
            <Helmet>
                <title>패키지 관리</title>
                <meta name="description" content="패키지 관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Row className="m-0">
                {/* 패키지 목록 */}
                <Col sm={12} md={7} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                    <MokaCard title="패키지 목록" width={830} className="w-100" bodyClassName="d-flex flex-column">
                        <Suspense>
                            <PackageList match={match} />
                        </Suspense>
                    </MokaCard>
                </Col>

                {/* 패키지 등록, 수정 */}
                {(matchPoints.md || matchPoints.lg) && (
                    <Col md={5} className="p-0">
                        <Route path={[`${match.path}/add`, `${match.path}/:seqNo`]} exact render={() => <PackageEdit match={match} />} />
                    </Col>
                )}

                {(matchPoints.xs || matchPoints.sm) && (
                    <Route
                        path={[`${match.path}/add`, `${match.path}/:seqNo`]}
                        exact
                        render={() => (
                            <div className="absolute-top-right h-100 overlay-shadow" style={{ width: 640, zIndex: 2 }}>
                                <PackageEdit match={match} />
                            </div>
                        )}
                    />
                )}
            </Row>
        </Container>
    );
};

export default Package;
