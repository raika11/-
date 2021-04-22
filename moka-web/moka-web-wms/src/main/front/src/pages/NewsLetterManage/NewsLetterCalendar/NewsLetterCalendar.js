import React from 'react';
import Helmet from 'react-helmet';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@/components';
import NewsLetterFullCalendar from './NewsLetterFullCalendar';
import NewsLetterCalendarAgGrid from './NewsLetterCalendarAgGrid';

/**
 * 뉴스레터 관리 > 뉴스레더 발송 일정
 */
const NewsLetterCalendar = ({ match, displayName }) => {
    return (
        <>
            <Helmet>
                <title>{displayName}</title>
                <meta name="description" content={`${displayName} 페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 캘린더 */}
            <MokaCard className="w-100" title={displayName}>
                <Row className="h-100 position-relative" noGutters>
                    <Col xs={10} className="pr-gutter">
                        <NewsLetterFullCalendar />
                    </Col>

                    <Col xs={2} className="d-flex flex-column">
                        <NewsLetterCalendarAgGrid />
                    </Col>
                </Row>
            </MokaCard>
        </>
    );
};

export default NewsLetterCalendar;
