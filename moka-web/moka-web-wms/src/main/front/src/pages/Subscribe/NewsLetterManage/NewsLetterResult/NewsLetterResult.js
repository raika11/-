import React from 'react';
import { Route } from 'react-router';
import Helmet from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@/components';
import NewsLetterResultList from './NewsLetterResultList';
import NewsLetterResultEdit from './NewsLetterResultEdit';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리
 */
const NewsLetterResult = ({ match, displayName }) => {
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
                        <NewsLetterResultList match={match} />
                    </MokaCard>
                </Col>

                <Col xs={5}>
                    <Route path={`${match.path}/:letterSeq`} exact render={() => <NewsLetterResultEdit />} />
                </Col>
            </Row>
        </Container>
    );
};

export default NewsLetterResult;
