import React from 'react';
import { Route, Switch } from 'react-router';
import Helmet from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@/components';
import NewsLetterSendList from './NewsLetterSendList';
import NewsLetterSendEdit from './NewsLetterSendEdit';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 관리
 */
const NewsLetterSend = ({ match, displayName }) => {
    return (
        <Container className="p-0">
            <Row noGutters>
                <Helmet>
                    <title>{displayName}</title>
                    <meta name="description" content={`${displayName} 페이지입니다.`} />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* 리스트 */}
                <Col xs={7} className="pr-gutter">
                    <MokaCard className="w-100" bodyClassName="d-flex flex-column" title={displayName}>
                        <NewsLetterSendList match={match} />
                    </MokaCard>
                </Col>

                <Col xs={5}>
                    <Switch>
                        <Route path={[`${match.path}/add`, `${match.path}/:sendSeq`]} exact render={() => <NewsLetterSendEdit match={match} />} />
                    </Switch>
                </Col>
            </Row>
        </Container>
    );
};

export default NewsLetterSend;
