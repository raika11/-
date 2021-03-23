import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@components';
import { clearStore } from '@store/columnist';
import useBreakpoint from '@hooks/useBreakpoint';
import ColumnistList from './ColumnistList';
import ColumnistEdit from '@pages/Columnist/ColumnistEdit';

/**
 * 컬럼니스트 관리
 */
const Columnist = ({ match, displayName }) => {
    const dispatch = useDispatch();
    const matchPoints = useBreakpoint();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

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
                    <MokaCard className="w-100" bodyClassName="d-flex flex-column" title="칼럼니스트 관리">
                        <ColumnistList match={match} />
                    </MokaCard>
                </Col>

                {/* 등록/수정창 */}
                {(matchPoints.md || matchPoints.lg) && (
                    <Col md={5} className="p-0">
                        <Switch>
                            <Route path={[`${match.path}/add`, `${match.path}/:seqNo`]} exact render={() => <ColumnistEdit match={match} />} />
                        </Switch>
                    </Col>
                )}
                {(matchPoints.xs || matchPoints.sm) && (
                    <Switch>
                        <Route
                            path={[`${match.path}/add`, `${match.path}/:seqNo`]}
                            exact
                            render={() => (
                                <Col xs={7} className="absolute-top-right h-100 overlay-shadow p-0" style={{ zIndex: 2 }}>
                                    <ColumnistEdit match={match} />
                                </Col>
                            )}
                        />
                    </Switch>
                )}
            </Row>
        </Container>
    );
};

export default Columnist;
