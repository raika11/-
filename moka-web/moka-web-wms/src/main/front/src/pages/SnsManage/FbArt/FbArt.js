import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@components';
import useBreakpoint from '@hooks/useBreakpoint';

import FbArtEdit from './FbArtEdit';
const FbArtList = React.lazy(() => import('./FbArtList'));

/**
 * FB전송기사
 */
const FbArt = ({ match, displayName }) => {
    const matchPoints = useBreakpoint();
    // FIXME 클린 함수 생성.

    return (
        <Container className="p-0 position-relative" fluid>
            <Helmet>
                <title>{displayName}</title>
                <meta name="description" content={`${displayName} 페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Row className="m-0">
                {/* 리스트 */}
                <Col sm={12} md={7} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                    <MokaCard className="w-100" bodyClassName="d-flex flex-column" title="Facebook 전송기사">
                        <Suspense>
                            <FbArtList />
                        </Suspense>
                    </MokaCard>
                </Col>

                {/* 등록/수정창 */}
                {(matchPoints.md || matchPoints.lg) && (
                    <Col md={5} className="p-0">
                        <Route path={[`${match.url}/:totalId`]} exact render={(props) => <FbArtEdit {...props} />} />
                    </Col>
                )}

                {(matchPoints.xs || matchPoints.sm) && (
                    <Route
                        path={[`${match.path}/:totalId`]}
                        exact
                        render={() => (
                            <Col xs={7} className="absolute-top-right h-100 overlay-shadow p-0" style={{ zIndex: 2 }}>
                                <Route path={[`${match.url}/:totalId`]} exact render={(props) => <FbArtEdit {...props} />} />
                            </Col>
                        )}
                    />
                )}
            </Row>
        </Container>
    );
};

export default FbArt;
