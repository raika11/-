import React from 'react';
import Helmet from 'react-helmet';
import { Route, Switch } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@/components';
import ArticlePackageList from './ArticlePackageList';
import ArticlePackageEdit from './ArticlePackageEdit';

/**
 * 패키지 관리 > 기사 패키지
 */
const ArticlePackage = ({ match, displayName }) => {
    return (
        <Container className="p-0">
            <Row noGutters>
                <Helmet>
                    <title>{displayName}</title>
                    <meta name="description" content={`${displayName} 페이지입니다.`} />
                    <meta name="robots" content="noindex" />
                </Helmet>

                <Col xs={7} className="pr-gutter">
                    <MokaCard className="w-100" bodyClassName="d-flex flex-column" title={displayName}>
                        <ArticlePackageList match={match} />
                    </MokaCard>
                </Col>

                <Switch>
                    <Route
                        path={[`${match.path}/add`, `${match.path}/:pkgSeq`]}
                        exact
                        render={() => (
                            <Col xs={5} className="p-0">
                                <ArticlePackageEdit match={match} />
                            </Col>
                        )}
                    />
                </Switch>
            </Row>
        </Container>
    );
};

export default ArticlePackage;
