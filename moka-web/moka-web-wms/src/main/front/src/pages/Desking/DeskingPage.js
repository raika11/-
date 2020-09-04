import React, { Suspense, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ColumnThree } from '~/layouts';
import { WmsLoader } from '~/components';

const DeskingDomainTreeContainer = React.lazy(() => import('./DeskingDomainTreeContainer'));
const DeskingTabContainer = React.lazy(() => import('./DeskingTabContainer'));
const DeskingRelationContainer = React.lazy(() => import('./relation/DeskingRelationContainer'));

/**
 * DeskingPage
 * @param {object} props Props
 */
const DeskingPage = (props) => {
    const { setResized } = props;

    useEffect(() => {
        setResized(false);
        return () => {
            setResized(true);
        };
    }, [setResized]);

    return (
        <>
            <Helmet>
                <title>화면편집</title>
                <meta name="description" content="화면편집관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>
            <ColumnThree
                {...props}
                sidebarSize="mini"
                widthOne="262"
                widthTwo="514"
                widthThree="1113"
            >
                {/* 도메인 트리 */}
                <Suspense fallback={<WmsLoader />}>
                    <DeskingDomainTreeContainer />
                </Suspense>

                {/* 편집화면 탭  */}
                <Suspense fallback={<WmsLoader />}>
                    <Switch>
                        <Route
                            path={['/desking', '/desking/:pageSeq']}
                            exact
                            render={() => <DeskingTabContainer />}
                        />
                    </Switch>
                </Suspense>

                {/* 기사 정보 */}
                <Suspense fallback={<WmsLoader />}>
                    <Switch>
                        <Route
                            path={['/desking', '/desking/:pageSeq']}
                            exact
                            render={() => <DeskingRelationContainer />}
                        />
                    </Switch>
                </Suspense>
            </ColumnThree>
        </>
    );
};

export default DeskingPage;
