import React from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@components';
import ABList from './ABList';
import ABTab from './ABTab';

/**
 * A/B 테스트 > 전체 목록
 */
const AB = ({ match }) => {
    const currentMenu = useSelector(({ auth }) => auth.currentMenu);

    return (
        <Row className="d-flex" noGutters>
            <Helmet>
                <title>{currentMenu?.menuDisplayNm}</title>
                <meta name="description" content={`${currentMenu?.menuDisplayNm}페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <Col xs={7} className="pr-gutter">
                <MokaCard className="w-100" bodyClassName="d-flex flex-column" title={currentMenu?.menuDisplayNm}>
                    <ABList match={match} />
                </MokaCard>
            </Col>

            {/* 탭 (TODO 라우터 처리) */}
            <Col xs={5}>
                <ABTab match={match} />
            </Col>
        </Row>
    );
};

export default AB;
