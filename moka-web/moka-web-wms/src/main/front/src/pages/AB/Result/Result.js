import React from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@components';
import ResultList from './ResultList';
import ResultInfo from './ResultInfo';

/**
 * A/B 테스트 > 테스트 결과
 */
const Result = ({ match }) => {
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
                    <ResultList match={match} />
                </MokaCard>
            </Col>

            {/* 탭 */}
            <Switch>
                <Route
                    path={[match.path, `${match.path}/add`, `${match.path}/:abTestSeq`]}
                    exact
                    render={() => (
                        <Col xs={5}>
                            <ResultInfo match={match} />
                        </Col>
                    )}
                />
            </Switch>
        </Row>
    );
};

export default Result;
