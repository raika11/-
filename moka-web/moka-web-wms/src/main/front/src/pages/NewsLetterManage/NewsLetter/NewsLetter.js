import React, { useState } from 'react';
import { Route, Switch } from 'react-router';
import Helmet from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard, MokaIcon, MokaIconTabs } from '@/components';
import NewsLetterList from './NewsLetterList';
import NewsLetterEdit from './NewsLetterEdit';
import NewsLetterHistory from './NewsLetterHistoryList';

/**
 * 뉴스레터 관리 > 뉴스레터 상품 관리
 */
const NewsLetter = ({ match, displayName }) => {
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    return (
        <Container className="p-0">
            <Row noGutters>
                <Helmet>
                    <title>{displayName}</title>
                    <meta name="description" content={`${displayName} 페이지입니다.`} />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* 뉴스레터 상품 목록 */}
                <Col xs={7} className="pr-gutter">
                    <MokaCard className="w-100" bodyClassName="d-flex flex-column" title={displayName}>
                        <NewsLetterList match={match} />
                    </MokaCard>
                </Col>

                {/* 뉴스레터 상품 편집 */}
                <Col xs={5}>
                    <Switch>
                        <Route
                            path={[`${match.path}/add`, `${match.path}/:letterSeq`]}
                            exact
                            render={({ match: subMatch }) => {
                                const isAddPage = subMatch.url === `${match.path}/add`;
                                return (
                                    <MokaIconTabs
                                        className="w-100"
                                        activeKey={activeTabIdx}
                                        onSelectNav={(idx) => setActiveTabIdx(idx)}
                                        tabs={[<NewsLetterEdit match={match} setActiveTabIdx={setActiveTabIdx} />, <NewsLetterHistory show={activeTabIdx === 1} />]}
                                        tabNavs={[{ title: '뉴스레터', text: 'Info' }, !isAddPage && { title: '히스토리', icon: <MokaIcon iconName="fal-history" /> }].filter(
                                            Boolean,
                                        )}
                                        foldable={false}
                                        hasHotkeys
                                    />
                                );
                            }}
                        />
                    </Switch>
                </Col>
            </Row>
        </Container>
    );
};

export default NewsLetter;
