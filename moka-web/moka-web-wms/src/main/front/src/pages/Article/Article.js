import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import { clearStore } from '@store/article';
import useBreakpoint from '@hooks/useBreakpoint';
import ArticleList from './ArticleList';
import ArticleEdit from './ArticleEdit';

/**
 * 등록기사
 */
const Article = ({ match, displayName, name }) => {
    const dispatch = useDispatch();
    const matchPoints = useBreakpoint();

    React.useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <Container className="p-0 position-relative" fluid>
            <Helmet>
                <title>{displayName}</title>
                <meta name="description" content={`${displayName} 페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Row className="m-0">
                <Col sm={12} md={7} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                    {/* 리스트 */}
                    <MokaCard className="w-100" bodyClassName="d-flex flex-column" title={displayName}>
                        <ArticleList match={match} ja={name === 'articleJa' ? true : false} sun={name === 'articleSun' ? true : false} />
                    </MokaCard>
                </Col>

                {(matchPoints.md || matchPoints.lg) && (
                    <Col md={5} className="p-0">
                        <Route
                            path={[`${match.path}/:totalId`]}
                            exact
                            render={() => <ArticleEdit match={match} ja={name === 'articleJa' ? true : false} sun={name === 'articleSun' ? true : false} />}
                        />
                    </Col>
                )}

                {(matchPoints.xs || matchPoints.sm) && (
                    <Route
                        path={[`${match.path}/:totalId`]}
                        exact
                        render={() => (
                            <Col xs={7} className="absolute-top-right h-100 overlay-shadow p-0" style={{ zIndex: 2 }}>
                                <ArticleEdit match={match} ja={name === 'articleJa' ? true : false} sun={name === 'articleSun' ? true : false} />
                            </Col>
                        )}
                    />
                )}
            </Row>
        </Container>
    );
};

export default Article;
