import React from 'react';
import Helmet from 'react-helmet';
import { Route } from 'react-router-dom';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@components';
import useBreakpoint from '@hooks/useBreakpoint';
import ReporterList from './ReporterList';
import ReporterEdit from './ReporterEdit';

/**
 * 기자 관리
 */
const Reporter = ({ match, displayName }) => {
    const matchPoints = useBreakpoint();

    return (
        <Container className="p-0 position-relative" fluid>
            <Helmet>
                <title>{displayName}</title>
                <meta name="description" content={`${displayName} 페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Row className="m-0">
                {/* 기자 목록 */}
                <Col sm={12} md={7} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                    <MokaCard title="기자 목록" className="w-100" bodyClassName="d-flex flex-column">
                        <ReporterList match={match} />
                    </MokaCard>
                </Col>

                {/* 기자 정보 */}
                {(matchPoints.md || matchPoints.lg) && (
                    <Col md={5} className="p-0">
                        <Route path={[`${match.path}/:repSeq`]} exact render={() => <ReporterEdit match={match} />} />
                    </Col>
                )}

                {(matchPoints.xs || matchPoints.sm) && (
                    <Route
                        path={[`${match.path}/:repSeq`]}
                        exact
                        render={() => (
                            <div className="absolute-top-right h-100 overlay-shadow" style={{ width: 640, zIndex: 2 }}>
                                <ReporterEdit match={match} />
                            </div>
                        )}
                    />
                )}
            </Row>
        </Container>
    );
};

export default Reporter;
