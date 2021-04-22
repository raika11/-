import React from 'react';
import { Route } from 'react-router';
import Helmet from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@/components';
import NewsLetterSendArchiveList from './NewsLetterSendArchiveList';
import NewsLetterSendArchiveEdit from './NewsLetterSendArchiveEdit';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 관리 > 아카이브 확인(수동 발송된 뉴스레터 목록)
 */
const NewsLetterSendArchive = ({ match, displayName }) => {
    return (
        <Container className="p-0">
            <Row noGutters>
                <Helmet>
                    <title>{displayName}</title>
                    <meta name="description" content={`${displayName} 페이지입니다.`} />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* 리스트 */}
                <Col xs={3} className="pr-gutter">
                    <MokaCard className="w-100" bodyClassName="d-flex flex-column" title={displayName}>
                        <NewsLetterSendArchiveList match={match} />
                    </MokaCard>
                </Col>

                {/* 수동 발송 아카이브 목록 */}
                <Col xs={9}>
                    <Route path={`${match.path}/:letterSeq`} exact render={() => <NewsLetterSendArchiveEdit match={match} />} />
                </Col>
            </Row>
        </Container>
    );
};

export default NewsLetterSendArchive;
