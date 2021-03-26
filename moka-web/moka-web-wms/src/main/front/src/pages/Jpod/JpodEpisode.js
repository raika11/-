import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { clearStore } from '@store/jpod';
import useBreakpoint from '@hooks/useBreakpoint';
import EpisodeList from '@pages/Jpod/Episode/EpisodeList';
import EpisodeEdit from '@pages/Jpod/Episode/EpisodeEdit';

/**
 * J팟 관리 > 에피소드
 */
const JpodEpisode = ({ match, displayName }) => {
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
                {/* 에피소드 리스트 */}
                <Col sm={12} md={7} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                    <EpisodeList match={match} />
                </Col>

                {/* 등록 / 수정 */}
                <Switch>
                    <Route
                        path={[`${match.path}/add`, `${match.path}/:chnlSeq/:epsdSeq`]}
                        exact
                        render={() => {
                            if (matchPoints.md || matchPoints.lg) {
                                return (
                                    <Col md={5} className="p-0">
                                        <EpisodeEdit match={match} />
                                    </Col>
                                );
                            }
                            return (
                                <Col xs={7} className="absolute-top-right h-100 overlay-shadow p-0" style={{ zIndex: 2 }}>
                                    <EpisodeEdit match={match} />
                                </Col>
                            );
                        }}
                    />
                </Switch>
            </Row>
        </Container>
    );
};

export default JpodEpisode;
