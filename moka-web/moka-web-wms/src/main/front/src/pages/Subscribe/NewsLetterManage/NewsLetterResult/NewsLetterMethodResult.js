import React from 'react';
import Helmet from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { MokaCard } from '@/components';
import NewsLetterMethodResultList from './NewsLetterMethodResultList';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리 > 발송 방법별 결과
 */
const NewsLetterMethodResult = ({ match, displayName }) => {
    return (
        <Container className="p-0">
            <Row noGutters>
                <Helmet>
                    <title>{displayName}</title>
                    <meta name="description" content={`${displayName} 페이지입니다.`} />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* <Col xs={7} className="pr-gutter"> */}
                <MokaCard className="w-100" bodyClassName="d-flex flex-column" title={displayName}>
                    <NewsLetterMethodResultList match={match} />
                </MokaCard>
                {/* </Col> */}
            </Row>
        </Container>
    );
};

export default NewsLetterMethodResult;
