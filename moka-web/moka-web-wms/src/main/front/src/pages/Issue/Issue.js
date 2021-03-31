import React from 'react';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@components';
import useBreakpoint from '@hooks/useBreakpoint';
import IssueList from './IssueList';
import IssueEdit from './IssueEdit';

/**
 * 패키지 관리
 */
const Issue = ({ match, displayName }) => {
    const matchPoints = useBreakpoint();

    return (
        <Container className="p-0 position-relative" fluid>
            <Helmet>
                <title>{displayName}</title>
                <meta name="description" content={`${displayName} 페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Row className="m-0">
                {/* 패키지 목록 */}
                <Col sm={12} md={7} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                    <MokaCard title="패키지 목록" className="w-100" bodyClassName="d-flex flex-column">
                        <IssueList match={match} />
                    </MokaCard>
                </Col>

                {/* 패키지 등록, 수정 */}
                {(matchPoints.md || matchPoints.lg) && (
                    <Col md={5} className="p-0">
                        <Route path={[`${match.path}/add`, `${match.path}/:seqNo`]} exact render={() => <IssueEdit match={match} />} />
                    </Col>
                )}

                {(matchPoints.xs || matchPoints.sm) && (
                    <Route
                        path={[`${match.path}/add`, `${match.path}/:seqNo`]}
                        exact
                        render={() => (
                            <div className="absolute-top-right h-100 overlay-shadow" style={{ width: 640, zIndex: 2 }}>
                                <IssueEdit match={match} />
                            </div>
                        )}
                    />
                )}
            </Row>
        </Container>
    );
};

export default Issue;
