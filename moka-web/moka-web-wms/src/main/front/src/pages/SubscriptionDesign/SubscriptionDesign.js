import React from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard, MokaIconTabs, MokaIcon } from '@components';
import SubscriptionDesignList from './SubscriptionDesignList';
import SubscriptionDesignEdit from './SubscriptionDesignEdit';

/**
 * 구독 관리 > 구독 설계
 */
const SubscriptionDesign = ({ match }) => {
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
                    <SubscriptionDesignList match={match} />
                </MokaCard>
            </Col>

            <Col xs={5}>
                <Route
                    path={[`${match.path}/add`, `${match.path}/:seqNo`]}
                    exact
                    render={() => (
                        <MokaIconTabs
                            tabs={[<SubscriptionDesignEdit match={match} />]}
                            tabNavs={[
                                { title: '구독 상세', text: 'Info' },
                                { title: '히스토리', icon: <MokaIcon iconName="fal-history" /> },
                            ]}
                        />
                    )}
                />
            </Col>
        </Row>
    );
};

export default SubscriptionDesign;
