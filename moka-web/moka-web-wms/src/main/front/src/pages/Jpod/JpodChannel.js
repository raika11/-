import React, { useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@/components';
import { clearStore } from '@store/jpod';
import useBreakpoint from '@hooks/useBreakpoint';
import ChannelList from '@pages/Jpod/Channel/ChannelList';
import ChannelTab from '@pages/Jpod/Channel/ChannelTab';

/**
 * J팟 관리 > 채널
 */
const JpodChannel = ({ match, displayName }) => {
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
                    <Suspense>
                        <MokaCard className="w-100" bodyClassName="d-flex flex-column" title={`채널 리스트`}>
                            <ChannelList match={match} />
                        </MokaCard>
                    </Suspense>
                </Col>
                {/* 등록 / 수정창 */}
                {(matchPoints.md || matchPoints.lg) && (
                    <Col md={5} className="p-0">
                        <Switch>
                            <Route
                                path={([`${match.path}/add`], [`${match.path}/:chnlSeq`])}
                                exact
                                render={() => (
                                    <Suspense>
                                        <ChannelTab match={match} />
                                    </Suspense>
                                )}
                            />
                        </Switch>
                    </Col>
                )}
                {(matchPoints.xs || matchPoints.sm) && (
                    <Switch>
                        <Route
                            path={([`${match.path}/add`], [`${match.path}/:chnlSeq`])}
                            exact
                            render={() => (
                                <Col xs={7} className="color-bg-body absolute-top-right h-100 overlay-shadow p-0" style={{ zIndex: 2 }}>
                                    <Suspense>
                                        <ChannelTab match={match} />
                                    </Suspense>
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
