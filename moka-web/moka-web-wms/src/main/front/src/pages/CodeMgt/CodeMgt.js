import React, { useEffect, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { MokaCard } from '@components';
import { clearStore } from '@store/codeMgt';
import CodeMgtEdit from './CodeMgtEdit';
const CodeMgtList = React.lazy(() => import('./CodeMgtList'));

/**
 * 기타코드 관리
 */
const CodeMgt = ({ match }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <>
            <div className="d-flex">
                <Helmet>
                    <title>기타코드 관리</title>
                    <meta name="description" content="기타코드 관리 페이지입니다." />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* 기타코드 그룹 목록 */}
                <MokaCard width={280} className="mr-gutter" bodyClassName="d-flex flex-column" header={false}>
                    <Suspense>
                        <CodeMgtList match={match} />
                    </Suspense>
                </MokaCard>

                {/* 기타코드 편집 */}
                <Switch>
                    <Route
                        path={[`${match.path}/:grpCd`, `${match.path}/:grpCd/:cdSeq`]}
                        exact
                        render={() => (
                            <MokaCard width={1300} bodyClassName="d-flex flex-column" header={false}>
                                <CodeMgtEdit match={match} />
                            </MokaCard>
                        )}
                    />
                </Switch>
            </div>
        </>
    );
};

export default CodeMgt;
