import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MokaCard } from '@components';
import SEOMetaList from '@pages/SEOMeta/SEOMetaList';
import SEOMetaEdit from '@pages/SEOMeta/SEOMetaEdit';
import { clearStore } from '@store/seoMeta';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import useBreakpoint from '@hooks/useBreakpoint';
import clsx from 'clsx';
import { Col } from 'react-bootstrap';

/**
 * SEO 메타 관리
 */
const SEOMeta = ({ match }) => {
    const matchPoints = useBreakpoint();
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <Container className="p-0 position-relative" fluid>
            <Row className="m-0">
                <Helmet>
                    <title>SEO 메타관리</title>
                    <meta name="description" content="SEO 메타관리 페이지입니다." />
                    <meta name="robots" content="noindex" />
                </Helmet>

                <Col sm={12} md={7} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                    <MokaCard bodyClassName="d-flex flex-column" className="w-100" title="SEO 메타관리">
                        <SEOMetaList match={match} />
                    </MokaCard>
                </Col>

                <Route
                    path={[`${match.url}/:totalId`]}
                    exact
                    render={() => {
                        let clazz = 'absolute-top-right h-100 overlay-shadow';
                        let xs = 7;
                        if (matchPoints.md || matchPoints.lg) {
                            xs = 5;
                            clazz = '';
                        }
                        return (
                            <Col xs={xs} className={clsx('p-0  color-bg-body', clazz)} style={{ zIndex: 2 }}>
                                <SEOMetaEdit match={match} />
                            </Col>
                        );
                    }}
                />
            </Row>
        </Container>
    );
};

export default SEOMeta;
