import React, { useState, useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@/components';
import JaJopanEdit from './JaJopanEdit';
import { clearStore } from '@/store/rcvArticle';

const JaJopanList = React.lazy(() => import('./JaJopanList'));

/**
 * 수신기사 > 중앙일보 조판
 */
const JaJopan = ({ match, displayName }) => {
    const dispatch = useDispatch();
    const [view, setView] = useState(false);
    const layout = useSelector((store) => store.layout);

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
                <Col
                    sm={layout.sidebarIsOpen === true ? 5 : 4}
                    // md={7}
                    // clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })
                    className="p-0 pr-gutter"
                >
                    {/* 리스트 */}
                    <MokaCard title={displayName} className="w-100" bodyClassName="d-flex flex-column">
                        <Suspense>
                            <JaJopanList match={match} setView={setView} />
                        </Suspense>
                    </MokaCard>
                </Col>

                {/* {(matchPoints.md || matchPoints.lg) && ( */}
                {/* <Col sm={7} className="p-0">
                    <Route path={[`${match.path}/:sourceCode/:ho/:pressDate/:myun/:section/:revision`]} exact render={() => <JaJopanEdit match={match} />} />
                </Col> */}
                {/* )} */}
                {view && (
                    <Col sm={layout.sidebarIsOpen === true ? 7 : 8} className="p-0">
                        <JaJopanEdit match={match} />
                    </Col>
                )}

                {/* {(matchPoints.xs || matchPoints.sm) && (
                    <Route
                        path={[`${match.path}/:totalId`]}
                        exact
                        render={() => (
                            <Col xs={7} className="absolute-top-right h-100 overlay-shadow p-0" style={{ zIndex: 2 }}>
                                <ArticleEdit match={match} ja={name === 'articleJa' ? true : false} sun={name === 'articleSun' ? true : false} />
                            </Col>
                        )}
                    />
                )} */}
            </Row>
        </Container>
    );
};

export default JaJopan;
