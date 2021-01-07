import React, { useState, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard, MokaIconTabs } from '@/components';
import AgendaEdit from './MicAgendaEdit';

const AgendaList = React.lazy(() => import('./MicAgendaList'));

const Mic = ({ match }) => {
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    return (
        <Container className="p-0 position-relative" fluid>
            <Helmet>
                <title>시민 마이크</title>
                <meta name="description" content="시민 마이크 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Row>
                {/* 아젠다 목록 */}
                <Col sm={12} md={5} className="p-0">
                    <MokaCard title="아젠다 목록" titleClassName="mb-0" bodyClassName="d-flex flex-column" className="w-100 pr-gutter">
                        <Suspense>
                            <AgendaList />
                        </Suspense>
                    </MokaCard>
                </Col>

                {/* 아젠다 수정 */}
                <Route
                    path={[`${match.url}/add`, `${match.url}/:seqNo`]}
                    exact
                    render={() => (
                        <Col md={7} className="p-0">
                            <MokaIconTabs
                                tabContentClass="w-100"
                                onSelectNav={(idx) => setActiveTabIdx(idx)}
                                tabs={[<AgendaEdit show={activeTabIdx === 0} />]}
                                tabNavs={[
                                    { title: '아젠다 수정', text: 'Info' },
                                    // { title: '피드 목록', icon: <MokaIcon iconName="" /> },
                                    // { title: '포스트 목록', icon: <MokaIcon iconName="" /> },
                                ]}
                                foldable={false}
                            />
                        </Col>
                    )}
                />
            </Row>
        </Container>
    );
};

export default Mic;
